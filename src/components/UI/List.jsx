"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

const List = () => {
  const [displayedPeople, setDisplayedPeople] = useState([]);
  const [showSeeMore, setShowSeeMore] = useState(true);
  const buttonRef = useRef(null);
  const [additionalPeople, setAdditionalPeople] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dummyjson.com/users");
        const data = await response.json();
        setAdditionalPeople(data.users.slice(5)); // Store additional users
        setDisplayedPeople(data.users.slice(0, 5)); // Show first 5 initially
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const addPersonWithAnimation = useCallback(async (newPerson) => {
    setIsAnimating(true);
    setDisplayedPeople((prev) => [...prev, newPerson]);

    await new Promise((resolve) => {
      gsap.fromTo(
        `.card-${newPerson.id}`,
        {
          opacity: 0,
          y: -100,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          onComplete: resolve,
        }
      );
    });

    setIsAnimating(false);
  }, []);

  useEffect(() => {
    let timeoutId;

    const addPersonPeriodically = async () => {
      if (additionalPeople.length > 0 && !isAnimating) {
        const [newPerson, ...rest] = additionalPeople;
        await addPersonWithAnimation(newPerson);
        setAdditionalPeople(rest);

        if (rest.length === 0) {
          setShowSeeMore(false);
        } else {
          timeoutId = setTimeout(addPersonPeriodically, 5000);
        }
      }
    };

    timeoutId = setTimeout(addPersonPeriodically, 5000);
    return () => clearTimeout(timeoutId);
  }, [additionalPeople, isAnimating, addPersonWithAnimation]);

  const handleSeeMore = useCallback(async () => {
    if (additionalPeople.length > 0 && !isAnimating) {
      const [newPerson, ...rest] = additionalPeople;
      await addPersonWithAnimation(newPerson);
      setAdditionalPeople(rest);
      if (rest.length === 0) {
        setShowSeeMore(false);
      }
    }
  }, [additionalPeople, isAnimating, addPersonWithAnimation]);

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedPeople.map((person) => (
          <div
            key={person.id}
            className={`bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col items-center card-${person.id}`}
            aria-labelledby={`person-${person.id}`}
          >
            <Image
              alt={person.firstName}
              width={250} height={250}
              src={person.image || "https://via.placeholder.com/256"}
              className="h-24 w-24 rounded-full bg-gray-50 mb-4"
            />
            <h2
              id={`person-${person.id}`}
              className="text-lg font-semibold text-gray-900 mb-1"
            >
              {person.firstName} {person.lastName}
            </h2>
            <p className="text-lg font-bold text-gray-900">$50.00</p>
          </div>
        ))}
      </div>
      {showSeeMore && (
        <button
          ref={buttonRef}
          onClick={handleSeeMore}
          className="w-auto py-2 px-4 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition-colors duration-200"
        >
          See More
        </button>
      )}
    </div>
  );
};

export default List;
