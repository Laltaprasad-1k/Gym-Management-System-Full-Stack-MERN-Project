

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { createMember } from '@/lib/api';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddMemberModal({ isOpen, onClose, onSuccess }: AddMemberModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'basic',
    status: 'active',
  });
  const [userId, setUserId] = useState<string | null>(null);

 useEffect(() => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsedUser = JSON.parse(user);
    setUserId(parsedUser._id); // ✅ correct
  }
}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getExpiryDate = (plan: string) => {
    const now = new Date();
    switch (plan) {
      case 'basic': now.setMonth(now.getMonth() + 1); break;
      case 'standard': now.setMonth(now.getMonth() + 3); break;
      case 'premium': now.setMonth(now.getMonth() + 6); break;
      case 'yearly': now.setFullYear(now.getFullYear() + 1); break;
      default: return null;
    }
    return now.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({ title: 'Error', description: 'Name and Email are required', variant: 'destructive' });
      return;
    }
    if (!userId) {
      toast({ title: 'Error', description: 'You must be logged in to add a member', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      
      const payload = {
  userId,
  name: formData.name.trim(),
  email: formData.email.toLowerCase().trim(),
  phone: formData.phone.trim() || null,
  membershipPlan: formData.plan, // ✅ FIX
  status: formData.status,
  joinDate: new Date().toISOString(),
  expiryDate: getExpiryDate(formData.plan),
};

      console.log('🔄 Sending payload:', payload);

      await createMember(payload);

      toast({ title: '✅ Success', description: 'Member added successfully!' });

      setFormData({ name: '', email: '', phone: '', plan: 'basic', status: 'active' });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Add member error:', error);
      toast({ title: '❌ Error', description: error.message || 'Failed to add member', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Return JSX properly closed
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card border-border max-w-md" aria-describedby="add-member-description">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Member</DialogTitle>
        </DialogHeader>

        <p id="add-member-description" className="sr-only">
          Fill in the details to add a new gym member to the system.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name *</label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email *</label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Membership Plan</label>
              <Select value={formData.plan} onValueChange={(v) => handleSelectChange('plan', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (1 Month)</SelectItem>
                  <SelectItem value="standard">Standard (3 Months)</SelectItem>
                  <SelectItem value="premium">Premium (6 Months)</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} // ✅ function ends here