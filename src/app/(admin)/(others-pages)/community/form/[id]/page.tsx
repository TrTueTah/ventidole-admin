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
import {
  CreateCommunityREQ,
  UpdateCommunityREQ,
} from '@/types/community/community.req';
import { useCommunityQuery } from '@/hooks/useCommunityQuery';
import { useCreateCommunity } from '@/hooks/useCreateCommunity';
import { useUpdateCommunity } from '@/hooks/useUpdateCommunity';
import { useUploadFile } from '@/hooks/useUploadFile';
import { COMMUNITIES_QUERY_KEY } from '@/hooks/useCommunitiesQuery';

export default function CommunityFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const communityId = params.id as string;
  const isCreateMode = communityId === 'create';

  const [formData, setFormData] = useState<CreateCommunityREQ>({
    name: '',
    description: '',
    avatarUrl: '',
    backgroundUrl: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [backgroundPreview, setBackgroundPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use custom hooks
  const { data: communityData, isLoading: isLoadingCommunity } =
    useCommunityQuery(communityId, !isCreateMode);

  const uploadMutation = useUploadFile();
  const createMutation = useCreateCommunity();
  const updateMutation = useUpdateCommunity();

  useEffect(() => {
    if (!isCreateMode && communityData?.data) {
      const community = communityData.data;
      setFormData({
        name: community.name,
        description: community.description || '',
        avatarUrl: community.avatarUrl || '',
        backgroundUrl: community.backgroundUrl || '',
      });
      setAvatarPreview(community.avatarUrl || '');
      setBackgroundPreview(community.backgroundUrl || '');
    }
  }, [communityData, isCreateMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'background'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'avatar') {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      } else {
        setBackgroundFile(file);
        setBackgroundPreview(URL.createObjectURL(file));
      }
    }
  };

  const uploadSingleFile = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('customFileName', `community-${Date.now()}-${file.name}`);

    const res = await uploadMutation.mutateAsync(formData);
    return res.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let avatarUrl = formData.avatarUrl;
      let backgroundUrl = formData.backgroundUrl;

      // Upload avatar if new file selected
      if (avatarFile) {
        avatarUrl = await uploadSingleFile(avatarFile, 'communities');
      }

      // Upload background if new file selected
      if (backgroundFile) {
        backgroundUrl = await uploadSingleFile(backgroundFile, 'communities');
      }

      if (isCreateMode) {
        const createData: CreateCommunityREQ = {
          name: formData.name,
          description: formData.description,
          avatarUrl,
          backgroundUrl,
        };

        await createMutation.mutateAsync(createData);
        toast.success('Community created successfully!');
      } else {
        const updateData: UpdateCommunityREQ = {
          name: formData.name,
          description: formData.description,
          avatarUrl,
          backgroundUrl,
        };

        await updateMutation.mutateAsync({
          id: communityId,
          data: updateData,
        });
        toast.success('Community updated successfully!');
      }

      // Invalidate communities list query to refetch new data
      queryClient.invalidateQueries({ queryKey: [COMMUNITIES_QUERY_KEY] });

      router.push('/community');
    } catch (error) {
      console.error('Error saving community:', error);
      toast.error(
        `Failed to ${isCreateMode ? 'create' : 'update'} community. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCreateMode && isLoadingCommunity) {
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
          {isCreateMode ? 'Create New Community' : 'Edit Community'}
        </h2>
        <Link href="/community">
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
            <div className="grid grid-cols-1 gap-5">
              <div>
                <Label>Community Name *</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter community name"
                  defaultValue={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  name="description"
                  placeholder="Enter community description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="focus:border-brand-500 focus:ring-brand-500 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 placeholder-gray-400 transition focus:ring-1 focus:outline-none dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white/90 dark:placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
              Images
            </h4>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-x-6">
              <div>
                <Label>Avatar</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'avatar')}
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
              <div>
                <Label>Background Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'background')}
                  className="mb-3 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-400 dark:file:bg-blue-900/20 dark:file:text-blue-400"
                />
                {backgroundPreview && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={backgroundPreview}
                      alt="Background preview"
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
            <Link href="/community">
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : isCreateMode
                  ? 'Create Community'
                  : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
