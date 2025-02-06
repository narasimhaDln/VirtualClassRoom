import  { useState } from 'react';
import { BookOpen, Calendar } from 'lucide-react';
import  useToast from '../Components/Hooks/UseToast';


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
    }
  ]);

  const resources = [
    { id: 1, title: 'Course Syllabus', icon: 'book', url: '#' },
    { id: 2, title: 'Office Hours Schedule', icon: 'calendar', url: '#' }
  ];

  const { showToast } = useToast();

  const handleAssignmentClick = (assignment) => {
    showToast(`Opening ${assignment.title}`, 'info');
  };

  const handleResourceClick = (resource) => {
    showToast(`Opening ${resource.title}`, 'info');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Class Information</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Instructor</h4>
          <div className="flex items-center mt-1">
            <img
              src={instructor.avatar}
              alt={instructor.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium">{instructor.name}</p>
              <p className="text-xs text-gray-500">{instructor.department}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Schedule</h4>
          <p className="mt-1 text-sm">Mon, Wed, Fri • 10:00 AM - 11:30 AM</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Upcoming</h4>
          <div className="mt-2 space-y-2">
            {assignments.map(assignment => (
              <div
                key={assignment.id}
                onClick={() => handleAssignmentClick(assignment)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
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
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    assignment.type === 'important'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {assignment.type === 'important' ? 'Important' : 'Assignment'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500">Resources</h4>
          <div className="mt-2 space-y-2">
            {resources.map(resource => (
              <button
                key={resource.id}
                onClick={() => handleResourceClick(resource)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
              >
                {resource.icon === 'book' ? (
                  <BookOpen size={16} className="mr-2" />
                ) : (
                  <Calendar size={16} className="mr-2" />
                )}
                {resource.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}