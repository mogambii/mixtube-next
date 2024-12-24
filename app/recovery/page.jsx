"use client";
import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { AiOutlineMail } from "react-icons/ai";

const Recovery = () => {
  useEffect(() => {
    document.title = "Recovery - MixTube";
  }, []);
  const schema = yup
    .object()
    .shape({
      email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
    })
    .required();

  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "hhttps://api.mixtube.xyz/api/user/reset-pass",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to reset password");
      }

      toast.success("An email with a magic link to reset your password has been sent to you. Please check your email.");
      setDone(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4 rounded-lg dark:bg-gray-900">
      {done ? (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h4 className="text-gray-700 font-semibold text-lg">
            An email with a magic link to reset your password has been sent to
            you. Please check your email.
          </h4>
          <p className="text-gray-500 text-sm mt-2">
            If you don&apos;t see it, check your spam folder.
          </p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-center text-2xl font-semibold text-gray-700 mb-4">
            Password Recovery
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <div className="relative">
                <AiOutlineMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  {...register("email")}
                  className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                />
              </div>
              <p id="email-error" className="text-red-500 text-xs italic">
                {errors.email?.message}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <button
                disabled={isSubmitting}
                className={`${
                  errors.email || isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-900"
                } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out`}
                type="submit"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="Loading"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                    </svg>
                    Sending...
                  </div>
                ) : (
                  "Proceed"
                )}
              </button>
            </div>
          </form>
          <div className="text-center p-5">
            <h2 className="text-gray-600 text-sm">
              A password reset link will be sent to your email.
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recovery;
