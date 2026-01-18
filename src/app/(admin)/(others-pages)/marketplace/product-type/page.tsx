'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Badge from '@/components/ui/badge/Badge';
import { Modal } from '@/components/ui/modal';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ProductTypePage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ProductTypeDto | null>(null);
  const [typeName, setTypeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch product types
  const { data, isLoading } = useProductTypesQuery({
    search: debouncedSearch || undefined,
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const createMutation = useCreateProductType();
  const updateMutation = useUpdateProductType();
  const deleteMutation = useDeleteProductType();

  const productTypes = data?.data || [];
  const totalPages = data?.paging?.totalPages || 1;

  const handleCreate = async () => {
    if (!typeName.trim()) {
      toast.error('Please enter a type name');
      return;
    }

    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({ name: typeName.trim() });
      queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_QUERY_KEY] });
      setIsCreateModalOpen(false);
      setTypeName('');
      toast.success('Product type created successfully!');
    } catch (error) {
      console.error('Error creating product type:', error);
      toast.error('Failed to create product type');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!typeName.trim() || !selectedType) {
      toast.error('Please enter a type name');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        id: selectedType.id,
        data: { name: typeName.trim() },
      });
      queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_QUERY_KEY] });
      setIsEditModalOpen(false);
      setTypeName('');
      setSelectedType(null);
      toast.success('Product type updated successfully!');
    } catch (error) {
      console.error('Error updating product type:', error);
      toast.error('Failed to update product type');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedType) return;

    setIsSubmitting(true);
    try {
      await deleteMutation.mutateAsync(selectedType.id);
      queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_QUERY_KEY] });
      setIsDeleteModalOpen(false);
      setSelectedType(null);
      toast.success('Product type deleted successfully!');
    } catch (error) {
      console.error('Error deleting product type:', error);
      toast.error(
        'Failed to delete product type. It may have associated products.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (type: ProductTypeDto) => {
    setSelectedType(type);
    setTypeName(type.name);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (type: ProductTypeDto) => {
    setSelectedType(type);
    setIsDeleteModalOpen(true);
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Product Types
        </h2>
        <Button
          variant="primary"
          onClick={() => {
            setTypeName('');
            setIsCreateModalOpen(true);
          }}
        >
          + Add Product Type
        </Button>
      </div>

      {/* Search */}
      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-md">
          <Input
            type="text"
            placeholder="Search product types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader className="min-w-[200px]">
                  Name
                </TableCell>
                <TableCell isHeader className="min-w-[120px]">
                  Products
                </TableCell>
                <TableCell isHeader className="min-w-[150px]">
                  Created At
                </TableCell>
                <TableCell isHeader className="min-w-[100px]">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Loading...
                    </p>
                  </TableCell>
                </TableRow>
              ) : productTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No product types found
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                productTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell>
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {type.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge size="sm" color="primary">
                        {type.productCount ?? 0} products
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(type.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(type)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => openDeleteModal(type)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setTypeName('');
        }}
        className="max-w-md p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Create Product Type
        </h3>
        <div className="mb-4">
          <Label>Type Name *</Label>
          <Input
            type="text"
            placeholder="Enter product type name"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsCreateModalOpen(false);
              setTypeName('');
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={isSubmitting || !typeName.trim()}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setTypeName('');
          setSelectedType(null);
        }}
        className="max-w-md p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Edit Product Type
        </h3>
        <div className="mb-4">
          <Label>Type Name *</Label>
          <Input
            type="text"
            placeholder="Enter product type name"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsEditModalOpen(false);
              setTypeName('');
              setSelectedType(null);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEdit}
            disabled={isSubmitting || !typeName.trim()}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
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
          <p className="mb-4 text-sm text-orange-600 dark:text-orange-400">
            Warning: This type has {selectedType.productCount} associated
            products. You cannot delete it until all products are removed or
            reassigned.
          </p>
        )}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedType(null);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
