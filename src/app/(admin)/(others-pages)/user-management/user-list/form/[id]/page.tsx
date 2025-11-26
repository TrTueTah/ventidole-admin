"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  bio: string;
  address: string;
  city: string;
  country: string;
}

const roleOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Moderator", label: "Moderator" },
  { value: "User", label: "User" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Pending", label: "Pending" },
];

// Sample existing users data (in a real app, this would come from an API)
const existingUsers: Record<string, UserFormData> = {
  "1": {
    name: "Lindsey Curtis",
    email: "lindsey.curtis@example.com",
    phone: "+1 234 567 8901",
    role: "Admin",
    status: "Active",
    bio: "Senior administrator with full system access",
    address: "123 Main Street",
    city: "New York",
    country: "United States",
  },
  "2": {
    name: "Kaiya George",
    email: "kaiya.george@example.com",
    phone: "+1 234 567 8902",
    role: "User",
    status: "Active",
    bio: "Regular user account",
    address: "456 Oak Avenue",
    city: "Los Angeles",
    country: "United States",
  },
  "3": {
    name: "Zain Geidt",
    email: "zain.geidt@example.com",
    phone: "+1 234 567 8903",
    role: "User",
    status: "Inactive",
    bio: "Content creator and writer",
    address: "789 Pine Road",
    city: "Chicago",
    country: "United States",
  },
  "4": {
    name: "Abram Schleifer",
    email: "abram.schleifer@example.com",
    phone: "+1 234 567 8904",
    role: "Moderator",
    status: "Active",
    bio: "Community moderator",
    address: "321 Elm Street",
    city: "Houston",
    country: "United States",
  },
  "5": {
    name: "Carla George",
    email: "carla.george@example.com",
    phone: "+1 234 567 8905",
    role: "User",
    status: "Pending",
    bio: "Frontend developer",
    address: "654 Maple Drive",
    city: "Phoenix",
    country: "United States",
  },
};

export default function UserForm() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const isCreateMode = userId === "create";

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    bio: "",
    address: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    if (!isCreateMode && userId && existingUsers[userId]) {
      setFormData(existingUsers[userId]);
    }
  }, [userId, isCreateMode]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, this would make an API call
    console.log(isCreateMode ? "Creating user:" : "Updating user:", formData);

    // Show success message (you could use a toast notification here)
    alert(
      isCreateMode
        ? "User created successfully!"
        : "User updated successfully!"
    );

    // Redirect to user list
    router.push("/user-management/user-list");
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          {isCreateMode ? "Create New User" : "Edit User"}
        </h2>
        <Link href="/user-management/user-list">
          <Button variant="outline">Back to List</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-x-6">
              <div>
                <Label>Full Name *</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  defaultValue={formData.name}
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
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  defaultValue={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Role *</Label>
                <Select
                  options={roleOptions}
                  placeholder="Select role"
                  defaultValue={formData.role}
                  onChange={(value) => handleSelectChange("role", value)}
                />
              </div>
              <div>
                <Label>Status *</Label>
                <Select
                  options={statusOptions}
                  placeholder="Select status"
                  defaultValue={formData.status}
                  onChange={(value) => handleSelectChange("status", value)}
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

          {/* Address Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
              Address Information
            </h4>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-x-6">
              <div className="lg:col-span-2">
                <Label>Address</Label>
                <Input
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  defaultValue={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>City</Label>
                <Input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  defaultValue={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Country</Label>
                <Input
                  type="text"
                  name="country"
                  placeholder="Enter country"
                  defaultValue={formData.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/user-management/user-list">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button variant="primary" onClick={handleSubmit}>
              {isCreateMode ? "Create User" : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
