import React from 'react';

export function AssignmentList({ assignments, onViewAssignment }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {assignments.map((assignment) => (
        <div 
          key={assignment.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{assignment.title}</h3>
                <p className="text-gray-600">{assignment.subject}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {assignment.questions.length} Questions
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {assignment.questions.reduce((acc, q) => acc + q.points, 0)} Points
                  </span>
                </div>
              </div>
              <div className="text-red-600 text-sm font-medium">
                Due: {assignment.dueTime}
              </div>
            </div>
            <button
              onClick={() => onViewAssignment(assignment)}
              className="w-full mt-4 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View Assignment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 