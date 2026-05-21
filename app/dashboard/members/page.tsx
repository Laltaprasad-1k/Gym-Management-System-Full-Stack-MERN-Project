'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MemberCard } from '@/components/members/MemberCard';
import { AddMemberModal } from '@/components/members/AddMemberModal';
import { EditMemberModal } from '@/components/members/EditMemberModal';
import { useToast } from '@/hooks/use-toast';
import { getMembers, deleteMember } from '@/lib/api';
import { Plus, Search } from 'lucide-react';


interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: string;
  status: 'active' | 'inactive';
  plan?: string;
  expiryDate?: string;
}

export default function MembersPage() {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch members on mount
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await getMembers(1, 100);
      if (response.success) {
        setMembers(response.data || []);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch members',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch members',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      const response = await deleteMember(id);
      if (response.success) {
        toast({ title: 'Success', description: 'Member deleted successfully' });
        await fetchMembers();
      } else {
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete member',
        variant: 'destructive',
      });
    }
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  };

  // Filter members based on search and status
  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    inactive: members.filter(m => m.status === 'inactive').length,
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Members</h1>
          <p className="text-muted-foreground mt-1">Manage gym members</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          Add Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border p-4">
          <p className="text-sm text-muted-foreground">Total Members</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-500 mt-1">{stats.active}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{stats.inactive}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Members Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12 text-muted-foreground">Loading members...</div>
      ) : filteredMembers.length === 0 ? (
        <Card className="bg-card border-border p-12 text-center">
          <p className="text-muted-foreground">No members found</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map(member => (
  <MemberCard
    key={member.id || member._id} // fallback to MongoDB _id
    member={member}
    onEdit={handleEditMember}
    onDelete={handleDeleteMember}
  />
))}
        </div>
      )}

      {/* Modals */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchMembers}
      />
      <EditMemberModal
        member={editingMember}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMember(null);
        }}
        onSuccess={fetchMembers}
      />
    </div>
  );
}

