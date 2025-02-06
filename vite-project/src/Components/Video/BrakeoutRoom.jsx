import React, { useState } from 'react';
import { Users, UserPlus, ArrowLeftCircle, Search, Settings, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

function BreakoutRooms({ breakoutRooms, participants, onCreateRoom, onMoveParticipant, onDeleteRoom, onRenameRoom }) {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(4);

  const handleMaxParticipantsChange = (value) => {
    const num = parseInt(value);
    if (num >= 2 && num <= 20) {
      setMaxParticipants(num);
    }
  };

  const handleCreateRoom = () => {
    const trimmedName = newRoomName.trim();
    if (!trimmedName) {
      toast?.({
        title: "Error",
        description: "Room name cannot be empty",
        status: "error"
      });
      return;
    }
    if (breakoutRooms.some(room => room.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast?.({
        title: "Error",
        description: "Room name already exists",
        status: "error"
      });
      return;
    }
    onCreateRoom(trimmedName, maxParticipants);
    setNewRoomName('');
    setIsCreatingRoom(false);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const participantId = result.draggableId;
    const destinationRoomId = result.destination.droppableId;
    const destinationRoom = breakoutRooms.find(room => room.id.toString() === destinationRoomId);
    
    if (destinationRoom && destinationRoom.maxParticipants && 
        destinationRoom.participants.length >= destinationRoom.maxParticipants) {
      toast?.({
        title: "Error",
        description: "Room has reached maximum capacity",
        status: "error"
      });
      return;
    }
    
    onMoveParticipant(participantId, parseInt(destinationRoomId));
  };

  return (
    <div className="absolute left-4 top-20 w-80 bg-white rounded-lg shadow-xl p-4 z-10 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Breakout Rooms
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCreatingRoom(true)}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            New Room
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md text-sm"
          />
        </div>
      </div>

      {isCreatingRoom && (
        <div className="mb-4 bg-gray-50 p-4 rounded-md border">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Room name"
            className="w-full px-3 py-2 border rounded-md mb-2"
            maxLength={30}
          />
          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm text-gray-600">Max participants:</label>
            <input
              type="number"
              min="2"
              max="20"
              value={maxParticipants}
              onChange={(e) => handleMaxParticipantsChange(e.target.value)}
              className="w-20 px-2 py-1 border rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateRoom}
              className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Create Room
            </button>
            <button
              onClick={() => setIsCreatingRoom(false)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {breakoutRooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No breakout rooms created yet
            </div>
          ) : (
            breakoutRooms.map((room) => (
              <Droppable key={room.id} droppableId={room.id.toString()}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="p-3 border rounded-md bg-white hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          {room.name}
                          <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                            {room.participants.length}/{room.maxParticipants || '∞'}
                          </span>
                        </h3>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onRenameRoom(room.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteRoom(room.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {room.participants
                        .filter(id => {
                          const participant = participants.find(p => p.id === id);
                          return participant?.name.toLowerCase().includes(searchTerm.toLowerCase());
                        })
                        .map((participantId, index) => {
                          const participant = participants.find(p => p.id === participantId);
                          return participant ? (
                            <Draggable
                              key={participant.id}
                              draggableId={participant.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded hover:bg-gray-100"
                                >
                                  <span className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    {participant.name}
                                  </span>
                                  <button
                                    onClick={() => onMoveParticipant(participant.id, 0)}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ) : null;
                        })}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))
          )}
        </div>
      </DragDropContext>
    </div>
  );
}

BreakoutRooms.propTypes = {
  breakoutRooms: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    participants: PropTypes.arrayOf(PropTypes.number).isRequired,
    maxParticipants: PropTypes.number
  })).isRequired,
  participants: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  onCreateRoom: PropTypes.func.isRequired,
  onMoveParticipant: PropTypes.func.isRequired,
  onDeleteRoom: PropTypes.func.isRequired,
  onRenameRoom: PropTypes.func.isRequired
};

export default BreakoutRooms;