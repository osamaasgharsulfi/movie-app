"use client";

import { useForm } from "react-hook-form";
import axios from "@/app/utils/axios";
import styles from "@/app/Styles/auth.module.css";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();
  const router = useRouter();

  // Function to validate date of birth
  const validateDob = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      return false; // User is under 18
    }
    return age >= 18 && dob <= today.toISOString().split("T")[0]; // Must be at least 18 and not in the future
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await axios.post("auth/signup", data);
      // Reset the form fields
      reset();
      // Redirect to the login page
      router.push("/auth/login");
      toast.success("Signup successful! Please login.");
    } catch (error) {
      console.error("Signup failed", error);
      if (error.response && error.response.status === 403) {
        // Set error for email field if email is taken
        setError("email", {
          type: "manual",
          message: "Email is already taken",
        });
      } else {
        toast.error("Signup failed. Please try again.");
      }
    }
  };

  // Get today's date for the max attribute
  const today = new Date().toISOString().split("T")[0];

  // Custom validation function for checking empty spaces
  const validateNotEmpty = (value) => {
    return value.trim() !== "" || "This field cannot be empty or just spaces";
  };

  return (
    <div className={styles.container}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Full Name */}
        <input
          {...register("name", {
            required: "Full Name is required",
            validate: validateNotEmpty,
          })}
          placeholder="Full Name"
          className={styles.input}
        />
        {errors.name && (
          <span className={styles.error}>{errors.name.message}</span>
        )}

        {/* Email */}
        <input
          {...register("email", {
            required: "Email is required",
            validate: validateNotEmpty,
          })}
          placeholder="Email"
          type="email"
          className={styles.input}
        />
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}

        {/* Password */}
        <input
          {...register("password", {
            required: "Password is required",
            validate: {
              notEmpty: validateNotEmpty,
              minLength: (value) =>
                value.length >= 8 || "Password must be at least 8 characters long",
            },
          })}
          placeholder="Password"
          type="password"
          className={styles.input}
        />
        {errors.password && (
          <span className={styles.error}>{errors.password.message}</span>
        )}

        {/* Date of Birth */}
        <input
          {...register("dob", {
            required: "Date of Birth is required",
            validate: {
              isValid: (dob) =>
                validateDob(dob) ||
                "You must be at least 18 years old and the date cannot be in the future",
            },
          })}
          placeholder="Date of Birth"
          type="date"
          className={styles.input}
          max={today} // Disable future dates
        />
        {errors.dob && (
          <span className={styles.error}>{errors.dob.message}</span>
        )}

        {/* Address */}
        <input
          {...register("address", {
            required: "Address is required",
            validate: validateNotEmpty,
          })}
          placeholder="Address"
          className={styles.input}
        />
        {errors.address && (
          <span className={styles.error}>{errors.address.message}</span>
        )}

        {/* Submit Button */}
        <button type="submit" className={styles.button}>
          Sign Up
        </button>
      </form>

      {/* Footer with a link to login page */}
      <p className={styles.footer}>
        Already have an account? <a href="/auth/login">Login</a>
      </p>
    </div>
  );
}
