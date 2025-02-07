import React, { useState, useEffect } from 'react';
import { useAuth } from '../User/AuthContext';

export function SubmittedAssignments() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('https://react-5c1b7-default-rtdb.firebaseio.com/Assignment.json');
      const data = await response.json();
      
      if (data) {
        // Convert the object to array
        const submissionsArray = Object.entries(data).map(([id, submission]) => ({
          id,
          ...submission
        }));
        
        // Filter by current user (you'll need to implement user auth)
        const userSubmissions = submissionsArray.filter(
          sub => sub.studentId === "student1" // Replace with actual user ID
        );
        
        setSubmissions(userSubmissions);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="text-blue-500 mr-2">📝</span>
        Submitted Assignments
      </h2>
      
      {submissions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No submissions found</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {submissions.map((submission) => (
            <div 
              key={submission.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{submission.title}</h3>
                    <p className="text-gray-600">{submission.subject}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted: {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {submission.status}
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Points:</span>
                    <span className="font-medium">{submission.totalPoints}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <h4 className="font-medium mb-2">Answers:</h4>
                    {submission.answers.map((answer, index) => (
                      <div key={index} className="mb-4 bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Question {index + 1}: {answer.questionText}
                        </p>
                        <div className="text-sm text-gray-600">
                          {answer.type === 'code' ? (
                            <pre className="bg-gray-800 text-gray-200 p-3 rounded mt-2 overflow-x-auto">
                              {answer.answer}
                            </pre>
                          ) : answer.type === 'multiple' ? (
                            <div className="mt-1">
                              {Array.isArray(answer.answer) ? 
                                answer.answer.map((opt, i) => (
                                  <div key={i} className="flex items-center">
                                    <span className="mr-2">✓</span>
                                    {opt}
                                  </div>
                                ))
                                : answer.answer
                              }
                            </div>
                          ) : (
                            <p className="mt-1">{answer.answer}</p>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          Points: {answer.points}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 