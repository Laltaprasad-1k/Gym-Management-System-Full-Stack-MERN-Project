

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Bell, Lock } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null); // ✅ FIX
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // ✅ Load user ONLY once
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, []); // ✅ empty dependency → no loop

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-6 w-6 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">
            Profile Information
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Contact support to update your profile information
          </p>
        </div>
      </Card>

      {/* Account Info */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Account Information
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role:</span>
            <span className="font-semibold text-foreground capitalize">
              {user?.role}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Gender:</span>
            <span className="font-semibold text-foreground capitalize">
              {user?.gender}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Member Since:</span>
            <span className="font-semibold text-foreground">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : '-'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}