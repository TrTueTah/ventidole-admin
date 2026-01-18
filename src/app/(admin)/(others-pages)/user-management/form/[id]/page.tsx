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
import { CreateUserREQ } from '@/types/user/user.req';
import { AccountRole } from '@/enums/role.enum';
import { useUserQuery } from '@/hooks/useUserQuery';
import { useCreateUser } from '@/hooks/useCreateUser';
import { useCommunitiesQuery } from '@/hooks/useCommunitiesQuery';
import { useUploadFile } from '@/hooks/useUploadFile';
import { USERS_QUERY_KEY } from '@/hooks/useUsersQuery';

export default function UserFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = params.id as string;
  const isCreateMode = userId === 'create';

  const [formData, setFormData] = useState<CreateUserREQ>({
    username: '',
    email: '',
    password: '',
    role: AccountRole.FAN,
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

  // Use custom hooks
  const { data: userData, isLoading: isLoadingUser } = useUserQuery(
    userId,
    !isCreateMode
  );

  const { data: communitiesData, isLoading: isLoadingCommunities } =
    useCommunitiesQuery({ page: 1, limit: 100 });

  const uploadMutation = useUploadFile();
  const createMutation = useCreateUser();

  const communities = communitiesData?.data || [];
  const communityOptions = communities.map((community) => ({
    image: community.avatarUrl || undefined,
    value: community.id,
    label: community.name,
  }));

  // Show community field only when role is IDOL
  const shouldShowCommunity = formData.role === AccountRole.IDOL;

  // Role options
  const roleOptions = [
    { value: AccountRole.FAN, label: 'Fan' },
    { value: AccountRole.IDOL, label: 'Idol' },
    { value: AccountRole.ADMIN, label: 'Admin' },
  ];

  useEffect(() => {
    if (!isCreateMode && userData?.data) {
      const user = userData.data;
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
        communityId: user.community?.id || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
        backgroundUrl: user.backgroundUrl || '',
      });
      setAvatarPreview(user.avatarUrl || '');
      setBackgroundPreview(user.backgroundUrl || '');
    }
  }, [userData, isCreateMode]);

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
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };

      // Clear communityId if role changes to FAN
      if (name === 'role' && value === AccountRole.FAN) {
        newData.communityId = '';
      }

      return newData;
    });
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
    formData.append('customFileName', `user-${Date.now()}-${file.name}`);

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
        avatarUrl = await uploadSingleFile(avatarFile, 'users');
      }

      // Upload background if new file selected
      if (backgroundFile) {
        backgroundUrl = await uploadSingleFile(backgroundFile, 'users');
      }

      if (isCreateMode) {
        const createData: CreateUserREQ = {
          email: formData.email,
          password: formData.password,
          username: formData.username,
          role: formData.role,
          avatarUrl,
          backgroundUrl,
          bio: formData.bio,
          // Only include communityId if role is IDOL
          ...(formData.role === AccountRole.IDOL && formData.communityId
            ? { communityId: formData.communityId }
            : {}),
        };

        await createMutation.mutateAsync(createData);
        toast.success('User created successfully!');
      }

      // Invalidate users list query to refetch new data
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });

      router.push('/user-management');
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(
        `Failed to ${isCreateMode ? 'create' : 'update'} user. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCreateMode && isLoadingUser) {
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
          {isCreateMode ? 'Create New User' : 'Edit User'}
        </h2>
        <Link href="/user-management">
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
                <Label>Username *</Label>
                <Input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  defaultValue={formData.username}
                  onChange={handleInputChange}
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
                  />
                </div>
              )}
              <div>
                <Label>Role *</Label>
                <Select
                  options={roleOptions}
                  placeholder="Select role"
                  defaultValue={formData.role}
                  onChange={(value) => handleSelectChange('role', value)}
                />
              </div>
              {shouldShowCommunity && (
                <div>
                  <Label>
                    Community {formData.role === AccountRole.IDOL ? '*' : ''}
                  </Label>
                  <Select
                    options={communityOptions}
                    placeholder={
                      isLoadingCommunities
                        ? 'Loading communities...'
                        : 'Select community'
                    }
                    defaultValue={formData.communityId}
                    onChange={(value) =>
                      handleSelectChange('communityId', value)
                    }
                  />
                </div>
              )}
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
            <Link href="/user-management">
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
                  ? 'Create User'
                  : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
