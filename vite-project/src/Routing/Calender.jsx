import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [meetings, setMeetings] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const navigate = useNavigate();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper functions to replace date-fns
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3) ? 0 : (day % 100 - day % 10 !== 10) ? day % 10 : 0];
    return `${month} ${day}${suffix}, ${year}`;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    return days;
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
      setShowModal(true);
    }
  };

  const handleAddMeeting = () => {
    if (selectedDate && meetingTitle && meetingTime) {
      const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
      setMeetings(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), { title: meetingTitle, time: meetingTime }]
      }));
      setMeetingTitle('');
      setMeetingTime('');
      setShowModal(false);
    }
  };

  // Add this function to handle navigation
  const handleJoinClass = () => {
    navigate('/video-conference');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleJoinClass}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Class</span>
            </button>
           <center>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
           </center>
          </div>
        </div>


        <div className="container mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
            {/* Calendar Header */}
            <div className="p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Week days header */}
              <div className="grid grid-cols-7 gap-4">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-blue-100">
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6 ">
              <div className="grid grid-cols-7 gap-4">
                {generateCalendarDays().map((date, index) => {
                  const dateKey = date ? 
                    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : 
                    null;
                  const dayMeetings = dateKey ? (meetings[dateKey] || []) : [];
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleDateClick(date)}
                      className={`min-h-24 p-2  rounded-lg border transition-all 
                        ${date ? 'cursor-pointer  hover:shadow-md' : 'bg-gray-50'}
                        ${date && isToday(date) ? 'bg-blue-50 border-blue-500' : 'border-gray-200'}
                        ${selectedDate && date && selectedDate.toDateString() === date.toDateString() ? 'ring-2 ring-blue-500' : ''}
                      `}
                    >
                      {date && (
                        <>
                          <div className={`font-medium mb-1 ${isToday(date) ? 'text-blue-600' : ''}`}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayMeetings.map((meeting, idx) => (
                              <div
                                key={idx}
                                className="text-xs p-1.5 bg-blue-100 text-blue-700 rounded-md truncate"
                              >
                                {meeting.time} - {meeting.title}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Meeting Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Add Meeting for {selectedDate ? formatDate(selectedDate) : ''}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter meeting title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleAddMeeting}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Add Meeting
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}