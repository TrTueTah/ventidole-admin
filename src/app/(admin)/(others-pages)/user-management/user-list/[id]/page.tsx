"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

interface User {
  id: number;
  image: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  phone: string;
  bio: string;
  address: string;
  city: string;
  country: string;
}

// Sample data (in a real app, this would come from an API)
const users: Record<number, User> = {
  1: {
    id: 1,
    image: "/images/user/user-17.jpg",
    name: "Lindsey Curtis",
    email: "lindsey.curtis@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2024-01-15",
    phone: "+1 234 567 8901",
    bio: "Senior administrator with full system access",
    address: "123 Main Street",
    city: "New York",
    country: "United States",
  },
  2: {
    id: 2,
    image: "/images/user/user-18.jpg",
    name: "Kaiya George",
    email: "kaiya.george@example.com",
    role: "User",
    status: "Active",
    createdAt: "2024-01-20",
    phone: "+1 234 567 8902",
    bio: "Regular user account",
    address: "456 Oak Avenue",
    city: "Los Angeles",
    country: "United States",
  },
  3: {
    id: 3,
    image: "/images/user/user-17.jpg",
    name: "Zain Geidt",
    email: "zain.geidt@example.com",
    role: "User",
    status: "Inactive",
    createdAt: "2024-02-01",
    phone: "+1 234 567 8903",
    bio: "Content creator and writer",
    address: "789 Pine Road",
    city: "Chicago",
    country: "United States",
  },
  4: {
    id: 4,
    image: "/images/user/user-20.jpg",
    name: "Abram Schleifer",
    email: "abram.schleifer@example.com",
    role: "Moderator",
    status: "Active",
    createdAt: "2024-02-10",
    phone: "+1 234 567 8904",
    bio: "Community moderator",
    address: "321 Elm Street",
    city: "Houston",
    country: "United States",
  },
  5: {
    id: 5,
    image: "/images/user/user-21.jpg",
    name: "Carla George",
    email: "carla.george@example.com",
    role: "User",
    status: "Pending",
    createdAt: "2024-02-15",
    phone: "+1 234 567 8905",
    bio: "Frontend developer",
    address: "654 Maple Drive",
    city: "Phoenix",
    country: "United States",
  },
};

export default function UserDetail() {
  const params = useParams();
  const userId = Number(params.id);
  const user = users[userId];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          User Not Found
        </h2>
        <Link href="/user-management/user-list">
          <Button variant="primary">Back to User List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          User Details
        </h2>
        <div className="flex gap-3">
          <Link href="/user-management/user-list">
            <Button variant="outline">Back to List</Button>
          </Link>
          <Link href={`/user-management/user-list/form/${user.id}`}>
            <Button variant="primary">Edit User</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* User Profile Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="h-24 w-24 overflow-hidden rounded-full">
              <Image
                width={96}
                height={96}
                src={user.image}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  {user.name}
                </h3>
                <Badge
                  size="sm"
                  color={
                    user.status === "Active"
                      ? "success"
                      : user.status === "Pending"
                      ? "warning"
                      : "error"
                  }
                >
                  {user.status}
                </Badge>
              </div>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                {user.bio}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {user.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {user.phone}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-7">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Full Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.name}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Email Address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.phone}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Role
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.role}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.status}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Created At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.createdAt}
              </p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Address Information
          </h4>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-7">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.address}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                City
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.city}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Country
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
