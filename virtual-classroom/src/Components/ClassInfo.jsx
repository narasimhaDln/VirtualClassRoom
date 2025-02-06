import  { useState } from 'react';
import { Calendar } from 'lucide-react';
import  useToast  from '../Components/Hooks/UseToast';

export default function ClassInfo({ className, roomNumber, isLive }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const { showToast } = useToast();

  const handleViewSchedule = () => {
    setShowSchedule(true);
    showToast('Loading class schedule...', 'info');
  };

  const handleJoinOfficeHours = () => {
    showToast('Joining office hours session...', 'info');
  };

  return (
    <div className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-4">
            <h2 className="font-semibold text-gray-800">{className}</h2>
            <span className="text-sm text-gray-500">Room: {roomNumber}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className={`text-sm flex items-center ${isLive ? 'text-green-500' : 'text-gray-500'}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${isLive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
              {isLive ? 'Live' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleViewSchedule}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
            >
              View Schedule
            </button>
            <button
              onClick={handleJoinOfficeHours}
              className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
            >
              Join Office Hours
            </button>
          </div>
        </div>
      </div>
      {showSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Class Schedule</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="mr-2" size={20} />
                <div>
                  <p className="font-medium">Monday</p>
                  <p className="text-sm text-gray-600">10:00 AM - 11:30 AM</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2" size={20} />
                <div>
                  <p className="font-medium">Wednesday</p>
                  <p className="text-sm text-gray-600">10:00 AM - 11:30 AM</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2" size={20} />
                <div>
                  <p className="font-medium">Friday</p>
                  <p className="text-sm text-gray-600">10:00 AM - 11:30 AM</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSchedule(false)}
              className="mt-6 w-full btn btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}