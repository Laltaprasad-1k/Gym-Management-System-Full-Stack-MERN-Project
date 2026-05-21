



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
import { updateMember } from '@/lib/api'; // ✅ use lib/api for consistency

interface Member {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  membershipPlan?: string;
  status: 'active' | 'inactive';
}

interface EditMemberModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditMemberModal({ member, isOpen, onClose, onSuccess }: EditMemberModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipPlan: 'basic',
    status: 'active',
  });

  // Populate form when modal opens
  useEffect(() => {
    if (member && isOpen) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        membershipPlan: member.membershipPlan || 'basic',
        status: member.status || 'active',
      });
    }
  }, [member?._id, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!member?._id) {
      toast({ title: 'Error', description: 'Member ID missing', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim() || null,
        membershipPlan: formData.membershipPlan, // ✅ must match backend
        status: formData.status,
      };

      console.log('Updating member ID:', member._id, 'Payload:', payload);

      await updateMember(member._id, payload); // ✅ use api function

      toast({ title: 'Success', description: 'Member updated successfully' });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Update failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-card border-border max-w-md"
        aria-describedby="edit-member-description"
      >
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>

        <p id="edit-member-description" className="sr-only">
          Edit member details
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />

          <Select
            value={formData.membershipPlan}
            onValueChange={(v) => handleSelectChange('membershipPlan', v)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}