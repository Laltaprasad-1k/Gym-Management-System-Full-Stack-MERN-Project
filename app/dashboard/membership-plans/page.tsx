
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MembershipPlanCard } from '@/components/plans/MembershipPlanCard';
import { MembershipPlanModal } from '@/components/plans/MembershipPlanModal';
import { useToast } from '@/hooks/use-toast';
import { getMembershipPlans, deleteMembershipPlan } from '@/lib/api';
import { isAdmin } from '@/lib/auth';
import { Plus } from 'lucide-react';

interface MembershipPlan {
  _id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

export default function MembershipPlansPage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const isAdminUser = isAdmin();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await getMembershipPlans();
      if (response.success) {
        setPlans(response.data || []);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch plans',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!id) return;

    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await deleteMembershipPlan(id);
      toast({ title: 'Success', description: 'Plan deleted successfully' });
      fetchPlans();
    } catch (error) {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
    }
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleNewPlan = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  // -------------------------------
  // Razorpay Payment Handler
  // -------------------------------
  const handlePayment = async (plan: MembershipPlan) => {
    try {
      // 1️⃣ Create payment order in backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: 'currentUserId', // Replace with actual logged-in user ID
          amount: plan.price,
          planId: plan._id,
          planName: plan.name,
        }),
      }).then(res => res.json());

      if (!response.success) throw new Error('Failed to create order');

      // 2️⃣ Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: response.data.amount,
        currency: 'INR',
        order_id: response.data.orderId,
        name: 'FitHub Gym',
        description: plan.name,
        handler: async function (res: any) {
          // 3️⃣ Verify payment on backend
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: response.data.paymentId,
              razorpayPaymentId: res.razorpay_payment_id,
              razorpaySignature: res.razorpay_signature,
            }),
          });
          toast({ title: 'Payment Successful', description: `You purchased ${plan.name}` });
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      toast({ title: 'Payment Failed', description: error.message || 'Try again', variant: 'destructive' });
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Membership Plans</h1>
        {isAdminUser && (
          <Button onClick={handleNewPlan}>
            <Plus className="h-5 w-5" />
            Create Plan
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : plans.length === 0 ? (
        <Card className="p-10 text-center">No Plans Found</Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <MembershipPlanCard
              key={plan._id}
              plan={plan}
              onEdit={isAdminUser ? handleEditPlan : undefined}
              onDelete={isAdminUser ? () => handleDeletePlan(plan._id) : undefined}
              onPay={handlePayment} // ✅ Add Pay button for users
            />
          ))}
        </div>
      )}

      <MembershipPlanModal
        plan={editingPlan}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingPlan(null); }}
        onSuccess={fetchPlans}
      />
    </div>
  );
}