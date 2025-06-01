import React from 'react';
import { Play } from 'lucide-react';

const CampaignMedia = ({ file }: any) => {
  if (!file || !file.filePath) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <span className="text-gray-400">Media not available</span>
      </div>
    );
  }

  const isVideo = file.filePath?.toLowerCase().endsWith('.mp4');

  return (
    <div className="relative w-full h-full">
      {isVideo ? (
        <>
          <video
            className="w-full h-full object-cover rounded-lg"
            muted
            playsInline
            controls
          >
            <source src={file.filePath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black bg-opacity-50 rounded-full p-4">
              <Play size={48} className="text-white" />
            </div>
          </div>
        </>
      ) : (
        <img
          src={file.filePath}
          alt="Campaign Media"
          className="w-full h-full object-cover rounded-lg"
        />
      )}
    </div>
  );
};

export default CampaignMedia;