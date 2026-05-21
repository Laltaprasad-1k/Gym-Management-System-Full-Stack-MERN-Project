'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Zap } from 'lucide-react';

interface WorkoutPlan {
  id: string;
  name: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: number;
  description: string;
}

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
  onEdit: (plan: WorkoutPlan) => void;
  onDelete: (id: string) => void;
}

export function WorkoutPlanCard({ plan, onEdit, onDelete }: WorkoutPlanCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-500/20 text-green-500',
    intermediate: 'bg-yellow-500/20 text-yellow-500',
    advanced: 'bg-red-500/20 text-red-500',
  };

  return (
    <Card className="bg-card border-border p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
          <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${difficultyColors[plan.difficulty]}`}>
            {plan.difficulty}
          </div>
        </div>
        <Zap className="h-5 w-5 text-accent" />
      </div>

      <p className="text-sm text-muted-foreground">{plan.description}</p>

      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Duration</p>
          <p className="text-sm font-semibold text-foreground mt-1">{plan.duration}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Exercises</p>
          <p className="text-sm font-semibold text-foreground mt-1">{plan.exercises}</p>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
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
      </div>
    </Card>
  );
}
