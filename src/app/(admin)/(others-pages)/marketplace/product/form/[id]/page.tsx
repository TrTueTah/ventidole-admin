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
import {
  CreateProductREQ,
  UpdateProductREQ,
} from '@/types/product/product.req';
import { useProductQuery } from '@/hooks/useProductQuery';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useCreateProduct';
import { useShopsQuery } from '@/hooks/useShopsQuery';
import { useUploadFile } from '@/hooks/useUploadFile';
import { PRODUCTS_QUERY_KEY } from '@/hooks/useProductsQuery';
import Switch from '@/components/form/switch/Switch';

export default function ProductFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const productId = params.id as string;
  const isCreateMode = productId === 'create';

  const [formData, setFormData] = useState<CreateProductREQ>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    shopId: '',
    typeId: '',
    mediaUrls: [],
    isActive: true,
  });

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use custom hooks
  const { data: productData, isLoading: isLoadingProduct } = useProductQuery(
    productId,
    !isCreateMode
  );

  const { data: shopsData, isLoading: isLoadingShops } = useShopsQuery({
    page: 1,
    limit: 100,
  });

  const uploadMutation = useUploadFile();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const shops = shopsData?.data || [];
  const shopOptions = shops.map((shop) => ({
    image: shop.avatarUrl || undefined,
    value: shop.id,
    label: shop.name,
  }));

  // Mock product types - replace with actual API call if needed
  const productTypeOptions = [
    { value: '', label: 'None' },
    { value: 'type1', label: 'Clothing' },
    { value: 'type2', label: 'Accessories' },
    { value: 'type3', label: 'Electronics' },
    { value: 'type4', label: 'Music' },
  ];

  useEffect(() => {
    if (!isCreateMode && productData?.data) {
      const product = productData.data;
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        shopId: product.shop?.id || '',
        typeId: product.type?.id || '',
        mediaUrls: product.mediaUrls || [],
        isActive: product.isActive,
      });
      setMediaPreviews(product.mediaUrls || []);
    }
  }, [productData, isCreateMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
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
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setMediaFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setMediaPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      mediaUrls: prev.mediaUrls?.filter((_, i) => i !== index) || [],
    }));
  };

  const uploadMultipleFiles = async (files: File[]) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');
      formData.append('customFileName', `product-${Date.now()}-${file.name}`);

      const res = await uploadMutation.mutateAsync(formData);
      return res.data.url;
    });

    return await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let mediaUrls = formData.mediaUrls || [];

      // Upload new media files if selected
      if (mediaFiles.length > 0) {
        const uploadedUrls = await uploadMultipleFiles(mediaFiles);
        mediaUrls = [...mediaUrls, ...uploadedUrls];
      }

      if (isCreateMode) {
        const createData: CreateProductREQ = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          shopId: formData.shopId,
          typeId: formData.typeId || undefined,
          mediaUrls,
          isActive: formData.isActive,
        };

        await createMutation.mutateAsync(createData);
        toast.success('Product created successfully!');
      } else {
        const updateData: UpdateProductREQ = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          shopId: formData.shopId,
          typeId: formData.typeId || undefined,
          mediaUrls,
          isActive: formData.isActive,
        };

        await updateMutation.mutateAsync({ id: productId, data: updateData });
        toast.success('Product updated successfully!');
      }

      // Invalidate products list query to refetch new data
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });

      router.push('/marketplace/product');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(
        `Failed to ${isCreateMode ? 'create' : 'update'} product. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCreateMode && isLoadingProduct) {
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
          {isCreateMode ? 'Create New Product' : 'Edit Product'}
        </h2>
        <Link href="/marketplace/product">
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
                <Label>Product Name *</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  defaultValue={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Shop *</Label>
                <Select
                  options={shopOptions}
                  placeholder={
                    isLoadingShops ? 'Loading shops...' : 'Select shop'
                  }
                  defaultValue={formData.shopId}
                  onChange={(value) => handleSelectChange('shopId', value)}
                  required
                />
              </div>
              <div>
                <Label>Price *</Label>
                <Input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  defaultValue={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label>Stock *</Label>
                <Input
                  type="number"
                  name="stock"
                  placeholder="0"
                  defaultValue={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div>
                <Label>Product Type</Label>
                <Select
                  options={productTypeOptions}
                  placeholder="Select product type"
                  defaultValue={formData.typeId}
                  onChange={(value) => handleSelectChange('typeId', value)}
                />
              </div>
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
              <div className="lg:col-span-2">
                <Label>Description</Label>
                <textarea
                  name="description"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="focus:border-brand-500 focus:ring-brand-500 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 placeholder-gray-400 transition focus:ring-1 focus:outline-none dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white/90 dark:placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
              Product Images
            </h4>
            <div className="space-y-4">
              <div>
                <Label>Upload Images</Label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="mb-3 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-400 dark:file:bg-blue-900/20 dark:file:text-blue-400"
                />
              </div>
              {mediaPreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {mediaPreviews.map((url, index) => (
                    <div key={index} className="relative">
                      <div className="relative aspect-square overflow-hidden rounded-lg">
                        <Image
                          src={url}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <svg
                          className="h-4 w-4"
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
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/marketplace/product">
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
                  ? 'Create Product'
                  : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
