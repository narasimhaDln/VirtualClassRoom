import React, { useState } from 'react';
import { PlusCircle, X, BarChart2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function MeetingPolls({ onClose, isHost }) {
  const [polls, setPolls] = useState([]);
  const [showNewPoll, setShowNewPoll] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    anonymous: false
  });

  const createPoll = () => {
    if (!newPoll.question.trim() || newPoll.options.some(opt => !opt.trim())) {
      toast.error('Please fill all fields');
      return;
    }

    const poll = {
      id: Date.now(),
      ...newPoll,
      votes: newPoll.options.map(() => 0),
      voters: [],
      active: true,
      created: new Date()
    };

    setPolls(prev => [...prev, poll]);
    setShowNewPoll(false);
    setNewPoll({ question: '', options: ['', ''], anonymous: false });
    toast.success('Poll created successfully');
  };

  const vote = (pollId, optionIndex) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId && !poll.voters.includes('current-user-id')) {
        const newVotes = [...poll.votes];
        newVotes[optionIndex]++;
        return {
          ...poll,
          votes: newVotes,
          voters: [...poll.voters, 'current-user-id']
        };
      }
      return poll;
    }));
  };

  const endPoll = (pollId) => {
    setPolls(prev => prev.map(poll => 
      poll.id === pollId ? { ...poll, active: false } : poll
    ));
    toast.success('Poll ended');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium">Polls</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {isHost && (
        <button
          onClick={() => setShowNewPoll(true)}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg mb-4 flex items-center justify-center space-x-2"
        >
          <PlusCircle size={20} />
          <span>Create New Poll</span>
        </button>
      )}

      {showNewPoll && (
        <div className="mb-4 p-4 bg-gray-700 rounded-lg">
          <input
            type="text"
            placeholder="Question"
            value={newPoll.question}
            onChange={e => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
            className="w-full bg-gray-600 text-white rounded px-3 py-2 mb-3"
          />
          
          {newPoll.options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={e => {
                const newOptions = [...newPoll.options];
                newOptions[index] = e.target.value;
                setNewPoll(prev => ({ ...prev, options: newOptions }));
              }}
              className="w-full bg-gray-600 text-white rounded px-3 py-2 mb-2"
            />
          ))}

          <button
            onClick={() => setNewPoll(prev => ({
              ...prev,
              options: [...prev.options, '']
            }))}
            className="text-blue-400 hover:text-blue-300 text-sm mb-3"
          >
            + Add Option
          </button>

          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="anonymous"
              checked={newPoll.anonymous}
              onChange={e => setNewPoll(prev => ({
                ...prev,
                anonymous: e.target.checked
              }))}
              className="mr-2"
            />
            <label htmlFor="anonymous" className="text-gray-300 text-sm">
              Anonymous Poll
            </label>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={createPoll}
              className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Create Poll
            </button>
            <button
              onClick={() => setShowNewPoll(false)}
              className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {polls.map(poll => (
          <div key={poll.id} className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-white font-medium">{poll.question}</h4>
              {poll.active && isHost && (
                <button
                  onClick={() => endPoll(poll.id)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  End Poll
                </button>
              )}
            </div>

            <div className="space-y-2">
              {poll.options.map((option, index) => {
                const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
                const percentage = totalVotes === 0 ? 0 : 
                  Math.round((poll.votes[index] / totalVotes) * 100);

                return (
                  <div key={index} className="relative">
                    <button
                      onClick={() => poll.active && vote(poll.id, index)}
                      disabled={!poll.active || poll.voters.includes('current-user-id')}
                      className="w-full text-left p-3 rounded bg-gray-600 hover:bg-gray-500 disabled:hover:bg-gray-600 disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-blue-500 rounded opacity-20"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative flex justify-between">
                        <span className="text-white">{option}</span>
                        <span className="text-gray-300">{percentage}%</span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 text-sm text-gray-400">
              Total votes: {poll.votes.reduce((a, b) => a + b, 0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 