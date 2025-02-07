import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { toast } from 'react-hot-toast';
import { useAuth } from '../User/AuthContext';

export function Assignment({ assignment, onClose }) {
  const [answers, setAnswers] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [codeOutput, setCodeOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const supportedLanguages = [
    { id: 'javascript', name: 'JavaScript', icon: '⚡' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚙️' },
    { id: 'c', name: 'C', icon: '🔧' }
  ];

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleRunCode = async (code, language) => {
    setIsExecuting(true);
    try {
      // Simulate a brief execution delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simply display the code that was written
      const output = `Your ${language} code:\n\n${code}`;
      setCodeOutput(output);
    } catch (error) {
      setCodeOutput(`Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Check if all questions are answered
      const unansweredQuestions = assignment.questions.filter(
        q => !answers[q.id]
      );

      if (unansweredQuestions.length > 0) {
        toast.error(`Please answer all questions before submitting`);
        return;
      }

      const submission = {
        assignmentId: assignment.id,
        studentId: "student1", // This should be dynamic
        studentName: "Student", // This should be dynamic
        subject: assignment.subject,
        title: assignment.title,
        submittedAt: new Date().toISOString(),
        answers: assignment.questions.map(question => ({
          questionId: question.id,
          questionText: question.question,
          answer: answers[question.id] || '',
          type: question.type,
          points: question.points,
          language: question.type === 'code' ? selectedLanguage : undefined,
          codeOutput: question.type === 'code' ? codeOutput : undefined
        })),
        totalPoints: assignment.questions.reduce((acc, q) => acc + q.points, 0),
        status: "submitted"
      };

      // Before submission
      console.log('Submitting assignment:', submission);

      // First check if the endpoint is accessible
      try {
        const testResponse = await fetch('https://react-5c1b7-default-rtdb.firebaseio.com/Assignment.json');
        if (!testResponse.ok) {
          throw new Error('Cannot access the database');
        }
      } catch (error) {
        throw new Error('Network error: Cannot connect to database');
      }

      // Submit the assignment
      const response = await fetch('https://react-5c1b7-default-rtdb.firebaseio.com/Assignment.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit assignment');
      }

      const result = await response.json();
      console.log('Submission response:', response);
      console.log('Submission result:', result);

      toast.success('Assignment submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{assignment.title}</h2>
              <p className="text-gray-600">{assignment.subject}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {assignment.questions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">
                  Question {index + 1}
                  <span className="ml-2 text-sm text-gray-500">
                    ({question.points} points)
                  </span>
                </h3>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  {question.type}
                </span>
              </div>
              <p className="text-gray-800">{question.question}</p>
              
              {question.type === 'code' && (
                <CodeEditor
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  code={answers[question.id] || ''}
                  onCodeChange={(value) => handleAnswerChange(question.id, value)}
                  onRunCode={handleRunCode}
                  codeOutput={codeOutput}
                  isExecuting={isExecuting}
                  supportedLanguages={supportedLanguages}
                />
              )}

              {question.type === 'multiple' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, i) => (
                    <label key={i} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={answers[question.id]?.includes(option) || false}
                        onChange={(e) => {
                          const currentAnswers = answers[question.id] || [];
                          if (e.target.checked) {
                            handleAnswerChange(question.id, [...currentAnswers, option]);
                          } else {
                            handleAnswerChange(
                              question.id,
                              currentAnswers.filter(ans => ans !== option)
                            );
                          }
                        }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'text' && (
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your answer here..."
                />
              )}
            </div>
          ))}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 