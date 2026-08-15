"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import {  FaExclamationCircle, FaArrowRight } from "react-icons/fa";
import Image from "next/image";

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
  const [showPassword, setShowPassword] = useState(false);

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

  const handleGoogleSignIn = async () => {
    const width = 500;
    const height = 600;
    const left = typeof window !== "undefined" ? window.screen.width / 2 - width / 2 : 100;
    const top = typeof window !== "undefined" ? window.screen.height / 2 - height / 2 : 100;

    // 1. Open blank popup synchronously to bypass browser popup blockers
    const popup = window.open(
      "about:blank",
      "GoogleSignIn",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
    );

    try {
      // 2. Fetch NextAuth CSRF token
      const res = await fetch("/api/auth/csrf");
      const { csrfToken } = await res.json();

      // 3. Post CSRF form targeted to the popup window
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/api/auth/signin/google";
      form.target = "GoogleSignIn";

      const csrfInput = document.createElement("input");
      csrfInput.type = "hidden";
      csrfInput.name = "csrfToken";
      csrfInput.value = csrfToken;
      form.appendChild(csrfInput);

      const callbackInput = document.createElement("input");
      callbackInput.type = "hidden";
      callbackInput.name = "callbackUrl";
      callbackInput.value = `${window.location.origin}/auth/popup-callback`;
      form.appendChild(callbackInput);

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      // 4. Poll and listen for popup closure/message
      if (popup) {
        const handleMessage = (event) => {
          if (event.data?.type === "GOOGLE_SIGNIN_SUCCESS") {
            window.removeEventListener("message", handleMessage);
            clearInterval(checkPopup);
            if (!popup.closed) popup.close();
            router.push("/");
            router.refresh();
          }
        };
        window.addEventListener("message", handleMessage);

        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
            window.removeEventListener("message", handleMessage);
            router.push("/");
            router.refresh();
          }
        }, 500);
      }
    } catch (err) {
      if (popup) popup.close();
      console.error("Google sign in error:", err);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/85 dark:bg-gray-900/85 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-200/80 dark:border-white/10 p-6 sm:p-8 space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
      {/* Header Section */}
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <Image
            src="/icon.png"
            alt="MixTapped Logo"
            width={48}
            height={48}
            className="mx-auto"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-righteous tracking-wide text-gray-900 dark:text-white">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Sign in to access your MixTapped account
        </p>
      </div>

      {/* DJ Signin Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 p-3.5 sm:p-4 rounded-2xl border border-indigo-100/80 dark:border-indigo-800/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs">
            DJ
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 dark:text-indigo-200">Are you a DJ?</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Sign in to your DJ dashboard</p>
          </div>
        </div>
        <Link
          href="https://dj.mixtapped.com/auth/signin"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors shrink-0 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl shadow-xs border border-indigo-100 dark:border-gray-700"
        >
          DJ Sign In <FaArrowRight className="h-2.5 w-2.5" />
        </Link>
      </div>

      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white dark:bg-gray-800/90 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 font-semibold text-sm transition-all duration-200 shadow-xs hover:shadow-sm"
      >
        <FcGoogle className="text-xl shrink-0" />
        <span>Continue with Google</span>
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        <span className="absolute px-3 bg-white dark:bg-gray-900 text-gray-400 text-xs font-medium uppercase tracking-wider">
          Or with email
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Error Alert */}
        {error && (
          <div className="p-3 text-xs text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-300 rounded-2xl border border-red-200 dark:border-red-800/50 flex items-center gap-2">
            <FaExclamationCircle className="text-red-500 text-sm shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-3.5 text-gray-400 dark:text-gray-500 text-sm pointer-events-none" />
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
              placeholder="name@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <FaExclamationCircle /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-3.5 text-gray-400 dark:text-gray-500 text-sm pointer-events-none" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FiEyeOff className="h-4 w-4" />
              ) : (
                <FiEye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <FaExclamationCircle /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-600 hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
