'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import Select from '@/components/form/Select';
import { useOrderQuery } from '@/hooks/useOrderQuery';
import { useUpdateOrder } from '@/hooks/useUpdateOrder';
import { OrderDetailDto, OrderStatus } from '@/types/order/order.dto';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch order data
  const { data, isLoading, isError } = useOrderQuery(orderId, !!orderId);
  const updateMutation = useUpdateOrder();

  const order: OrderDetailDto | undefined = data?.data;

  // Get status badge color
  const getStatusColor = (status: OrderStatus) => {
    const colorMap: Record<
      OrderStatus,
      'success' | 'warning' | 'error' | 'dark'
    > = {
      [OrderStatus.PENDING_PAYMENT]: 'warning',
      [OrderStatus.CONFIRMED]: 'dark',
      [OrderStatus.PAID]: 'success',
      [OrderStatus.SHIPPING]: 'dark',
      [OrderStatus.DELIVERED]: 'success',
      [OrderStatus.CANCELED]: 'error',
      [OrderStatus.EXPIRED]: 'error',
    };
    return colorMap[status] || 'dark';
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateMutation.mutateAsync({
        id: orderId,
        data: { status: newStatus as OrderStatus },
      });
      toast.success('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Loading order details...
        </p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Order Not Found
        </h2>
        <Link href="/marketplace/order">
          <Button variant="primary">Back to Order List</Button>
        </Link>
      </div>
    );
  }

  const statusOptions = Object.values(OrderStatus).map((status) => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
  }));

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Order Details
        </h2>
        <div className="flex gap-3">
          <Link href="/marketplace/order">
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Order Summary Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Order #{order.id.slice(0, 8)}
              </h3>
              <Badge size="sm" color={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                ${order.totalAmount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Amount
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Order Status
              </p>
              <Select
                options={statusOptions}
                defaultValue={order.status}
                onChange={handleStatusChange}
                disabled={isUpdating}
              />
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Payment Method
              </p>
              <p className="text-sm font-medium text-gray-800 capitalize dark:text-white/90">
                {order.paymentMethod.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
            Customer Information
          </h4>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full">
              <Image
                width={64}
                height={64}
                src={order.user.avatarUrl || '/images/user/user-01.png'}
                alt={order.user.username}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-800 dark:text-white/90">
                {order.user.username}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {order.user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
              Order Items ({order.itemCount})
            </h4>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <p className="font-medium text-gray-800 dark:text-white/90">
                        {item.productName}
                      </p>
                      {item.variantName && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Variant: {item.variantName}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 dark:text-white/90">
                      ${item.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Total
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
            Order Information
          </h4>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-7">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Order ID
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {order.id}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Payment Method
              </p>
              <p className="text-sm font-medium text-gray-800 capitalize dark:text-white/90">
                {order.paymentMethod.replace('_', ' ')}
              </p>
            </div>
            {order.paidAt && (
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Paid At
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {new Date(order.paidAt).toLocaleString()}
                </p>
              </div>
            )}
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {order.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Created At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Updated At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(order.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
