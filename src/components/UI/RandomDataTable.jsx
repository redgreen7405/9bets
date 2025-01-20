import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/solid";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { database } from "../../utils/firebase";

const getNumberGradient = (number) => {
  const gradientMap = {
    0: "linear-gradient(to right, red, violet)",
    5: "linear-gradient(to right, green, violet)",
    default: {
      odd: "green",
      even: "red",
      other: "black",
    },
  };

  if (number === 0) return gradientMap[0];
  if (number === 5) return gradientMap[5];

  if ([1, 3, 7, 9].includes(number)) return gradientMap.default.odd;
  if ([2, 4, 6, 8].includes(number)) return gradientMap.default.even;

  return gradientMap.default.other;
};

const RandomDataTable = () => {
  const [randomData, setRandomData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Firebase real-time listener
    useEffect(() => {
      const dbRef = ref(database, "randomData");
  
      const unsubscribe = onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert to array and sort first
          const sortedEntries = Object.entries(data)
            .sort(([, a], [, b]) => b.timestamp - a.timestamp)
  
          // Then map with period
          const dataArray = sortedEntries.map(([id, item]) => ({
            id,
            ...item,
          }));
  
          setRandomData(dataArray);
        }
      });
  
      // Cleanup subscription
      return () => unsubscribe();
    }, []);

  // useEffect(() => {
  //   const dbRef = ref(database, "randomData");
  //   const today = new Date();
  //   const yyyy = today.getFullYear();
  //   const mm = String(today.getMonth() + 1).padStart(2, "0");
  //   const dd = String(today.getDate()).padStart(2, "0");
  //   const dateString = `${yyyy}-${mm}-${dd}`; // Format: "YYYY-MM-DD"

  //   // Use the formatted date string in the query
  //   const todayQuery = query(dbRef, orderByChild("date"), equalTo(dateString));

  //   const unsubscribe = onValue(todayQuery, (snapshot) => {
  //     const data = snapshot.val();
  //     if (data) {
  //       const sortedEntries = Object.entries(data)
  //         .sort(([, a], [, b]) => b.timestamp - a.timestamp)
  //         .slice(0, 100);

  //       const dataArray = sortedEntries.map(([id, item]) => ({
  //         id,
  //         ...item,
  //       }));

  //       setRandomData(dataArray);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []); // Remove 'today' from dependencies as we calculate it inside useEffect

  // Rest of the component remains the same
  const processedData = useMemo(() => {
    if (!randomData || randomData.length === 0) return [];

    const filteredData = randomData.filter(
      (item) =>
        item.period.includes(searchTerm) ||
        item.number.toString().includes(searchTerm) ||
        item.bigSmall.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => {
      const modifier = sortConfig.direction === "asc" ? 1 : -1;

      if (a[sortConfig.key] < b[sortConfig.key]) return -1 * modifier;
      if (a[sortConfig.key] > b[sortConfig.key]) return 1 * modifier;

      return 0;
    });

    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    return sortedData.slice(indexOfFirstItem, indexOfLastItem);
  }, [randomData, searchTerm, sortConfig, currentPage, pageSize]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "desc"
          ? "asc"
          : "desc",
    }));
  };

  const tableHeaders = [
    { key: "period", label: "Period" },
    { key: "number", label: "Number" },
    { key: "bigSmall", label: "Big Small" },
    { label: "Color" },
  ];

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(randomData.length / pageSize);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex justify-center items-center gap-4 flex-col sm:flex-row">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Period, Number, or Big Small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-sm text-center">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header.label}
                  className={`px-4 py-3 text-center cursor-pointer ${
                    header.key ? "hover:bg-gray-100" : ""
                  }`}
                  onClick={() => header.key && handleSort(header.key)}
                >
                  <div className="flex items-center justify-center">
                    {header.label}
                    {header.key && sortConfig.key === header.key && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? (
                          <ArrowUpIcon className="h-4 w-4 inline" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 inline" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedData.length === 0 ? (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="px-4 py-3 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              processedData.map((data) => (
                <tr
                  key={data.id}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-4 py-3 text-center">{data.period}</td>
                  <td
                    className="px-4 py-3 text-xl font-bold text-center"
                    style={{
                      background: getNumberGradient(data.number),
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {data.number}
                  </td>
                  <td className="px-4 py-3 text-center capitalize">
                    {data.bigSmall}
                  </td>
                  <td className="px-4 py-3 flex justify-center space-x-2">
                    {data.colors.map((color, index) => (
                      <span
                        key={index}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full inline-block"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative">
          {isDropdownOpen && (
            <div className="absolute left-0 z-10 w-40 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu">
                {[10, 20, 50, 100].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setPageSize(size);
                      setCurrentPage(1);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    role="menuitem"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="First page"
          >
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous page"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPage} of {Math.ceil(randomData.length / pageSize)}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === Math.ceil(randomData.length / pageSize)}
            className="p-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next page"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() =>
              setCurrentPage(Math.ceil(randomData.length / pageSize))
            }
            disabled={currentPage === Math.ceil(randomData.length / pageSize)}
            className="p-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Last page"
          >
            <ChevronDoubleRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RandomDataTable;
