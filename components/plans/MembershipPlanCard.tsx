
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

interface MembershipPlanCardProps {
  plan: MembershipPlan;
  isSelected?: boolean;
  onEdit: (plan: MembershipPlan) => void;
  onDelete: (id: string) => void;
  onSelect?: (plan: MembershipPlan) => void;
}

export function MembershipPlanCard({
  plan,
  isSelected,
  onEdit,
  onDelete,
  onSelect,
}: MembershipPlanCardProps) {
  const { toast } = useToast();

  // 🔹 Razorpay payment handler
  const handlePayNow = async () => {
    try {
      // Step 1: Create order in backend
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ planId: plan.id, amount: plan.price }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create order');

      // Step 2: Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: 'FitHub Gym',
        description: `Payment for ${plan.name}`,
        handler: async (response: any) => {
          // Step 3: Verify payment
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ ...response, planId: plan.id }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            toast({ title: 'Payment Successful', description: `${plan.name} activated!` });
            onSelect?.(plan); // mark plan as selected after payment
          } else {
            toast({ title: 'Payment Failed', description: verifyData.message, variant: 'destructive' });
          }
        },
        prefill: { email: '', contact: '' }, // optional: member info
        theme: { color: '#2563eb' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <Card
      className={`bg-card border transition-all ${
        isSelected ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'
      } p-6 space-y-4`}
    >
      <div>
        <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
        <div className="mt-3 space-y-1">
          <span className="text-3xl font-bold text-primary">₹{plan.price}</span>
          <p className="text-sm text-muted-foreground">per {plan.duration}</p>
        </div>
      </div>

      <ul className="space-y-2 pt-4 border-t border-border">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
            <Check className="h-4 w-4 text-accent flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 pt-4">
        {onSelect ? (
          <Button
            className={`flex-1 ${
              isSelected
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
            onClick={handlePayNow} // 🔹 trigger payment
          >
            {isSelected ? 'Selected' : 'Pay Now'}
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 border-border text-foreground hover:bg-muted"
              onClick={() => onEdit(plan)}
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 border-border text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(plan.id)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}