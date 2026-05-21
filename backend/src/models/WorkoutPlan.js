import mongoose from 'mongoose';

const workoutPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    exercises: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);

export default WorkoutPlan;
