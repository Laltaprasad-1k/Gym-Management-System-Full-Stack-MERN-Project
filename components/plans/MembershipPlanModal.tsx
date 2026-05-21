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
import { useToast } from '@/hooks/use-toast';
import { createMembershipPlan, updateMembershipPlan } from '@/lib/api';
import { Loader2, X } from 'lucide-react';

interface MembershipPlan {
  _id: string; // ✅ MUST
  name: string;
  price: number;
  duration: string;
  features: string[];
}

interface MembershipPlanModalProps {
  plan: MembershipPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function MembershipPlanModal({ plan, isOpen, onClose, onSuccess }: MembershipPlanModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    duration: '',
    features: [] as string[],
  });
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        features: plan.features,
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        duration: '',
        features: [],
      });
    }
    setFeatureInput('');
  }, [plan, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (formData.features.length === 0) {
    toast({
      title: 'Error',
      description: 'Please add at least one feature',
      variant: 'destructive',
    });
    return;
  }

  setIsLoading(true);

  try {
    let response;

    if (plan) {
      console.log("UPDATE ID:", plan._id); // ✅ debug
      response = await updateMembershipPlan(plan._id, formData); // ✅ FIX
    } else {
      response = await createMembershipPlan(formData);
    }

    if (response.success) {
      toast({
        title: 'Success',
        description: plan ? 'Plan updated successfully' : 'Plan created successfully',
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
      description: error instanceof Error ? error.message : 'Failed to save plan',
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
            {plan ? 'Edit Membership Plan' : 'Create Membership Plan'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Plan Name *
            </label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Premium"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-input border-border text-foreground placeholder-muted-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium text-foreground">
                Price (₹) *
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="e.g., 500"
                value={formData.price}
                onChange={handleChange}
                required
                className="bg-input border-border text-foreground placeholder-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium text-foreground">
                Duration *
              </label>
              <Input
                id="duration"
                name="duration"
                placeholder="e.g., 1 month"
                value={formData.duration}
                onChange={handleChange}
                required
                className="bg-input border-border text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="feature" className="text-sm font-medium text-foreground">
              Features
            </label>
            <div className="flex gap-2">
              <Input
                id="feature"
                placeholder="Add a feature"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                className="bg-input border-border text-foreground placeholder-muted-foreground"
              />
              <Button
                type="button"
                onClick={addFeature}
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
              >
                Add
              </Button>
            </div>
          </div>

          {formData.features.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Added Features:</p>
              <div className="space-y-2">
                {formData.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-muted p-2 rounded text-sm text-foreground"
                  >
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="text-destructive hover:bg-destructive/10 p-1 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
