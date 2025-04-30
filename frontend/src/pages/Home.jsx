import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 text-white text-center py-20">
        <h2 className="text-3xl font-semibold">Welcome to MyStore</h2>
        <p className="mt-2">Find the best deals on your favorite products</p>
      </div>

      {/* Featured Items */}
      <div className="container mx-auto py-10 px-4">
        <h3 className="text-2xl font-semibold mb-6 text-purple-600">Featured Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white p-4 shadow-md rounded-lg">
              <div className="h-40 bg-purple-200 flex items-center justify-center text-gray-600">
                Image
              </div>
              <h4 className="mt-2 text-lg font-medium">Product {item}</h4>
              <p className="text-gray-700">$99.99</p>
              <button className="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
