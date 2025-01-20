"use client";

import React from "react";

const Textarea = ({ placeholder, value, onChange }) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
    />
  );
};

export default Textarea;
