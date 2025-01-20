// components/Loader.js
export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-16 h-16">
        <div className="absolute w-full h-full border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        {/* <div className="absolute w-10 h-10 border-4 border-blue-300 border-t-transparent rounded-full animate-spin-slower"></div> */}
      </div>
    </div>
  );
}