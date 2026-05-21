'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createWorkoutPlan, updateWorkoutPlan } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface WorkoutPlan {
  _id: string; // ✅ FIX
  name: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: number;
  description: string;
}

interface WorkoutPlanModalProps {
  plan: WorkoutPlan | null;
}

export function WorkoutPlanModal({ plan, isOpen, onClose, onSuccess }: WorkoutPlanModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    difficulty: 'beginner' as const,
    exercises: 0,
    description: '',
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        duration: plan.duration,
        difficulty: plan.difficulty,
        exercises: plan.exercises,
        description: plan.description,
      });
    } else {
      setFormData({
        name: '',
        duration: '',
        difficulty: 'beginner',
        exercises: 0,
        description: '',
      });
    }
  }, [plan, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'exercises' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, difficulty: value as any }));
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    let response;

    if (plan) {
      // ✅ UPDATE FIX
      if (!plan._id) {
        console.error("Update ID missing ❌");
        return;
      }

      console.log("UPDATE ID:", plan._id); // 🔍 debug

      response = await updateWorkoutPlan(plan._id, formData);
    } else {
      // ✅ CREATE
      response = await createWorkoutPlan(formData);
    }

    if (response.success) {
      toast({
        title: 'Success',
        description: plan
          ? 'Plan updated successfully'
          : 'Plan created successfully',
      });

      onSuccess();
      onClose();
    } else {
      toast({
        title: 'Error',
        description: response.message,
        variant: 'destructive',
      });
    }
  } catch (error) {
    toast({
      title: 'Error',
      description:
        error instanceof Error ? error.message : 'Failed to save plan',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {plan ? 'Edit Workout Plan' : 'Create Workout Plan'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Plan Name *
            </label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Full Body Workout"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-input border-border text-foreground placeholder-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Plan description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium text-foreground">
                Duration *
              </label>
              <Input
                id="duration"
                name="duration"
                placeholder="e.g., 8 weeks"
                value={formData.duration}
                onChange={handleChange}
                required
                className="bg-input border-border text-foreground placeholder-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="exercises" className="text-sm font-medium text-foreground">
                Exercises *
              </label>
              <Input
                id="exercises"
                name="exercises"
                type="number"
                placeholder="e.g., 5"
                value={formData.exercises}
                onChange={handleChange}
                required
                className="bg-input border-border text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="difficulty" className="text-sm font-medium text-foreground">
              Difficulty Level
            </label>
            <Select value={formData.difficulty} onValueChange={handleSelectChange}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : plan ? (
                'Update Plan'
              ) : (
                'Create Plan'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
