import { Button } from "@chakra-ui/react";
import React from "react";

const Home = () => {
  return (
    <div className="text-white flex flex-col items-center justify-center min-h-screen">
        {/* Text Content */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            Create. Vote. Engage.
          </h1>
          <p className="text-gray-400 mt-4 text-lg">
            Easily create polls, gather opinions, and make decisions faster than ever.
          </p>
        </div>

        {/* Poll Illustration */}
        <div className="relative bg-opacity-40 backdrop-blur-md bg-white/10 rounded-xl shadow-2xl p-6 lg:p-10 max-w-3xl w-full">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Poll Example: What&apos;s your favorite programming language?
          </h2>
          <div className="space-y-4">
            {/* Poll Option 1 */}
            <div className="relative bg-gray-700 p-4 rounded-full overflow-hidden">
              <div
                className="absolute inset-0 h-full rounded-full bg-blue-500"
                style={{ width: "70%" }}
              ></div>
              <div className="relative z-10 text-white font-semibold">
                JavaScript - 70 votes (70%)
              </div>
            </div>
            {/* Poll Option 2 */}
            <div className="relative bg-gray-700 p-4 rounded-full overflow-hidden">
              <div
                className="absolute inset-0 h-full rounded-full bg-green-500"
                style={{ width: "50%" }}
              ></div>
              <div className="relative z-10 text-white font-semibold">
                Python - 50 votes (50%)
              </div>
            </div>
            {/* Poll Option 3 */}
            <div className="relative bg-gray-700 p-4 rounded-full overflow-hidden">
              <div
                className="absolute inset-0 h-full rounded-full bg-red-500"
                style={{ width: "30%" }}
              ></div>
              <div className="relative z-10 text-white font-semibold">
                Java - 30 votes (30%)
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Home;
