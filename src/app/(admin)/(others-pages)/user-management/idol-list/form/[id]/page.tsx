'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { getIdolByIdAPI, createIdolAPI, updateIdolAPI } from '@/api/idol.api';
import { getCommunitiesAPI } from '@/api/community.api';
import { uploadFileAPI } from '@/api/file.api';
import { CreateIdolREQ, UpdateIdolREQ } from '@/types/idol/idol.req';
import { IDOLS_QUERY_KEY } from '@/hooks/useIdolsQuery';
import Image from 'next/image';

export default function IdolForm() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const idolId = params.id as string;
  const isCreateMode = idolId === 'create';

  const [formData, setFormData] = useState<CreateIdolREQ>({
    stageName: '',
    email: '',
    password: '',
    communityId: '',
    bio: '',
    avatarUrl: '',
    backgroundUrl: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [backgroundPreview, setBackgroundPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch idol data for edit mode
  const { data: idolData, isLoading: isLoadingIdol } = useQuery({
    queryKey: ['idol', idolId],
    queryFn: () => getIdolByIdAPI(idolId),
    enabled: !isCreateMode && !!idolId,
  });

  // Fetch communities for the dropdown
  const { data: communitiesData, isLoading: isLoadingCommunities } = useQuery({
    queryKey: ['communities'],
    queryFn: () => getCommunitiesAPI({ page: 1, limit: 100 }),
  });

  const communities = communitiesData?.data || [];
  const communityOptions = communities.map((community) => ({
    image: community.avatarUrl,
    value: community.id,
    label: community.name,
  }));

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: uploadFileAPI,
  });

  // Create/Update mutations
  const createMutation = useMutation({
    mutationFn: createIdolAPI,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIdolREQ }) =>
      updateIdolAPI(id, data),
  });

  useEffect(() => {
    if (!isCreateMode && idolData?.data) {
      const idol = idolData.data;
      setFormData({
        stageName: idol.stageName,
        email: idol.user.email,
        password: '',
        communityId: idol.communityId,
        bio: idol.bio || '',
        avatarUrl: idol.avatarUrl,
        backgroundUrl: idol.backgroundUrl,
      });
      setAvatarPreview(idol.avatarUrl || '');
      setBackgroundPreview(idol.backgroundUrl || '');
    }
  }, [idolData, isCreateMode]);

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
      [name]: name === 'isActive' ? value === 'true' : value,
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
    formData.append('customFileName', `idol-${Date.now()}-${file.name}`);

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
        avatarUrl = await uploadSingleFile(avatarFile, 'idols');
      }

      // Upload background if new file selected
      if (backgroundFile) {
        backgroundUrl = await uploadSingleFile(backgroundFile, 'idols');
      }

      if (isCreateMode) {
        const createData: CreateIdolREQ = {
          email: formData.email,
          password: formData.password,
          stageName: formData.stageName,
          communityId: formData.communityId,
          avatarUrl,
          backgroundUrl,
          bio: formData.bio,
        };

        await createMutation.mutateAsync(createData);
        alert('Idol created successfully!');
      } else {
        const updateData: UpdateIdolREQ = {
          stageName: formData.stageName,
          communityId: formData.communityId,
          avatarUrl,
          backgroundUrl,
          bio: formData.bio,
        };

        await updateMutation.mutateAsync({ id: idolId, data: updateData });
        alert('Idol updated successfully!');
      }

      // Invalidate idol list query to refetch new data
      queryClient.invalidateQueries({ queryKey: [IDOLS_QUERY_KEY] });

      router.push('/user-management/idol-list');
    } catch (error) {
      console.error('Error saving idol:', error);
      alert(
        `Failed to ${isCreateMode ? 'create' : 'update'} idol. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCreateMode && isLoadingIdol) {
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
          {isCreateMode ? 'Create New Idol' : 'Edit Idol'}
        </h2>
        <Link href="/user-management/idol-list">
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
                <Label>Stage Name *</Label>
                <Input
                  type="text"
                  name="stageName"
                  placeholder="Enter stage name"
                  defaultValue={formData.stageName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  defaultValue={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={!isCreateMode}
                />
              </div>
              {isCreateMode && (
                <div>
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    defaultValue={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
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
                  disabled={isLoadingCommunities}
                />
              </div>
              <div className="lg:col-span-2">
                <Label>Bio</Label>
                <Input
                  type="text"
                  name="bio"
                  placeholder="Enter bio"
                  defaultValue={formData.bio}
                  onChange={handleInputChange}
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
            <Link href="/user-management/idol-list">
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
                  ? 'Create Idol'
                  : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
