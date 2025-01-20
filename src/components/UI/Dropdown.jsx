"use client";

import React from "react";

const Dropdown = ({ options, value, onChange }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
