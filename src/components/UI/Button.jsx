import React from "react";

const Button = ({ variant = "primary", icon, children, ...props }) => {
  const baseStyles =
    "flex items-center justify-center py-2 px-4 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300";
  const variantStyles =
    variant === "primary"
      ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
      : "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500";

  return (
    <button className={`${baseStyles} ${variantStyles}`} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
