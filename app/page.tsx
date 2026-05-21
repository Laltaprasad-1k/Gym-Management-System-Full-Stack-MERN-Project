'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Dumbbell, Users, TrendingUp, Zap } from 'lucide-react';


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold text-foreground">FIT FUSION </span>
            </div>
            <div className="flex gap-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 md:gap-8">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                  Transform Your <span className="text-accent">Fitness Journey</span>
                </h1>
               <div className="bg-green-500 p-4 rounded-lg text-white">
  <p className="text-xl">
    Complete gym management system for trainers and members. Track workouts, manage memberships, and achieve your fitness goals.
  </p>
  <p className="text-lg mt-2">
    Name: Lalta Prasad <br />
    Phone: 9389636160 <br />
    Address: Mirehchi, District Etah, Uttar Pradesh, India
  </p>
</div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/auth/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2">
                    Get Started <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            {/* Feature Grid Preview */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-card p-6 text-center">
                <Dumbbell className="mx-auto h-8 w-8 text-accent" />
                <h3 className="mt-4 font-semibold">Workout Plans</h3>
              </Card>
              <Card className="bg-card p-6 text-center">
                <Users className="mx-auto h-8 w-8 text-accent" />
                <h3 className="mt-4 font-semibold">Member Management</h3>
              </Card>
              <Card className="bg-card p-6 text-center">
                <TrendingUp className="mx-auto h-8 w-8 text-accent" />
                <h3 className="mt-4 font-semibold">Progress Tracking</h3>
              </Card>
              <Card className="bg-card p-6 text-center">
                <Zap className="mx-auto h-8 w-8 text-accent" />
                <h3 className="mt-4 font-semibold">Quick Payments</h3>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-card/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose FitHub?</h2>
            <p className="text-lg text-muted-foreground">Everything you need to manage your gym efficiently</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: 'Smart Member Management',
                description: 'Easily manage members, track memberships, and monitor renewals'
              },
              {
                icon: Dumbbell,
                title: 'Customizable Workout Plans',
                description: 'Create and assign personalized workout plans for your members'
              },
              {
                icon: TrendingUp,
                title: 'Progress Analytics',
                description: 'Track member progress and gym performance with detailed analytics'
              },
              {
                icon: Zap,
                title: 'Secure Payments',
                description: 'Process memberships and payments securely with Razorpay'
              },
              {
                icon: Dumbbell,
                title: 'Flexible Membership Plans',
                description: 'Create different membership tiers to suit member preferences'
              },
              {
                icon: Users,
                title: 'Role-Based Access',
                description: 'Different dashboards for admins, trainers, and members'
              }
            ].map((feature, idx) => (
              <Card key={idx} className="bg-card p-8 space-y-4">
                <feature.icon className="h-12 w-12 text-accent" />
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Ready to Transform Your Gym?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of gyms using FitHub to streamline their operations
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="gap-2">
              Start Your Free Trial <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center text-muted-foreground">
          <p>&copy; 2026 FitHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
