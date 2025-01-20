import Image from "next/image";
import React from "react";

// Define the props directly in the function signature
const Card = ({ name, price, imgSrc }) => {
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col items-center border">
      <Image
        src={imgSrc} // Use the imgSrc prop instead of a hardcoded value
        alt="Card Image"
        width={300}
        height={300}
        className="w-full h-52 object-cover rounded-t-lg mb-4"
      />
      <div className="flex justify-between w-100">
        <h1 className="text-xl font-semibold mb-2">{name}</h1>
        <p className="text-gray-600">{price}</p>
      </div>
    </div>
  );
};

export default Card;
