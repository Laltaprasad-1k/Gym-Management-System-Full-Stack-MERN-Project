'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCurrentUser, isAdmin, isTrainer } from '@/lib/auth';
import {
  Users,
  Dumbbell,
  CreditCard,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {
  const user = getCurrentUser();
  const isAdminUser = isAdmin();
  const isTrainerUser = isTrainer();

  const stats = [
    {
      label: 'Total Members',
      value: '245',
      icon: Users,
      color: 'text-blue-500',
      show: isAdminUser || isTrainerUser,
    },
    {
      label: 'Active Plans',
      value: '12',
      icon: Dumbbell,
      color: 'text-accent',
      show: isAdminUser || isTrainerUser,
    },
    {
      label: 'Monthly Revenue',
      value: '₹45,320',
      icon: CreditCard,
      color: 'text-green-500',
      show: isAdminUser,
    },
    {
      label: 'Growth',
      value: '+12.5%',
      icon: TrendingUp,
      color: 'text-purple-500',
      show: isAdminUser,
    },
  ];

  const quickActions = [
    {
      label: 'Add Member',
      href: '/dashboard/members',
      icon: Users,
      show: isAdminUser || isTrainerUser,
    },
    {
      label: 'Create Workout Plan',
      href: '/dashboard/workout-plans',
      icon: Dumbbell,
      show: isAdminUser || isTrainerUser,
    },
    {
      label: 'View Payments',
      href: '/dashboard/payments',
      icon: CreditCard,
      show: isAdminUser,
    },
  ];

  const filteredStats = stats.filter(s => s.show);
  const filteredActions = quickActions.filter(a => a.show);

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your gym today.
        </p>
      </div>

      {/* Stats Grid */}
      {filteredStats.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {filteredStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="bg-card border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-primary/10`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      {filteredActions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {filteredActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link key={idx} href={action.href}>
                  <Card className="bg-card border-border p-6 hover:border-primary/50 transition-colors cursor-pointer h-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{action.label}</p>
                        <p className="text-sm text-muted-foreground mt-1">Manage and organize</p>
                      </div>
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 border-border text-foreground hover:bg-muted w-full gap-2"
                    >
                      Go <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Recent Activity</h2>
        <Card className="bg-card border-border p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-foreground">New member joined</p>
                <p className="text-sm text-muted-foreground">John Doe registered</p>
              </div>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-foreground">Payment received</p>
                <p className="text-sm text-muted-foreground">3-month membership renewal</p>
              </div>
              <span className="text-sm text-muted-foreground">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-foreground">Membership expired</p>
                <p className="text-sm text-muted-foreground">3 members need renewal</p>
              </div>
              <span className="text-sm text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
