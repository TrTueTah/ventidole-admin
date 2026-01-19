'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Image from 'next/image';
import { CreateShopREQ, UpdateShopREQ } from '@/types/shop/shop.req';
import { useShopQuery } from '@/hooks/useShopQuery';
import { useCreateShop, useUpdateShop } from '@/hooks/useCreateShop';
import { useCommunitiesQuery } from '@/hooks/useCommunitiesQuery';
import { useUploadFile } from '@/hooks/useUploadFile';
import { SHOPS_QUERY_KEY } from '@/hooks/useShopsQuery';
import Switch from '@/components/form/switch/Switch';

export default function ShopFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const shopId = params.id as string;
  const isCreateMode = shopId === 'create';

  const [formData, setFormData] = useState<CreateShopREQ>({
    name: '',
    description: '',
    communityId: '',
    avatarUrl: '',
    isActive: true,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use custom hooks
  const { data: shopData, isLoading: isLoadingShop } = useShopQuery(
    shopId,
    !isCreateMode
  );

  const { data: communitiesData, isLoading: isLoadingCommunities } =
    useCommunitiesQuery({ page: 1, limit: 100 });

  const uploadMutation = useUploadFile();
  const createMutation = useCreateShop();
  const updateMutation = useUpdateShop();

  const communities = communitiesData?.data || [];
  const communityOptions = communities.map((community) => ({
    image: community.avatarUrl || undefined,
    value: community.id,
    label: community.name,
  }));

  useEffect(() => {
    if (!isCreateMode && shopData?.data) {
      const shop = shopData.data;
      setFormData({
        name: shop.name,
        description: shop.description || '',
        communityId: shop.community?.id || '',
        avatarUrl: shop.avatarUrl || '',
        isActive: shop.isActive,
      });
      setAvatarPreview(shop.avatarUrl || '');
    }
  }, [shopData, isCreateMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadSingleFile = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('customFileName', `shop-${Date.now()}-${file.name}`);

    const res = await uploadMutation.mutateAsync(formData);
    return res.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let avatarUrl = formData.avatarUrl;

      // Upload avatar if new file selected
      if (avatarFile) {
        avatarUrl = await uploadSingleFile(avatarFile, 'shops');
      }

      if (isCreateMode) {
        const createData: CreateShopREQ = {
          name: formData.name,
          description: formData.description,
          communityId: formData.communityId,
          avatarUrl,
        };

        await createMutation.mutateAsync(createData);
        toast.success('Shop created successfully!');
      } else {
        const updateData: UpdateShopREQ = {
          name: formData.name,
          description: formData.description,
          communityId: formData.communityId,
          avatarUrl,
          isActive: formData.isActive,
        };

        await updateMutation.mutateAsync({ id: shopId, data: updateData });
        toast.success('Shop updated successfully!');
      }

      // Invalidate shops list query to refetch new data
      queryClient.invalidateQueries({ queryKey: [SHOPS_QUERY_KEY] });

      router.push('/marketplace/shop');
    } catch (error) {
      console.error('Error saving shop:', error);
      toast.error(
        `Failed to ${isCreateMode ? 'create' : 'update'} shop. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCreateMode && isLoadingShop) {
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
          {isCreateMode ? 'Create New Shop' : 'Edit Shop'}
        </h2>
        <Link href="/marketplace/shop">
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
              <div>
                <Label>Shop Name *</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter shop name"
                  defaultValue={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Community *</Label>
                <Select
                  options={communityOptions}
                  placeholder={
                    isLoadingCommunities
                      ? 'Loading communities...'
                      : 'Select community'
                  }
                  defaultValue={formData.communityId}
                  onChange={(value) => handleSelectChange('communityId', value)}
                  required
                />
              </div>
              <div className="lg:col-span-2">
                <Label>Description</Label>
                <Input
                  type="text"
                  name="description"
                  placeholder="Enter shop description"
                  defaultValue={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              {!isCreateMode && (
                <div>
                  <Label>Status</Label>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formData.isActive}
                      onChange={(checked) =>
                        handleSwitchChange('isActive', checked)
                      }
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
              Shop Avatar
            </h4>
            <div className="grid grid-cols-1 gap-5">
              <div>
                <Label>Avatar</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-3 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-400 dark:file:bg-blue-900/20 dark:file:text-blue-400"
                />
                {avatarPreview && (
                  <div className="relative h-32 w-32 overflow-hidden rounded-lg">
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/marketplace/shop">
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : isCreateMode
                  ? 'Create Shop'
                  : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
