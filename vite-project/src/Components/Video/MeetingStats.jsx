import React from 'react';
import { Wifi, Clock, Users, Gauge } from 'lucide-react';

export function MeetingStats({ 
  networkQuality, 
  duration, 
  participantCount,
  resolution,
  bitrate,
  packetLoss,
  onClose 
}) {
  return (
    <div className="absolute right-0 top-12 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div className="p-4">
        <h3 className="text-white font-medium mb-4">Meeting Statistics</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wifi className="text-gray-400" size={16} />
              <span className="text-gray-300 text-sm">Network Quality</span>
            </div>
            <span className={`text-sm font-medium ${
              networkQuality > 80 ? 'text-green-400' : 
              networkQuality > 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {networkQuality}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="text-gray-400" size={16} />
              <span className="text-gray-300 text-sm">Duration</span>
            </div>
            <span className="text-gray-300 text-sm">{duration}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="text-gray-400" size={16} />
              <span className="text-gray-300 text-sm">Participants</span>
            </div>
            <span className="text-gray-300 text-sm">{participantCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gauge className="text-gray-400" size={16} />
              <span className="text-gray-300 text-sm">Resolution</span>
            </div>
            <span className="text-gray-300 text-sm">{resolution}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Bitrate</span>
            <span className="text-gray-300 text-sm">{bitrate} kbps</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Packet Loss</span>
            <span className="text-gray-300 text-sm">{packetLoss}%</span>
          </div>
        </div>
      </div>
    </div>
  );
} 