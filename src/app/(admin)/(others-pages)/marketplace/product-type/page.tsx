'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { DataTable, Column } from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Checkbox from '@/components/form/input/Checkbox';
import { Modal } from '@/components/ui/modal';
import { PencilIcon, SearchIcon, PlusIcon, TrashBinIcon } from '@/icons';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import {
  useProductTypesQuery,
  PRODUCT_TYPES_QUERY_KEY,
} from '@/hooks/useProductTypesQuery';
import {
  useCreateProductType,
  useUpdateProductType,
  useDeleteProductType,
} from '@/hooks/useProductTypeMutation';
import { ProductTypeDto } from '@/types/product-type/product-type.dto';

export default function ProductTypePage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ProductTypeDto | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Map column keys to sortBy
  const mapColumnKeyToSortBy = (
    key: string
  ): 'name' | 'createdAt' | 'updatedAt' | undefined => {
    const mapping: Record<string, 'name' | 'createdAt' | 'updatedAt'> = {
      name: 'name',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    };
    return mapping[key];
  };

  // Handle sort change
  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
    setPage(1);
  };

  // Fetch product types
  const { data, isLoading, isError, error } = useProductTypesQuery({
    search: debouncedSearch || undefined,
    page,
    limit: pageSize,
    sortBy: sortConfig ? mapColumnKeyToSortBy(sortConfig.key) : 'createdAt',
    sortOrder: sortConfig?.direction || 'desc',
  });

  const createMutation = useCreateProductType();
  const updateMutation = useUpdateProductType();
  const deleteMutation = useDeleteProductType();

  const productTypes = data?.data || [];

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a type name');
      return;
    }

    try {
      await createMutation.mutateAsync({ name: formData.name.trim() });
      queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_QUERY_KEY] });
      setIsCreateModalOpen(false);
      setFormData({ name: '', isActive: true });
      toast.success('Product type created successfully!');
    } catch (error: any) {
      console.error('Error creating product type:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to create product type'
      );
    }
  };

  const handleEdit = async () => {
    if (!formData.name.trim() || !selectedType) {
      toast.error('Please enter a type name');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: selectedType.id,
        data: {
          name: formData.name.trim(),
          isActive: formData.isActive,
        },
      });
      queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_QUERY_KEY] });
      setIsEditModalOpen(false);
      setFormData({ name: '', isActive: true });
      setSelectedType(null);
      toast.success('Product type updated successfully!');
    } catch (error: any) {
      console.error('Error updating product type:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to update product type'
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedType) return;

    try {
      await deleteMutation.mutateAsync(selectedType.id);
      queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_QUERY_KEY] });
      setIsDeleteModalOpen(false);
      setSelectedType(null);
      toast.success('Product type deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting product type:', error);
      toast.error(
        error?.response?.data?.message ||
          'Failed to delete product type. It may have associated products.'
      );
    }
  };

  const openEditModal = (type: ProductTypeDto) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      isActive: type.isActive,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (type: ProductTypeDto) => {
    setSelectedType(type);
    setIsDeleteModalOpen(true);
  };

  // Define columns for DataTable
  const columns: Column<ProductTypeDto>[] = [
    {
      key: 'name',
      title: 'Type Name',
      dataIndex: 'name',
      sorter: true,
      width: '30%',
      render: (value: string) => (
        <span className="font-medium text-gray-800 dark:text-white/90">
          {value}
        </span>
      ),
    },
    {
      key: 'productCount',
      title: 'Products',
      dataIndex: 'productCount',
      width: '15%',
      render: (value: number) => (
        <Badge size="sm" color="primary">
          {value ?? 0}
        </Badge>
      ),
    },
    {
      key: 'isActive',
      title: 'Status',
      dataIndex: 'isActive',
      width: '15%',
      render: (value: boolean) => (
        <Badge size="sm" color={value ? 'success' : 'error'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: true,
      width: '20%',
      render: (value: string) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      width: '20%',
      render: (_: any, record: ProductTypeDto) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="primary"
            startIcon={<PencilIcon />}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            startIcon={<TrashBinIcon />}
            onClick={() => openDeleteModal(record)}
            className="text-red-600 hover:border-red-600 hover:text-red-700 dark:text-red-400"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <Breadcrumb />

      {/* Page Title and Description */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Product Type Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage product categories and types for your marketplace.
        </p>
      </div>

      {/* Search and Actions Bar */}
      <div className="mb-5 flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative max-w-xs flex-1">
          <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search product types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:border-brand-500 focus:ring-brand-500 w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm text-gray-800 placeholder-gray-400 transition focus:ring-1 focus:outline-none dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white/90 dark:placeholder-gray-500"
          />
        </div>

        {/* Action Buttons */}
        <Button
          variant="primary"
          size="sm"
          startIcon={<PlusIcon />}
          onClick={() => {
            setFormData({ name: '', isActive: true });
            setIsCreateModalOpen(true);
          }}
        >
          Add Product Type
        </Button>
      </div>

      {/* Error State */}
      {isError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error loading product types: {error?.message || 'Unknown error'}
          </p>
        </div>
      )}

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={productTypes}
        loading={isLoading}
        pagination={
          data?.paging
            ? {
                current: page,
                pageSize: pageSize,
                total: data.paging.total,
                totalPages: data.paging.totalPages,
                onChange: setPage,
              }
            : false
        }
        sortConfig={sortConfig}
        onSortChange={handleSortChange}
        emptyText="No product types found. Try adjusting your search criteria."
      />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({ name: '', isActive: true });
        }}
        className="max-w-md p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Create Product Type
        </h3>
        <div className="space-y-4">
          <div>
            <Label>
              Type Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g., Clothing, Electronics"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsCreateModalOpen(false);
              setFormData({ name: '', isActive: true });
            }}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={createMutation.isPending || !formData.name.trim()}
          >
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setFormData({ name: '', isActive: true });
          setSelectedType(null);
        }}
        className="max-w-md p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Edit Product Type
        </h3>
        <div className="space-y-4">
          <div>
            <Label>
              Type Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g., Clothing, Electronics"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <Checkbox
                checked={formData.isActive}
                onChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label className="mb-0">Active</Label>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Inactive types won&apos;t be available for new products
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsEditModalOpen(false);
              setFormData({ name: '', isActive: true });
              setSelectedType(null);
            }}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEdit}
            disabled={updateMutation.isPending || !formData.name.trim()}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedType(null);
        }}
        className="max-w-md p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Delete Product Type
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete &quot;{selectedType?.name}&quot;? This
          action cannot be undone.
        </p>
        {selectedType?.productCount && selectedType.productCount > 0 && (
          <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/20">
            <p className="text-sm text-orange-600 dark:text-orange-400">
              <strong>Warning:</strong> This type has{' '}
              {selectedType.productCount} associated products. Deleting it may
              fail if products are still using this type.
            </p>
          </div>
        )}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedType(null);
            }}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
