import React from "react";

const Input = ({ label, icon, ...props }) => {
  return (
    <div className="mb-4 relative">
      {label && (
        <label
          htmlFor={props.id}
          className={`absolute top-1/2 left-3 text-gray-500 text-sm transform -translate-y-1/2 origin-left transition-transform duration-300 ${
            props.value || props.placeholder
              ? "text-red-600 transform -translate-y-6 scale-75"
              : ""
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-200 ${
            icon ? "pr-10" : "pr-3"
          }`}
          {...props}
        />
        {icon && (
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
