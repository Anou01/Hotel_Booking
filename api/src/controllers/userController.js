const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// CREATE: Register a new user
exports.register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created successfully", data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    // Get username and password from request body
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({
        message: "Please provide both username and password",
      });
    }

    // Find user in database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        profileImage: user.profileImage,
        role: user.role,
      },
      process.env.JWT_SECRET, // Store this in your .env file
      { expiresIn: process.env.TOKEN_EXPIRES_IN } // Token expires in 1 day
    );

    // Send successful response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (err) { // <--- **Crucial change: Add 'err' (or 'error') here!**
        console.error("Login error:", err); // Now 'err' holds the error object
        res.status(500).json({ message: "Server error during login" });
    }
};

// READ: Get user profile
exports.getUsers = async (req, res) => {
  try {
    const { role, name, page = 1, limit = 10, sort = "createdAt" } = req.query;

    let query = {};
    if (role) query.role = role;
    if (name) query.name = { $regex: name, $options: "i" }; // ค้นหาแบบ case-insensitive

    // คำนวณ offset สำหรับ Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // ดึงข้อมูลผู้ใช้พร้อม Pagination และ Sorting
    const users = await User.find(query)
      .select("-password") // ไม่ดึง password
      .sort(sort) // เรียงลำดับตาม field ที่ระบุ (เช่น createdAt)
      .skip(skip)
      .limit(limitNum);

    // นับจำนวนผู้ใช้ทั้งหมดสำหรับ Pagination
    const total = await User.countDocuments(query);

    res.status(200).json({
      data: users,
      total: total,
      pagination: {
        current: pageNum,
        pageSize: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ: Get user profile
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE: Update user details
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE: Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
