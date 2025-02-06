import React, { memo } from 'react';
import ParticipantOverlay from './ParticipentOverlay';

const ParticipantVideo = memo(({ 
  participant, 
  videoRef,
  onPin,
  onMute,
  onVideoToggle,
  isLocal,
  isScreenShare,
  isPinned,
  quality
}) => {
  const renderVideo = () => {
    if (isLocal) {
      return (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isScreenShare ? 'object-contain' : 'object-cover'}`}
        />
      );
    }

    return !participant.isVideoOff ? (
      <div className="relative w-full h-full">
        <img
          src={`https://source.unsplash.com/random/300x200?face&sig=${participant.id}`}
          alt={participant.name}
          className={`w-full h-full ${isScreenShare ? 'object-contain' : 'object-cover'}`}
        />
        {quality && (
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <div className={`h-2 w-2 rounded-full ${
              quality === 'good' ? 'bg-green-500' : 
              quality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
          </div>
        )}
      </div>
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gray-700">
        <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center">
          <span className="text-2xl text-white uppercase">{participant.name[0]}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative aspect-video bg-gray-800 rounded-lg overflow-hidden
      ${isPinned ? 'ring-2 ring-blue-500' : ''}
      transition-transform duration-200 hover:scale-[1.01]`}
    >
      {renderVideo()}
      <ParticipantOverlay 
        participant={participant}
        onPin={onPin}
        onMute={onMute}
        onVideoToggle={onVideoToggle}
        isPinned={isPinned}
        isScreenShare={isScreenShare}
      />
      {participant.audioLevel > 0 && !participant.isMuted && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 transition-all duration-150"
          style={{ 
            width: `${participant.audioLevel * 100}%`,
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)'
          }}
        />
      )}
      {participant.isMuted && (
        <div className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-md text-xs text-white">
          Muted
        </div>
      )}
    </div>
  );
});

ParticipantVideo.displayName = 'ParticipantVideo';
export default ParticipantVideo; 