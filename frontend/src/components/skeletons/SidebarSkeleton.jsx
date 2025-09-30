import React from "react";

const SidebarSkeleton = () => {
  // Dummy array to simulate 6 loading items
  const skeletonItems = Array(6).fill(null);

  return (
    <div className="w-full h-full overflow-y-auto p-2">
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center w-full p-2 mb-2 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
        >
          {/* Left: Avatar + Name */}
          <div className="flex items-center gap-3">
            {/* Avatar circle */}
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>

            {/* Name + Email */}
            <div className="flex flex-col gap-2">
              <div className="w-24 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="w-36 h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>

          {/* Right: Last active time */}
          <div className="w-10 h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default SidebarSkeleton;
