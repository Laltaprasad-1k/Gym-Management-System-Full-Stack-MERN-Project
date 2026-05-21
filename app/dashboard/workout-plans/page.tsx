
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WorkoutPlanCard } from '@/components/plans/WorkoutPlanCard';
import { WorkoutPlanModal } from '@/components/plans/WorkoutPlanModal';
import { useToast } from '@/hooks/use-toast';
import { getWorkoutPlans, deleteWorkoutPlan } from '@/lib/api'; // ✅ FIX
import { Plus } from 'lucide-react';

interface WorkoutPlan {
  _id: string;
  name: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: number;
  description: string;
}

export default function WorkoutPlansPage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await getWorkoutPlans();
      if (response.success) {
        setPlans(response.data || []);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch workout plans',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!id) {
      console.error("ID missing");
      return;
    }

    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      await deleteWorkoutPlan(id);

      toast({
        title: 'Success',
        description: 'Plan deleted successfully',
      });

      fetchPlans();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Delete failed',
        variant: 'destructive',
      });
    }
  };

  const handleEditPlan = (plan: WorkoutPlan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleNewPlan = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workout Plans</h1>
          <p className="text-muted-foreground mt-1">Create and manage workout programs</p>
        </div>

        <Button onClick={handleNewPlan} className="gap-2">
          <Plus className="h-5 w-5" />
          Create Plan
        </Button>
      </div>

      {/* Plans */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          Loading...
        </div>
      ) : plans.length === 0 ? (
        <Card className="p-12 text-center">
          No workout plans yet
          <div className="mt-4">
            <Button onClick={handleNewPlan}>
              Create First Plan
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <WorkoutPlanCard
              key={plan._id}
              plan={plan}
              onEdit={() => handleEditPlan(plan)}
              onDelete={() => handleDeletePlan(plan._id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <WorkoutPlanModal
        plan={editingPlan}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlan(null);
        }}
        onSuccess={fetchPlans}
      />

    </div>
  );
}