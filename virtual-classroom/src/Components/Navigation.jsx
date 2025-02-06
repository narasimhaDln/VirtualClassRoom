import  { useState } from 'react';
import { BookOpen, Bell, Settings } from 'lucide-react';
import  useToast  from '../Components/Hooks/UseToast';

export default function Navigation({ userName, userAvatar }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const { showToast } = useToast();

  const notifications = [
    { id: 1, title: 'Assignment Due', message: 'Math homework due in 2 hours', time: '2h ago', unread: true },
    { id: 2, title: 'New Message', message: 'Teacher posted a new announcement', time: '5m ago', unread: true },
  ];

  const handleNavClick = (nav) => {
    setActiveNav(nav);
    showToast(`Navigating to ${nav}`, 'info');
  };

  const handleNotificationClick = (id) => {
    showToast('Notification marked as read', 'success');
    setShowNotifications(false);
  };

  const handleSettingsClick = () => {
    showToast('Settings panel opening soon', 'info');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold flex items-center">
              <BookOpen className="mr-2" size={24} />
              Virtual Classroom
            </h1>
            <nav className="hidden md:flex space-x-4">
              {['Dashboard', 'Courses', 'Calendar'].map((item) => (
                <button
                  key={item.toLowerCase()}
                  onClick={() => handleNavClick(item.toLowerCase())}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeNav === item.toLowerCase()
                      ? 'bg-blue-700'
                      : 'hover:bg-blue-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-blue-700 transition-colors relative"
              >
                <Bell size={20} />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 animate-slide-in">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-800">
                            {notification.title}
                            {notification.unread && (
                              <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </span>
                          <span className="text-sm text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleSettingsClick}
              className="p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Settings size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <img
                src={userAvatar}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span className="hidden md:inline font-medium">{userName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}