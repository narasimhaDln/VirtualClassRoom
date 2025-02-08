import React, { useState } from 'react';
import { BookOpen, Bell, Settings, Menu, X } from 'lucide-react';
import { useToast } from '../Components/Hooks/UseTost';
import { useNavigate } from 'react-router-dom';


export default function Navigation() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Assignment Due', message: 'Math homework due in 2 hours', time: '2h ago', unread: true, type: 'warning' },
    { id: 2, title: 'New Message', message: 'Teacher posted a new announcement', time: '5m ago', unread: true, type: 'info' },
    { id: 3, title: 'Grade Posted', message: 'Your Physics quiz has been graded', time: '1d ago', unread: false, type: 'success' },
  ];
  const userMenuItems = [
    { label: 'Profile', action: () => navigate('/profile') },
    { label: 'Sign Out', action: () => navigate('/login') },
  ];
  const settingsMenuItems = [
    { label: 'Settings', action: () => navigate('/settings') },
  ];

  const handleNavClick = (route) => {
    setActiveNav(route);
    
    // Handle different navigation routes
    switch (route) {
      case 'resources':
        navigate('/resources');
        break;
      case 'calendar':
        navigate('/calender'); // Note: matches the route path in App.jsx
        break;
      case 'courses':
        navigate('/courses');
        break;
      default:
        showToast(`Navigating to ${route}`, 'info');
    }
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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Main Navigation Bar */}
        <div className="relative flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <BookOpen className="h-8 w-8 text-blue-200" />
            <span className="hidden sm:block ml-2 text-xl font-bold">Virtual Classroom</span>
            <span className="sm:hidden ml-2 text-xl font-bold">VC</span>
          </div>

          {/* Center - Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center px-2 lg:ml-6 lg:justify-start">
            <div className="flex space-x-4">
              {['Dashboard', 'Courses', 'Calendar', 'Resources'].map((item) => (
                <button
                  key={item.toLowerCase()}
                  onClick={() => handleNavClick(item.toLowerCase())}
                  className={`${
                    activeNav === item.toLowerCase()
                      ? 'bg-white/20 text-white'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  } px-3 py-2 rounded-md text-sm font-medium transition-all duration-200`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center lg:ml-auto">
            {/* Notifications */}
            <div className="relative ml-3">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 sm:w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
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

            {/* Settings - Hidden on mobile */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <Settings size={20} />
              </button>
              {showSettingsMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 animate-fade-in-down">
                  <div className="py-2">
                    {settingsMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.action();
                          setShowSettingsMenu(false);
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

            {/* Profile dropdown */}
            <div className="relative ml-3">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 rounded-full hover:bg-white/10 transition-colors p-1"
              >
                 <img
                  src="https://i.pravatar.cc/100?img=4"
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-white/50 hover:border-white transition-colors"
                />
              </button>

              {/* Profile Dropdown Menu */}
              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
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

            {/* Mobile menu button */}
            <div className="flex lg:hidden ml-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white/10">
            {['Dashboard', 'Courses', 'Calendar', 'Resources'].map((item) => (
              <button
                key={item.toLowerCase()}
                onClick={() => {
                  handleNavClick(item.toLowerCase());
                  setIsMobileMenuOpen(false);
                }}
                className={`${
                  activeNav === item.toLowerCase()
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                } block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200`}
              >
                {item}
              </button>
            ))}
            {/* Mobile-only settings button */}
            {/* <button
              onClick={() => {
                handleSettingsClick();
                setIsMobileMenuOpen(false);
              }}
              className="sm:hidden text-blue-100 hover:bg-white/10 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              Settings
            </button> */}
          </div>
        </div>
      </div>
    </header>
  );
}