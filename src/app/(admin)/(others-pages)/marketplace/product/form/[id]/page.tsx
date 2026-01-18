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
  CreateVariantREQ,
  UpdateVariantREQ,
} from '@/types/product/product.req';
import { ProductVariantDto } from '@/types/product/product.dto';
import { useProductQuery } from '@/hooks/useProductQuery';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useCreateProduct';
import { useShopsQuery } from '@/hooks/useShopsQuery';
import { useUploadFile } from '@/hooks/useUploadFile';
import { PRODUCTS_QUERY_KEY } from '@/hooks/useProductsQuery';
import { useProductTypesQuery } from '@/hooks/useProductTypesQuery';
import { useCreateProductType } from '@/hooks/useProductTypeMutation';
import { PRODUCT_TYPES_QUERY_KEY } from '@/hooks/useProductTypesQuery';
import Switch from '@/components/form/switch/Switch';
import { Modal } from '@/components/ui/modal';

type VariantFormData = {
  id?: string;
  name: string;
  price: number;
  stock: number;
  isActive?: boolean;
  isNew?: boolean; // Track if this is a new variant being added
};

type ProductFormData = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  shopId: string;
  typeId?: string;
  mediaUrls?: string[];
  isActive?: boolean; // Used in edit mode only
};

export default function ProductFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const productId = params.id as string;
  const isCreateMode = productId === 'create';

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    shopId: '',
    typeId: '',
    mediaUrls: [],
    isActive: true,
  });

  const [variants, setVariants] = useState<VariantFormData[]>([]);
  const [originalVariantIds, setOriginalVariantIds] = useState<string[]>([]);
  const [existingMediaUrls, setExistingMediaUrls] = useState<string[]>([]); // Already uploaded URLs
  const [newMediaFiles, setNewMediaFiles] = useState<File[]>([]); // New files to upload
  const [newMediaPreviews, setNewMediaPreviews] = useState<string[]>([]); // Previews for new files
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New type modal state
  const [isNewTypeModalOpen, setIsNewTypeModalOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [isCreatingType, setIsCreatingType] = useState(false);

  // Use custom hooks
  const { data: productData, isLoading: isLoadingProduct } = useProductQuery(
    productId,
    !isCreateMode
  );

  const { data: shopsData, isLoading: isLoadingShops } = useShopsQuery({
    page: 1,
    limit: 100,
  });

  const { data: productTypesData, isLoading: isLoadingTypes } =
    useProductTypesQuery({
      page: 1,
      limit: 100,
    });

  const uploadMutation = useUploadFile();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const createTypeMutation = useCreateProductType();

  const shops = shopsData?.data || [];
  const shopOptions = shops.map((shop) => ({
    image: shop.avatarUrl || undefined,
    value: shop.id,
    label: shop.name,
  }));

  const productTypes = productTypesData?.data || [];
  const productTypeOptions = [
    { value: '', label: 'None' },
    ...productTypes.map((type) => ({
      value: type.id,
      label: type.name,
    })),
    { value: '__new__', label: '+ Create New Type' },
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
      setExistingMediaUrls(product.mediaUrls || []);

      // Set variants from product data
      if (product.variants && product.variants.length > 0) {
        const variantData = product.variants.map((v: ProductVariantDto) => ({
          id: v.id,
          name: v.name,
          price: v.price,
          stock: v.stock,
          isActive: v.isActive,
          isNew: false,
        }));
        setVariants(variantData);
        setOriginalVariantIds(product.variants.map((v: ProductVariantDto) => v.id));
      }
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
    if (name === 'typeId' && value === '__new__') {
      setIsNewTypeModalOpen(true);
      return;
    }
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
      setNewMediaFiles((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setNewMediaPreviews((prev) => [...prev, ...previews]);
    }
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(newMediaPreviews[index]);
    setNewMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setNewMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate total stock from variants
  const calculateTotalVariantStock = (variantList: VariantFormData[]) => {
    return variantList.reduce((sum, v) => sum + (v.stock || 0), 0);
  };

  // Update form stock when variants change
  const updateStockFromVariants = (variantList: VariantFormData[]) => {
    if (variantList.length > 0) {
      const totalStock = calculateTotalVariantStock(variantList);
      setFormData((prev) => ({ ...prev, stock: totalStock }));
    }
  };

  // Variant handlers
  const handleAddVariant = () => {
    const newVariants = [
      ...variants,
      { name: '', price: 0, stock: 0, isActive: true, isNew: true },
    ];
    setVariants(newVariants);
    updateStockFromVariants(newVariants);
  };

  const handleVariantChange = (
    index: number,
    field: keyof VariantFormData,
    value: string | number | boolean
  ) => {
    const newVariants = variants.map((v, i) =>
      i === index
        ? { ...v, [field]: field === 'price' || field === 'stock' ? Number(value) : value }
        : v
    );
    setVariants(newVariants);

    // Update total stock if stock field changed
    if (field === 'stock') {
      updateStockFromVariants(newVariants);
    }
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
    updateStockFromVariants(newVariants);
  };

  // New type modal handlers
  const handleCreateNewType = async () => {
    if (!newTypeName.trim()) {
      toast.error('Please enter a type name');
      return;
    }

    setIsCreatingType(true);
    try {
      const result = await createTypeMutation.mutateAsync({ name: newTypeName.trim() });
      queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_QUERY_KEY] });
      setFormData((prev) => ({ ...prev, typeId: result.data.id }));
      setIsNewTypeModalOpen(false);
      setNewTypeName('');
      toast.success('Product type created successfully!');
    } catch (error) {
      console.error('Error creating product type:', error);
      toast.error('Failed to create product type');
    } finally {
      setIsCreatingType(false);
    }
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
      // Combine existing URLs with newly uploaded ones
      let mediaUrls = [...existingMediaUrls];

      // Upload new media files if selected
      if (newMediaFiles.length > 0) {
        const uploadedUrls = await uploadMultipleFiles(newMediaFiles);
        mediaUrls = [...mediaUrls, ...uploadedUrls];
      }

      if (isCreateMode) {
        // Prepare variants for create
        const createVariants: CreateVariantREQ[] = variants
          .filter((v) => v.name.trim())
          .map((v) => ({
            name: v.name,
            price: v.price,
            stock: v.stock,
          }));

        // Calculate total stock from variants if variants exist
        const totalStock = createVariants.length > 0
          ? createVariants.reduce((sum, v) => sum + v.stock, 0)
          : formData.stock;

        const createData: CreateProductREQ = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: totalStock,
          shopId: formData.shopId,
          typeId: formData.typeId || undefined,
          mediaUrls,
          variants: createVariants.length > 0 ? createVariants : undefined,
        };

        await createMutation.mutateAsync(createData);
        toast.success('Product created successfully!');
      } else {
        // Prepare variants for update
        // Include all current variants (with id for existing, without for new)
        const updateVariants: UpdateVariantREQ[] = variants
          .filter((v) => v.name.trim())
          .map((v) => ({
            id: v.id,
            name: v.name,
            price: v.price,
            stock: v.stock,
            isActive: v.isActive ?? true,
          }));

        // Calculate total stock from variants if variants exist
        const totalStock = updateVariants.length > 0
          ? updateVariants.reduce((sum, v) => sum + v.stock, 0)
          : formData.stock;

        const updateData: UpdateProductREQ = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: totalStock,
          typeId: formData.typeId || undefined,
          mediaUrls,
          isActive: formData.isActive,
          variants: updateVariants,
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
                  disabled={!isCreateMode}
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
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                  disabled={variants.length > 0}
                  hint={variants.length > 0 ? 'Auto-calculated from variant stocks' : undefined}
                />
              </div>
              <div>
                <Label>Product Type</Label>
                <Select
                  options={productTypeOptions}
                  placeholder={
                    isLoadingTypes ? 'Loading types...' : 'Select product type'
                  }
                  defaultValue={formData.typeId}
                  onChange={(value) => handleSelectChange('typeId', value)}
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

          {/* Product Variants */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-5 flex items-center justify-between lg:mb-7">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Product Variants
              </h4>
              <Button type="button" variant="outline" onClick={handleAddVariant}>
                + Add Variant
              </Button>
            </div>

            {variants.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No variants added. Click &quot;Add Variant&quot; to create product variants with different prices and stock.
              </p>
            ) : (
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Variant {index + 1}
                        {variant.id && (
                          <span className="ml-2 text-xs text-gray-400">
                            (ID: {variant.id.slice(0, 8)}...)
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="text-red-500 hover:text-red-700"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      <div className="sm:col-span-2 lg:col-span-2">
                        <Label>Variant Name *</Label>
                        <Input
                          type="text"
                          placeholder="e.g., Size M - Red"
                          value={variant.name}
                          onChange={(e) =>
                            handleVariantChange(index, 'name', e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>Price *</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(index, 'price', e.target.value)
                          }
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <Label>Stock *</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={variant.stock}
                          onChange={(e) =>
                            handleVariantChange(index, 'stock', e.target.value)
                          }
                          min="0"
                          required
                        />
                      </div>
                      {!isCreateMode && variant.id && (
                        <div className="sm:col-span-3 lg:col-span-4">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={variant.isActive ?? true}
                              onChange={(checked) =>
                                handleVariantChange(index, 'isActive', checked)
                              }
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {variant.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Images */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
              Product Images
            </h4>
            <div className="space-y-4">
              <div>
                <Label>Upload Images (You can select multiple images)</Label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="mb-3 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-400 dark:file:bg-blue-900/20 dark:file:text-blue-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total images: {existingMediaUrls.length + newMediaPreviews.length}
                </p>
              </div>

              {/* Existing Images */}
              {existingMediaUrls.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Existing Images ({existingMediaUrls.length})
                  </p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {existingMediaUrls.map((url, index) => (
                      <div key={`existing-${index}`} className="relative">
                        <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700">
                          <Image
                            src={url}
                            alt={`Existing image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
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
                </div>
              )}

              {/* New Images (to be uploaded) */}
              {newMediaPreviews.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Images to Upload ({newMediaPreviews.length})
                  </p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {newMediaPreviews.map((url, index) => (
                      <div key={`new-${index}`} className="relative">
                        <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-blue-400 dark:border-blue-600">
                          <Image
                            src={url}
                            alt={`New image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-blue-500 py-1 text-center text-xs text-white">
                            New
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
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
                </div>
              )}

              {existingMediaUrls.length === 0 && newMediaPreviews.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No images added yet. Click the upload button to add product images.
                </p>
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
              type="submit"
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

      {/* New Product Type Modal */}
      <Modal
        isOpen={isNewTypeModalOpen}
        onClose={() => {
          setIsNewTypeModalOpen(false);
          setNewTypeName('');
        }}
        className="max-w-md p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Create New Product Type
        </h3>
        <div className="mb-4">
          <Label>Type Name *</Label>
          <Input
            type="text"
            placeholder="Enter product type name"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsNewTypeModalOpen(false);
              setNewTypeName('');
            }}
            disabled={isCreatingType}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateNewType}
            disabled={isCreatingType || !newTypeName.trim()}
          >
            {isCreatingType ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
