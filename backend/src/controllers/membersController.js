import Member from '../models/Member.js';

// GET all members with pagination
export const getMembers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const members = await Member.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Member.countDocuments();

    res.json({
      success: true,
      data: members,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch members',
    });
  }
};

// GET single member
export const getMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'undefined') {
      return res.status(400).json({ success: false, message: 'Invalid member ID' });
    }

    const member = await Member.findById(id)
      .populate('membershipPlanId')
      .populate('workoutPlanId');

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch member' });
  }
};



// CREATE member (Fixed with userId validation)
export const createMember = async (req, res) => {
  try {
    const { name, email, phone, plan, status, userId, joinDate, expiryDate } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name and Email are required fields",
      });
    }

    // Create member
    const newMember = new Member({
      userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      plan: plan?.trim() || 'basic',
      status: status || 'active',
      joinDate: joinDate ? new Date(joinDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    });

    // Save to DB
    await newMember.save();

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      member: newMember,
    });
  } catch (error) {
    console.error("Create member error:", error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while adding member",
    });
  }
};

// UPDATE member (Fixed - was incomplete)
export const updateMember = async (req, res) => {
  const { id } = req.params;

  if (!id || id === 'undefined' || id === 'null') {
    return res.status(400).json({
      success: false,
      message: "Member ID is required",
    });
  }

  try {
    const updatedMember = await Member.findByIdAndUpdate(
      id,
      { $set: req.body },   // safer than directly passing req.body
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.json({
      success: true,
      message: "Member updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    console.error("Update member error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update member",
    });
  }
};

// DELETE member (Fixed)
export const deleteMember = async (req, res) => {
  const { id } = req.params;

  if (!id || id === 'undefined' || id === 'null') {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing Member ID",
    });
  }

  try {
    const deleted = await Member.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    console.error("Delete member error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete member",
    });
  }
};

// Default export
export default {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
};