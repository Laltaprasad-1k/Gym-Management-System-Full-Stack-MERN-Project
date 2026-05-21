
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Calendar, Mail, Phone } from 'lucide-react';

interface Member {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: string;
  status: 'active' | 'inactive';
  plan?: string;
  expiryDate?: string;
}

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

export function MemberCard({ member, onEdit, onDelete }: MemberCardProps) {
  // Safe ID extraction (handles both _id and id)
  const memberId = member.id || member._id;

  const joinDate = member.joinDate ? new Date(member.joinDate) : null;
  const expiryDate = member.expiryDate ? new Date(member.expiryDate) : null;
  const isExpired = expiryDate ? expiryDate < new Date() : false;

  const formattedJoinDate = joinDate ? joinDate.toLocaleDateString() : 'N/A';
  const formattedExpiryDate = expiryDate ? expiryDate.toLocaleDateString() : 'N/A';

  const handleEdit = () => {
    if (!memberId) {
      console.error('Edit failed: No member ID found', member);
      alert('Cannot edit: Member ID is missing!');
      return;
    }
    onEdit({ ...member, id: memberId });
  };

  const handleDelete = () => {
    if (!memberId) {
      console.error('Delete failed: No member ID found', member);
      alert('Cannot delete: Member ID is missing!');
      return;
    }
    if (confirm(`Are you sure you want to delete "${member.name}"?`)) {
      onDelete(memberId);
    }
  };

  return (
    <Card className="bg-card border-border p-6 space-y-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
          <div
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
              member.status === 'active'
                ? 'bg-green-500/20 text-green-500'
                : 'bg-red-500/20 text-red-500'
            }`}
          >
            {member.status === 'active' ? 'Active' : 'Inactive'}
          </div>
        </div>

        {isExpired && (
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-500">
            Expired
          </div>
        )}
      </div>

      {/* Member Info */}
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>{member.email}</span>
        </div>

        {member.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{member.phone}</span>
          </div>
        )}

        {joinDate && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Joined: {formattedJoinDate}</span>
          </div>
        )}

        {expiryDate && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Expires: {formattedExpiryDate}
              {isExpired && <span className="text-orange-500 ml-1">• Expired</span>}
            </span>
          </div>
        )}
      </div>

      {/* Plan */}
      {member.plan && (
        <div className="pt-2 border-t border-border">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Plan:</span> {member.plan}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={handleEdit}
        >
          <Edit2 className="h-4 w-4" />
          Edit
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </Card>
  );
}