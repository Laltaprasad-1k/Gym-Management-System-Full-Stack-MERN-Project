'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/dashboard/ProtectedRoute';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col lg:flex-row bg-background text-foreground">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
