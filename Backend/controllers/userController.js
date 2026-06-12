const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary")
const streamifier = require("streamifier")

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );
};

const uploadToCloudinary = (
  buffer,
  folder
) => {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

    streamifier
      .createReadStream(buffer)
      .pipe(stream);
  });
};

// Register
const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      website,
      phone,
      address,
      city,
      state,
      pincode,
      profile,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      website,
      phone,
      address,
      city,
      state,
      pincode,
      profile
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Current User
const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const uploadProfile = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const uploadedImage =
      await uploadToCloudinary(
        req.file.buffer,
        "chatzkeep-profiles"
      );

    user.profile =
      uploadedImage.secure_url;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Profile picture updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    // 1. Identify active profile using req.user injected from your authorization token validation middleware
    const userId = req.user._id; 

    const { 
      firstName, 
      secondName, // Matches database schema key
      phone, 
      website, 
      address, 
      city, 
      state, 
      pincode 
    } = req.body;

    // 2. Perform safe update query execution on database model layer 
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstName,
          secondName,
          phone,
          website,
          address,
          city,
          state,
          pincode
        }
      },
      { 
        new: true,          // Returns updated doc instead of original state
        runValidators: true // Enforces your schema field rules on input
      }
    ).select("-password"); // Safeguard: never expose password strings down the data stream

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User account records missing." });
    }

    // 3. Dispatch success payload back to frontend state managers
    res.status(200).json({
      success: true,
      message: "Profile settings modified successfully.",
      user: updatedUser
    });

  } catch (error) {
    console.error("Backend update error details:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error occurred while processing profile patch operations.", 
      error: error.message 
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
       _id: { $ne: req.user.id },
    }).select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  uploadProfile,
  getAllUsers,
  updateProfile
};