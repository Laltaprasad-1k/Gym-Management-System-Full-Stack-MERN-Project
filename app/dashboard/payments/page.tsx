'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getPaymentHistory } from '@/lib/api';
import { CreditCard, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  planId: string;
  planName: string;
  status: 'pending' | 'completed' | 'failed';
  razorpayId?: string;
  createdAt: string;
}

export default function PaymentsPage() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = await getPaymentHistory(1, 50);
      if (response.success) {
        setPayments(response.data || []);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch payment history',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch payments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    revenue: payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground mt-1">Manage and track payments</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-card border-border p-4">
          <p className="text-sm text-muted-foreground">Total Payments</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-green-500 mt-1">{stats.completed}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">{stats.pending}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-sm text-muted-foreground">Failed</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{stats.failed}</p>
        </Card>
        <Card className="bg-card border-border p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-accent mt-1">₹{stats.revenue}</p>
        </Card>
      </div>

      {/* Payment History */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Payment History</h2>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading payments...</div>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No payments recorded</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Member</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Plan</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-foreground">{payment.memberName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{payment.planName}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">₹{payment.amount}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            payment.status === 'completed'
                              ? 'bg-green-500/20 text-green-500'
                              : payment.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {payment.status === 'completed' && (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          {payment.status === 'failed' && (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          {payment.status === 'pending' && (
                            <CreditCard className="h-3 w-3" />
                          )}
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
