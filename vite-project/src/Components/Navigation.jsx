import React, { useState } from 'react';
import { BookOpen, Bell, Settings } from 'lucide-react';
import { useToast } from '../Components/Hooks/UseTost';

export default function Navigation({ userName, userAvatar }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  const notifications = [
    { id: 1, title: 'Assignment Due', message: 'Math homework due in 2 hours', time: '2h ago', unread: true, type: 'warning' },
    { id: 2, title: 'New Message', message: 'Teacher posted a new announcement', time: '5m ago', unread: true, type: 'info' },
    { id: 3, title: 'Grade Posted', message: 'Your Physics quiz has been graded', time: '1d ago', unread: false, type: 'success' },
  ];

  const userMenuItems = [
    { label: 'Profile', action: () => showToast('Profile page coming soon', 'info') },
    { label: 'My Courses', action: () => handleNavClick('courses') },
    { label: 'Preferences', action: () => showToast('Preferences page coming soon', 'info') },
    { label: 'Sign Out', action: () => showToast('Signing out...', 'info') },
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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      default: return '📌';
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold flex items-center">
              <BookOpen className="mr-2 text-blue-200" size={24} />
              Virtual Classroom
            </h1>
            
            <div className="hidden md:flex items-center">
              <input
                type="text"
                placeholder="Search courses, assignments..."
                className="px-4 py-1.5 rounded-l-full bg-blue-700/50 border-0 focus:ring-2 focus:ring-blue-400 text-white placeholder-blue-200 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="px-4 py-1.5 rounded-r-full bg-blue-700/50 hover:bg-blue-700 transition-colors">
                🔍
              </button>
            </div>

            <nav className="hidden md:flex space-x-1">
              {['Dashboard', 'Courses', 'Calendar', 'Resources'].map((item) => (
                <button
                  key={item.toLowerCase()}
                  onClick={() => handleNavClick(item.toLowerCase())}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeNav === item.toLowerCase()
                      ? 'bg-white/20 text-white'
                      : 'hover:bg-white/10 text-blue-100 hover:text-white'
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
                className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
              >
                <Bell size={20} />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 animate-fade-in-down">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <button 
                      className="text-xs text-blue-600 hover:text-blue-800"
                      onClick={() => showToast('Marked all as read', 'success')}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1">
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSettingsClick}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Settings size={20} />
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <img
                  src={userAvatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-white/50 hover:border-white transition-colors"
                />
                <span className="hidden md:inline font-medium pr-2">{userName}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 animate-fade-in-down">
                  <div className="py-2">
                    {userMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.action();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}