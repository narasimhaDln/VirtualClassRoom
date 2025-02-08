import React, { useState } from 'react';
import { BookOpen, Calendar, Bell, Mail, Users2, Settings, ExternalLink } from 'lucide-react';
import { useToast } from '../Components/Hooks/UseTost';

export default function Sidebar({ instructor }) {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Quiz: Chapter 3',
      dueDate: 'Due in 2 days',
      type: 'important',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Homework #5',
      dueDate: 'Due next week',
      type: 'assignment',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Group Project Milestone',
      dueDate: 'Due tomorrow',
      type: 'important',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Reading Assignment',
      dueDate: 'Due in 3 days',
      type: 'assignment',
      status: 'completed'
    }
  ]);

  const resources = [
    { id: 1, title: 'Course Syllabus', icon: 'book', url: '#' },
    { id: 2, title: 'Office Hours Schedule', icon: 'calendar', url: '#' },
    { id: 3, title: 'Class Discussion Forum', icon: 'users', url: '#' },
    { id: 4, title: 'Course Materials', icon: 'book', url: '#' },
    { id: 5, title: 'Announcements', icon: 'bell', url: '#' }
  ];

  const { showToast } = useToast();

  const handleAssignmentClick = (assignment) => {
    showToast(`Opening ${assignment.title}`, 'info');
  };

  const handleResourceClick = (resource) => {
    showToast(`Opening ${resource.title}`, 'info');
  };
                                                                                            
  const getStatusBadge = (status) => {
    return status === 'completed' ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        Completed
      </span>
    ) : null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Class Information</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <Settings size={18} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Instructor</h4>
          <div className="flex items-center mt-2">
            <img
              src={instructor.avatar}
              alt={instructor.name}
              className="w-10 h-10 rounded-full ring-2 ring-white"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{instructor.name}</p>
              <p className="text-xs text-gray-500">{instructor.department}</p>
              <div className="flex items-center mt-1 space-x-3">
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                  <Mail size={12} className="mr-1" /> Email
                </button>
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                  <Calendar size={12} className="mr-1" /> Office Hours
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Schedule</h4>
          <div className="mt-2">
            <p className="text-sm flex items-center">
              <Calendar size={14} className="mr-2 text-gray-400" />
              Mon, Wed, Fri • 10:00 AM - 11:30 AM
            </p>
            <p className="text-xs text-gray-500 mt-1">Room: Building A, Room 101</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-500">Upcoming</h4>
            <span className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer">View All</span>
          </div>
          <div className="space-y-2">
            {assignments.map(assignment => (
              <div
                key={assignment.id}
                onClick={() => handleAssignmentClick(assignment)}
                className={`p-3 rounded-lg cursor-pointer transition-all hover:transform hover:scale-[1.01] ${
                  assignment.type === 'important'
                    ? 'bg-orange-50 hover:bg-orange-100'
                    : 'bg-blue-50 hover:bg-blue-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm font-medium ${
                      assignment.type === 'important' ? 'text-orange-800' : 'text-blue-800'
                    }`}>
                      {assignment.title}
                    </p>
                    <p className={`text-xs mt-1 ${
                      assignment.type === 'important' ? 'text-orange-600' : 'text-blue-600'
                    }`}>
                      {assignment.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(assignment.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      assignment.type === 'important'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {assignment.type === 'important' ? 'Important' : 'Assignment'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Resources</h4>
          <div className="grid grid-cols-1 gap-2">
            {resources.map(resource => (
              <button
                key={resource.id}
                onClick={() => handleResourceClick(resource)}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all hover:shadow-sm flex items-center justify-between group"
              >
                <div className="flex items-center">
                  {resource.icon === 'book' && <BookOpen size={16} className="mr-2 text-gray-400" />}
                  {resource.icon === 'calendar' && <Calendar size={16} className="mr-2 text-gray-400" />}
                  {resource.icon === 'users' && <Users2 size={16} className="mr-2 text-gray-400" />}
                  {resource.icon === 'bell' && <Bell size={16} className="mr-2 text-gray-400" />}
                  {resource.title}
                </div>
                <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}