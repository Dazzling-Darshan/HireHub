import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

const registerUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;

    if (!fullName || !email || !password || !role || !phoneNumber) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let profilePhoto = "";

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhoto = cloudResponse.secure_url;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email: normalizedEmail,
      phoneNumber,
      role,
      password: hashedPassword,
      profile: {
        profilePhoto,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to register",
      success: false,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "Email or Password is wrong",
        success: false,
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Email or Password is wrong",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const safeUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        success: true,
        user: safeUser,
      });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to login",
      success: false,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "lax",
      })
      .json({
        message: "Logged out successfully",
        success: true,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to logout",
      success: false,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;

    const userId = req.id; // from auth middleware
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    let cloudResponse = null;

    if (req.file) {
      const fileUri = getDataUri(req.file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    if (!user.profile) {
      user.profile = {};
    }

    if (skills) {
      const skillsArray = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim());

      user.profile.skills = skillsArray;
    }

    // Update basic fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = req.file.originalname;
    }

    // Ensure profile exists

    if (bio) user.profile.bio = bio;
    await user.save();

    const safeUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update profile",
      success: false,
    });
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
};
