"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/actions/handlers";

const schema = yup
  .object({
    username: yup
      .string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  })
  .required();

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Login - MixTube";
  }, []);

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
     const res =  await handleLogin(data)
     if(res.status !== 200){
      setError(res.message)
     }else{
     router.push("/")
     }
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-950">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Hello Again</h2>
          <p className="mt-2 text-sm text-gray-600">Welcome to Mixtube</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              {...register("username")}
              id="username"
              type="text"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          {error && (
            <div className="text-center text-sm text-red-600">{error}</div>
          )}
          <div className="text-right">
            <Link href="/recovery" className="text-sm text-indigo-600">
              Forgotten password?
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-600">
          Not a member?{" "}
          <Link href="/signup" className="text-indigo-600">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
