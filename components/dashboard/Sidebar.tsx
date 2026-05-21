'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { isAdmin, isTrainer, isMember, getCurrentUser } from '@/lib/auth';
import {
  BarChart3,
  Dumbbell,
  Users,
  CreditCard,
  Settings,
  Home,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const user = getCurrentUser();

  const isAdminUser = isAdmin();
  const isTrainerUser = isTrainer();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      show: true,
    },
    {
      label: 'Members',
      href: '/dashboard/members',
      icon: Users,
      show: isAdminUser || isTrainerUser,
    },
    {
      label: 'Workout Plans',
      href: '/dashboard/workout-plans',
      icon: Dumbbell,
      show: isAdminUser || isTrainerUser,
    },
    {
      label: 'Membership Plans',
      href: '/dashboard/membership-plans',
      icon: CreditCard,
      show: isAdminUser || isTrainerUser,
    },
    {
      label: 'Payments',
      href: '/dashboard/payments',
      icon: BarChart3,
      show: isAdminUser,
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      show: true,
    },
  ];

  const filteredNavItems = navItems.filter(item => item.show);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <Dumbbell className="h-6 w-6 text-accent" />
            <span>FitHub</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-sidebar-accent rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start gap-3 ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                  onClick={onClose}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Info Footer */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <div className="text-sm">
            <p className="font-semibold text-sidebar-foreground">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
