"use client";

import { useForm } from "react-hook-form";
import axios from "@/app/utils/axios";
import styles from "@/app/Styles/auth.module.css";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("auth/signin", data);
      console.log(res.data);
      localStorage.setItem("token", res?.data?.data?.access_token);
      localStorage.setItem("username", res?.data?.data?.name);
      localStorage.setItem("dob", res?.data?.data?.dob);
      localStorage.setItem("image", res?.data?.data?.image);
      toast.success("Login successful!")

      // alert("Login successful!");

      router.push("/dashboard/home");
    } catch (error) {
      console.error("Login failed", error);
      // Check if the error response exists
      if (error.response) {
        toast.error(
          "Login failed: " +
            (error.response.data.message || "Please try again.")
        ); // Provide more specific feedback
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Email */}
        <input
          {...register("email", { required: "Email is required" })}
          placeholder="Email"
          type="email"
          className={styles.input}
        />
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}

        {/* Password */}
        <input
          {...register("password", { required: "Password is required" })}
          placeholder="Password"
          type="password"
          className={styles.input}
        />
        {errors.password && (
          <span className={styles.error}>{errors.password.message}</span>
        )}

        {/* Submit Button */}
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>

      {/* Footer with a link to signup page */}
      <p className={styles.footer}>
        Don't have an account? <a href="/auth/signup">Sign up</a>
      </p>
    </div>
  );
}
