'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Image from 'next/image';
import { CreateBannerREQ, UpdateBannerREQ } from '@/types/banner/banner.req';
import { useBannerQuery } from '@/hooks/useBannerQuery';
import { useCreateBanner, useUpdateBanner } from '@/hooks/useCreateBanner';
import { useUploadFile } from '@/hooks/useUploadFile';
import { BANNERS_QUERY_KEY } from '@/hooks/useBannersQuery';
import Switch from '@/components/form/switch/Switch';

export default function BannerFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const bannerId = params.id as string;
  const isCreateMode = bannerId === 'create';

  const [formData, setFormData] = useState<CreateBannerREQ>({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    startDate: '',
    endDate: '',
    order: 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use custom hooks
  const { data: bannerData, isLoading: isLoadingBanner } = useBannerQuery(
    bannerId,
    !isCreateMode
  );

  const uploadMutation = useUploadFile();
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();

  useEffect(() => {
    if (!isCreateMode && bannerData?.data) {
      const banner = bannerData.data;
      // Format dates for datetime-local input
      const formatDateForInput = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        title: banner.title,
        description: banner.description || '',
        imageUrl: banner.imageUrl,
        link: banner.link || '',
        startDate: formatDateForInput(banner.startDate),
        endDate: formatDateForInput(banner.endDate),
        order: banner.order,
      });
      setImagePreview(banner.imageUrl);
    }
  }, [bannerData, isCreateMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'banners');
    formData.append('customFileName', `banner-${Date.now()}-${file.name}`);

    const res = await uploadMutation.mutateAsync(formData);
    return res.data.url;
  };

  const validateDates = () => {
    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select both start and end dates');
      return false;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (start >= end) {
      toast.error('End date must be after start date');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate dates
      if (!validateDates()) {
        setIsSubmitting(false);
        return;
      }

      let imageUrl = formData.imageUrl;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (!imageUrl) {
        toast.error('Please upload a banner image');
        setIsSubmitting(false);
        return;
      }

      const bannerData: CreateBannerREQ = {
        title: formData.title,
        description: formData.description || undefined,
        imageUrl,
        link: formData.link || undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        order: formData.order,
      };

      if (isCreateMode) {
        await createMutation.mutateAsync(bannerData);
        toast.success('Banner created successfully!');
      } else {
        const updateData: UpdateBannerREQ = bannerData;
        await updateMutation.mutateAsync({ id: bannerId, data: updateData });
        toast.success('Banner updated successfully!');
      }

      // Invalidate banners list query to refetch new data
      queryClient.invalidateQueries({ queryKey: [BANNERS_QUERY_KEY] });

      router.push('/banner');
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error(
        `Failed to ${isCreateMode ? 'create' : 'update'} banner. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCreateMode && isLoadingBanner) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          {isCreateMode ? 'Create New Banner' : 'Edit Banner'}
        </h2>
        <Link href="/banner">
          <Button variant="outline">Back to List</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-x-6">
              <div className="lg:col-span-2">
                <Label>Banner Title *</Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Enter banner title"
                  value={formData.title}
                  onChange={handleInputChange}
                  maxLength={255}
                  required
                />
              </div>
              <div className="lg:col-span-2">
                <Label>Description</Label>
                <textarea
                  name="description"
                  placeholder="Enter banner description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="focus:border-brand-500 focus:ring-brand-500 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 placeholder-gray-400 transition focus:ring-1 focus:outline-none dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white/90 dark:placeholder-gray-500"
                />
              </div>
              <div className="lg:col-span-2">
                <Label>Click-through Link (URL)</Label>
                <Input
                  type="url"
                  name="link"
                  placeholder="https://example.com"
                  value={formData.link}
                  onChange={handleInputChange}
                  maxLength={500}
                />
              </div>
              <div>
                <Label>Start Date *</Label>
                <Input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>End Date *</Label>
                <Input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  name="order"
                  placeholder="0"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="0"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Lower numbers display first
                </p>
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
              Banner Image *
            </h4>
            <div className="space-y-4">
              <div>
                <Label>Upload Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-3 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-400 dark:file:bg-blue-900/20 dark:file:text-blue-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended size: 1200x400px. Max file size: 5MB
                </p>
              </div>
              {imagePreview && (
                <div className="relative">
                  <div className="relative aspect-[3/1] overflow-hidden rounded-lg">
                    <Image
                      src={imagePreview}
                      alt="Banner preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/banner">
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : isCreateMode
                  ? 'Create Banner'
                  : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
