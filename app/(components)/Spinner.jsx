import React from "react";
import { FaSpinner } from "react-icons/fa6";

const Spinner = () => {
  return (
    <div className="spinner h-screen flex items-center justify-center dark:bg-gray-900">
      <FaSpinner className="dark:text-slate-50 animate-spin h-32" />
    </div>
  );
};

export default Spinner;
