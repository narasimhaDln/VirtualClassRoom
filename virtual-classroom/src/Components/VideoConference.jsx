import  { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Share, Hand, Users, Settings, Layout, Pin, MoreVertical } from 'lucide-react';

export default function VideoConference() {
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Teacher Smith', isSpeaking: true, handRaised: false, role: 'teacher', isMuted: false, isVideoOff: false, isPinned: true },
    { id: 2, name: 'John Doe', isSpeaking: false, handRaised: true, role: 'student', isMuted: true, isVideoOff: false, isPinned: false },
    { id: 3, name: 'Jane Smith', isSpeaking: false, handRaised: false, role: 'student', isMuted: false, isVideoOff: true, isPinned: false },
    { id: 4, name: 'Mike Johnson', isSpeaking: false, handRaised: false, role: 'student', isMuted: false, isVideoOff: false, isPinned: false },
  ]);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [layout, setLayout] = useState('grid');
  const [showParticipants, setShowParticipants] = useState(false);

  const togglePin = (participantId) => {
    setParticipants(participants.map(p => ({
      ...p,
      isPinned: p.id === participantId ? !p.isPinned : false
    })));
  };

  const pinnedParticipant = participants.find(p => p.isPinned);

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold">Live Session</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLayout(layout === 'grid' ? 'spotlight' : 'grid')}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            <Layout size={20} />
          </button>
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            <Users size={20} />
          </button>
        </div>
      </div>

      <div className={`grid ${layout === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-4 mb-4`}>
        {layout === 'spotlight' && pinnedParticipant ? (
          <div className="col-span-full aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
            <img
              src={`https://source.unsplash.com/random/800x600?face&sig=${pinnedParticipant.id}`}
              alt={pinnedParticipant.name}
              className="w-full h-full object-cover"
            />
            <ParticipantOverlay participant={pinnedParticipant} onPin={togglePin} />
          </div>
        ) : null}
        
        <div className={layout === 'spotlight' && pinnedParticipant ? 'grid grid-cols-4 gap-2' : ''}>
          {participants
            .filter(p => layout === 'grid' || !p.isPinned)
            .map((participant) => (
              <div
                key={participant.id}
                className={`relative aspect-video bg-gray-800 rounded-lg overflow-hidden ${
                  layout === 'spotlight' && pinnedParticipant ? 'col-span-1' : ''
                }`}
              >
                {!participant.isVideoOff ? (
                  <img
                    src={`https://source.unsplash.com/random/300x200?face&sig=${participant.id}`}
                    alt={participant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-2xl text-white">{participant.name[0]}</span>
                    </div>
                  </div>
                )}
                <ParticipantOverlay participant={participant} onPin={togglePin} />
              </div>
            ))}
        </div>
      </div>

      {showParticipants && (
        <div className="absolute right-4 top-20 w-64 bg-white rounded-lg shadow-lg p-4 z-10">
          <h3 className="font-semibold mb-2">Participants ({participants.length})</h3>
          <div className="space-y-2">
            {participants.map(participant => (
              <div key={participant.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full ${participant.isSpeaking ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></span>
                  <span>{participant.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {participant.handRaised && <Hand size={16} className="text-yellow-500" />}
                  {participant.isMuted && <MicOff size={16} className="text-red-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center space-x-4 py-4 border-t border-gray-700">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3 rounded-full ${
            isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {isMuted ? (
            <MicOff className="text-white" size={20} />
          ) : (
            <Mic className="text-white" size={20} />
          )}
        </button>
        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-3 rounded-full ${
            !isVideoOn ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {isVideoOn ? (
            <Video className="text-white" size={20} />
          ) : (
            <VideoOff className="text-white" size={20} />
          )}
        </button>
        <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
          <Share className="text-white" size={20} />
        </button>
        <button
          onClick={() => setHandRaised(!handRaised)}
          className={`p-3 rounded-full ${
            handRaised ? 'bg-yellow-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Hand className="text-white" size={20} />
        </button>
        <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
          <Settings className="text-white" size={20} />
        </button>
      </div>
    </div>
  );
}

function ParticipantOverlay({ participant, onPin }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm">{participant.name}</span>
          {participant.isSpeaking && (
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {participant.handRaised && (
            <Hand size={16} className="text-yellow-400" />
          )}
          {participant.isMuted && (
            <MicOff size={16} className="text-red-400" />
          )}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-white hover:bg-gray-700 rounded-full p-1"
            >
              <MoreVertical size={16} />
            </button>
            {showMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                <button
                  onClick={() => onPin(participant.id)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                >
                  <Pin size={16} className="mr-2" />
                  {participant.isPinned ? 'Unpin' : 'Pin'} participant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
