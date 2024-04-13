import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    gender,
    nic,
    role,
    dob,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !gender ||
    !nic ||
    !role ||
    !dob
  ) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  let user = await User.findOne({ email: email });

  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    gender,
    nic,
    role,
    dob,
  });
  generateToken(user, "User Registered Successfully", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !role || !confirmPassword) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  if (role != user.role) {
    return next(new ErrorHandler("Role does not match", 400));
  }
  generateToken(user, "User Logged In Successfully !", 200, res);
});

export const addnewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password, phone, gender, nic, dob } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !gender ||
    !nic ||
    !dob
  ) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }
  const isRegistered = await User.findOne({ email });

  if (isRegistered) {
    return next(new ErrorHandler("Admin already exists", 400));
  }
  const admin = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    role: "Admin",
    gender,
    dob,
    nic,
  });
  generateToken(admin, "Admin Registered Successfully", 200, res);
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", " ", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully !",
    });
});
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("patientToken", " ", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully !",
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment ||
    !docAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});
