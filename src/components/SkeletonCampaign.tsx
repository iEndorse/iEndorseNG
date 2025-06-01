import React from "react";

const SkeletonCampaign = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl border-gray-200 border sm:border-0 bg-white rounded-xl sm:rounded-2xl md:rounded-3xl my-4 sm:my-6 md:my-8 mx-2 animate-pulse">
      <div>
        <div className="flex items-center">
          <div className="mr-3 sm:mr-4 md:mr-6 bg-gray-300 rounded-full mx-1 sm:mx-2 h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16"></div>
          <div>
            <div className="bg-gray-300 h-4 sm:h-5 md:h-6 w-32 sm:w-40 md:w-48 mb-2 sm:mb-3 rounded"></div>
            <div className="bg-gray-300 h-3 sm:h-3.5 md:h-4 w-24 sm:w-28 md:w-32 rounded"></div>
          </div>
        </div>
      </div>

      <div className="my-4 sm:my-5 md:my-6 min-w-[280px] sm:min-w-[340px] md:min-w-[400px] max-w-[800px] rounded-lg">
        <div className="bg-gray-300 h-6 sm:h-7 md:h-8 w-64 sm:w-80 md:w-96 mb-2 sm:mb-3 rounded"></div>
        <div className="bg-gray-300 h-4 sm:h-5 md:h-6 w-full rounded"></div>
        <div className="bg-gray-300 h-4 sm:h-5 md:h-6 w-full rounded mt-1 sm:mt-1.5 md:mt-2"></div>
        <div className="bg-gray-300 h-4 sm:h-5 md:h-6 w-3/4 rounded mt-1 sm:mt-1.5 md:mt-2"></div>
      </div>

      <div className="my-4 sm:my-5 md:my-6">
        <div className="bg-gray-300 h-48 sm:h-56 md:h-64 rounded-xl sm:rounded-2xl md:rounded-3xl"></div>
      </div>

      <div className="flex mt-4 sm:mt-5 md:mt-6 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base">
        <div className="flex mr-4 sm:mr-6 md:mr-8 items-center">
          <div className="bg-gray-300 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full mr-1 sm:mr-1.5 md:mr-2"></div>
          <div className="bg-gray-300 h-4 sm:h-5 md:h-6 w-14 sm:w-16 md:w-20 rounded"></div>
        </div>
        <div className="flex items-center">
          <div className="bg-gray-300 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full mr-1 sm:mr-1.5 md:mr-2"></div>
          <div className="bg-gray-300 h-4 sm:h-5 md:h-6 w-14 sm:w-16 md:w-20 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCampaign;