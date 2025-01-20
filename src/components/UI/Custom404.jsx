import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-6xl font-extrabold text-gray-800 text-center mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-600 text-center mb-6">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Sorry, the page you&quot;re looking for doesn&quot;t exist. If you
          think this is an error, please contact support or try navigating back
          to the home page.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/">
            <a className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition">
              Return Home
            </a>
          </Link>
          <Link href="/contact">
            <a className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium transition">
              Contact Support
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
