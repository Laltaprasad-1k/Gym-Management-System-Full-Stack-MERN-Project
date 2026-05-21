import WorkoutPlan from '../models/WorkoutPlan.js';

export const getWorkoutPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const plans = await WorkoutPlan.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await WorkoutPlan.countDocuments();

    res.json({
      success: true,
      data: plans,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[v0] Get workout plans error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch workout plans',
    });
  }
};

export const getWorkoutPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await WorkoutPlan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found',
      });
    }

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error('[v0] Get workout plan error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch workout plan',
    });
  }
};

export const createWorkoutPlan = async (req, res) => {
  try {
    const { name, description, duration, difficulty, exercises } = req.body;

    if (!name || !duration || !exercises) {
      return res.status(400).json({
        success: false,
        message: 'Name, duration, and exercises are required',
      });
    }

    const plan = new WorkoutPlan({
      name,
      description,
      duration,
      difficulty,
      exercises,
    });

    await plan.save();

    res.status(201).json({
      success: true,
      message: 'Workout plan created successfully',
      data: plan,
    });
  } catch (error) {
    console.error('[v0] Create workout plan error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create workout plan',
    });
  }
};
export const updateWorkoutPlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const updatedPlan = await WorkoutPlan.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: updatedPlan,
    });

  } catch (error) {
    console.error("Update workout plan error:", error);
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

export const deleteWorkoutPlan = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("DELETE ID:", id); // 👈 DEBUG

    if (!id || id === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing ID",
      });
    }

    const deleted = await WorkoutPlan.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    res.json({
      success: true,
      message: "Workout plan deleted",
    });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getWorkoutPlans,
  getWorkoutPlan,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
};
