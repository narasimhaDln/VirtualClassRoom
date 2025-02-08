import React, { useState } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaUserTimes, FaCircle } from "react-icons/fa";

const defaultParticipants = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "https://i.pravatar.cc/40?img=1",
    isMuted: false,
    isOnline: true,
  },
  {
    id: 2,
    name: "Bob Williams",
    avatar: "https://i.pravatar.cc/40?img=2",
    isMuted: true,
    isOnline: false,
  },
  {
    id: 3,
    name: "Charlie Brown",
    avatar: "https://i.pravatar.cc/40?img=3",
    isMuted: false,
    isOnline: true,
  },
  {
    id: 4,
    name: "Kuldeep Brown",
    avatar: "https://i.pravatar.cc/40?img=4",
    isMuted: false,
    isOnline: true,
  },
  {
    id: 5,
    name: "DLN",
    avatar: "https://i.pravatar.cc/40?img=5",
    isMuted: false,
    isOnline: true,
  },
    {
    id: 6,
    name: "Kishan",
    avatar: "https://i.pravatar.cc/40?img=64",
    isMuted: false,
    isOnline: true,
  },
  

];

const Participants = () => {
  const [participants, setParticipants] = useState(defaultParticipants);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleMute = (id) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isMuted: !p.isMuted } : p))
    );
  };

  const removeParticipant = (id) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredParticipants = participants.filter((participant) =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Meeting Participants</h2>

      {/* Search Input */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Search participant name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-400 rounded-lg flex-1 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Participants List */}
      <div className="max-h-80 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParticipants.length === 0 ? (
            <p className="text-gray-500">No participants found.</p>
          ) : (
            filteredParticipants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white hover:shadow-xl transition"
              >
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-medium flex items-center gap-2 break-words whitespace-normal">
                    {participant.name}
                    <FaCircle
                      className={`text-xs ${
                        participant.isOnline ? "text-green-500" : "text-red-500"
                      }`}
                    />
                  </h4>
                  <p className="text-sm text-gray-500">
                    {participant.isMuted ? "Muted" : "Unmuted"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {/* Mute/Unmute Button */}
                  <button
                    onClick={() => toggleMute(participant.id)}
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                    aria-label={participant.isMuted ? "Unmute" : "Mute"}
                  >
                    {participant.isMuted ? (
                      <FaMicrophoneSlash className="text-red-500" />
                    ) : (
                      <FaMicrophone className="text-green-500" />
                    )}
                  </button>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeParticipant(participant.id)}
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                    aria-label="Remove Participant"
                  >
                    <FaUserTimes className="text-gray-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Participants;

