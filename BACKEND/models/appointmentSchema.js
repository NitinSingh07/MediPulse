import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First name must be at least 3 characters long"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last name must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: Number,
    required: true,
    minLength: [10, "Phone number must be at least 10 characters long"],
    maxLength: [11, "Phone number must be at most 10 characters long"],
  },
  nic: {
    type: String,
    required: true,
    minLength: [10, "nic must be at least 10 characters long"],
    maxLength: [13, "nic number must be at most 10 characters long"],
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  appointment_date: {
    type: Date,
    required: true,
  },
  department: {
    type: String,
    required: true,
    enum: [
      "Cardiology",
      "Dermatology",
      "Endocrinology",
      "Gastroenterology",
      "Hematology",
      "Infectious Disease",
      "Nephrology",
      "Neurology",
      "Oncology",
      "Pulmonology",
      "Rheumatology",
      "Urology",
    ],
  },
  doctor: {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name must be at least 3 characters long"],
    },
    lastName: {
      type: String,
      required: true,
      maxLength: [15, "Last name must be at most 15 characters long"],
    },
    hasVisited: {
      type: Boolean,
      default: false,
    },
    doctorId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    patientId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Cancelled"],
      default: "Pending",
    },
  },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
