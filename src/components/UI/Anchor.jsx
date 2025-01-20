import React from "react";

const Anchor = ({ variant = "primary", icon, children, ...props }) => {
  const baseStyles = "py-2 px-4 rounded inline-block";
  const variantStyles =
    variant === "primary"
      ? "text-red-500 hover:text-red-700"
      : "text-gray-500 hover:text-gray-700";

  return (
    <a className={`${baseStyles} ${variantStyles}`} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </a>
  );
};

export default Anchor;
