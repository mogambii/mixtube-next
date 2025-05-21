"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const schema = yup
  .object({
    email: yup
      .string()
      .required("Email is required")
      .email("Must be a valid email"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  })
  .required();

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setError("");
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("Google sign-in")) {
          setError(
            "This account uses Google sign-in. Please use the Google login button."
          );
        } else {
          setError("Invalid email or password");
        }
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <main className="flex justify-center items-center min-h-svh bg-gray-100 dark:bg-gray-950 px-4">
      <section className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 shadow-md rounded-md">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hello Again
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Welcome to MixTube
          </p>
        </header>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <input
              {...register("password")}
              id="password"
              type="password"
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
            />
            {errors.password && (
              <p id="password-error" className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;
