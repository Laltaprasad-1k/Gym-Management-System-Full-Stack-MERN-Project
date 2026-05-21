import MembershipPlan from '../models/MembershipPlan.js';

export const getMembershipPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const plans = await MembershipPlan.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ price: 1 });

    const total = await MembershipPlan.countDocuments();

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
    console.error('[v0] Get membership plans error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch membership plans',
    });
  }
};

export const getMembershipPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await MembershipPlan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found',
      });
    }

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error('[v0] Get membership plan error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch membership plan',
    });
  }
};

export const createMembershipPlan = async (req, res) => {
  try {
    const { name, price, duration, features } = req.body;

    if (!name || !price || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and duration are required',
      });
    }

    const plan = new MembershipPlan({
      name,
      price,
      duration,
      features: features || [],
    });

    await plan.save();

    res.status(201).json({
      success: true,
      message: 'Membership plan created successfully',
      data: plan,
    });
  } catch (error) {
    console.error('[v0] Create membership plan error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create membership plan',
    });
  }
};

export const updateMembershipPlan = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("UPDATE ID:", id); // debug

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const updatedPlan = await MembershipPlan.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: updatedPlan,
    });
  } catch (error) {
    console.error("Update membership plan error:", error);
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};
export const deleteMembershipPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await MembershipPlan.findByIdAndDelete(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found',
      });
    }

    res.json({
      success: true,
      message: 'Membership plan deleted successfully',
    });
  } catch (error) {
    console.error('[v0] Delete membership plan error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete membership plan',
    });
  }
};

export default {
  getMembershipPlans,
  getMembershipPlan,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
};
