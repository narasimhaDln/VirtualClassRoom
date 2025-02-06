import React, { useState } from 'react';
import Navigation from './Components/Navigation';
import ClassInfo from './Components/ClassInfo';
import VideoConference from './Components/Video/VideoConference';
import Whiteboard from './Components/Whiteboard';
import Chat from './Components/Chat';
import Sidebar from './Components/Sidebar';
import { Grid, MessageSquare, Hand, Users, Settings, Presentation } from 'lucide-react';
import { useToast } from "../src/Components/Hooks/UseTost"
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Components/User/AuthContext';
import { ProtectedRoute } from './Components/User/ProtectedRoute';
import { Login } from './Components/User/Login';
import { Register } from './Components/User/Register';
import { useAuth } from './Components/User/AuthContext';
import { AssignmentList } from './Components/Assignments/AssignmentList';
import { Assignment } from './Components/Assignments/Assignment';
import { SubmittedAssignments } from './Components/Assignments/SubmittedAssignments';

function MainApp() {
  const [activeTab, setActiveTab] = useState('whiteboard');
  const [isRaiseHand, setIsRaiseHand] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showVideoConference, setShowVideoConference] = useState(false);
  const { ToastContainer, toast } = useToast();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [codeOutput, setCodeOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});

  const supportedLanguages = [
    { id: 'javascript', name: 'JavaScript', icon: '⚡' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚙️' },
    { id: 'c', name: 'C', icon: '🔧' }
  ];

  const scheduledClasses = [
    {
      id: 1,
      name: 'Mathematics 101',
      instructor: 'Dr. Sarah Johnson',
      startTime: '10:00 AM',
      duration: '1h',
      topic: 'Differential Equations',
      status: 'upcoming'
    }
  ];

  const upcomingClasses = [
    {
      id: 2,
      name: "Javascript",
      instructor: 'Dr. Michael Brown',
      startTime: '2:00 PM',
      duration: '1h',
      topic: 'Quantum Mechanics',
      status: 'upcoming'
    },
    {
      id: 3,
      name: 'React.js',
      instructor: 'Dr. Emily White',
      startTime: '4:00 PM',
      duration: '1h',
      topic: 'Organic Chemistry',
      status: 'upcoming'
    }
  ];

  const todaysAssignments = [
    {
      id: 1,
      subject: 'Javascript',
      title: 'JavaScript Fundamentals Quiz',
      dueTime: '11:59 PM',
      status: 'pending',
      questions: [
        {
          id: 1,
          question: 'What is the difference between let and var in JavaScript?',
          type: 'text',
          points: 5
        },
        {
          id: 2,
          question: 'Explain how closures work in JavaScript with an example.',
          type: 'code',
          points: 10
        },
        {
          id: 3,
          question: 'Select all that apply to ES6 features:',
          type: 'multiple',
          options: ['Arrow Functions', 'let/const', 'Promises', 'async/await'],
          points: 5
        }
      ]
    },
    {
      id: 2,
      subject: 'React.js',
      title: 'React Hooks Implementation',
      dueTime: '5:00 PM',
      status: 'pending',
      questions: [
        {
          id: 1,
          question: 'Implement a custom hook for handling form state.',
          type: 'code',
          points: 15
        },
        {
          id: 2,
          question: 'Explain the difference between useEffect and useLayoutEffect.',
          type: 'text',
          points: 5
        }
      ]
    }
  ];

  const handleJoinClass = (classInfo) => {
    setShowVideoConference(true);
    toast.success(`Joining ${classInfo.name}`);
  };

  const instructor = {
    name: 'Dr. Sarah Johnson',
    department: 'Mathematics Department',
    avatar: 'https://source.unsplash.com/random/40x40?teacher',
    status: 'online',
    expertise: 'Advanced Calculus'
  };

  const handleRaiseHand = () => {
    setIsRaiseHand(!isRaiseHand);
    toast({
      title: isRaiseHand ? "Hand lowered" : "Hand raised",
      description: isRaiseHand ? "Instructor has been notified" : "Waiting for instructor's attention",
      status: "info"
    });
  };

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen sharing stopped" : "Screen sharing started",
      status: "success"
    });
  };

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleCloseAssignment = () => {
    setSelectedAssignment(null);
  };

  const handleRunCode = async (code, language) => {
    setIsExecuting(true);
    try {
      // For demo purposes, we'll just show the code and language
      // In a real app, you'd send this to a code execution service
      setCodeOutput(`Running ${language} code:\n${code}`);
      
      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // // Mock output based on language
      // const outputs = {
      //   javascript: 'console.log("Hello World!") → Hello World!',
      //   python: 'print("Hello World!") → Hello World!',
      //   java: 'System.out.println("Hello World!") → Hello World!',
      //   cpp: 'cout << "Hello World!" → Hello World!',
      //   c: 'printf("Hello World!") → Hello World!'
      // };
      
      setCodeOutput(outputs[language] || 'Code executed successfully!');
    } catch (error) {
      setCodeOutput(`Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitAssignment = async () => {
    setIsSubmitting(true);
    try {
      const submission = {
        assignmentId: selectedAssignment.id,
        studentId: user.id, // Get this from auth context
        studentName: user.name,
        subject: selectedAssignment.subject,
        submittedAt: new Date().toISOString(),
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
          type: selectedAssignment.questions.find(q => q.id.toString() === questionId)?.type
        }))
      };

      const response = await fetch('https://react-5c1b7-default-rtdb.firebaseio.com/Assignment.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission)
      });

      if (!response.ok) throw new Error('Failed to submit assignment');

      toast.success('Assignment submitted successfully!');
      handleCloseAssignment();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit assignment: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navigation
        userName="John Doe"
        userAvatar="https://source.unsplash.com/random/40x40?face"
        role="Student"
      />

      {!showVideoConference ? (
        <div className="container mx-auto py-12 px-4">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Current Live Class
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{scheduledClasses[0].name}</h3>
                    <p className="text-gray-600">with {scheduledClasses[0].instructor}</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Live Now
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-gray-600">
                    <p>Time: {scheduledClasses[0].startTime}</p>
                    <p>Duration: {scheduledClasses[0].duration}</p>
                  </div>
                  <div className="text-gray-600">
                    <p>Topic: {scheduledClasses[0].topic}</p>
                    <p>Room: MAT-101</p>
                  </div>
                </div>
                <button
                  onClick={() => handleJoinClass(scheduledClasses[0])}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Join Class Now
                </button>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-red-500 mr-2">📝</span>
              Today's Assignments
            </h2>
            <AssignmentList 
              assignments={todaysAssignments} 
              onViewAssignment={handleViewAssignment} 
            />
          </div>

          <div className="mb-12">
            <SubmittedAssignments />
          </div>

          {selectedAssignment && (
            <Assignment
              assignment={selectedAssignment}
              onClose={handleCloseAssignment}
            />
          )}

          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-blue-500 mr-2">📅</span>
              Upcoming Classes
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingClasses.map((classInfo) => (
                <div 
                  key={classInfo.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{classInfo.name}</h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center">
                        <span className="mr-2">👨‍🏫</span>
                        {classInfo.instructor}
                      </p>
                      <p className="flex items-center">
                        <span className="mr-2">🕒</span>
                        {classInfo.startTime}
                      </p>
                      <p className="flex items-center">
                        <span className="mr-2">⏱️</span>
                        {classInfo.duration}
                      </p>
                      <p className="flex items-center">
                        <span className="mr-2">📚</span>
                        {classInfo.topic}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100">
          <ClassInfo
            className={scheduledClasses[0].name}
            roomNumber="MAT-101"
            isLive={true}
            currentTopic={scheduledClasses[0].topic}
            duration={scheduledClasses[0].duration}
          />

          <main className="container mx-auto py-6 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Live Session</h2>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowVideoConference(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Leave Class
                      </button>
                      <button
                        onClick={handleRaiseHand}
                        className={`p-2 rounded-full ${
                          isRaiseHand ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                        }`}
                        title="Raise Hand"
                      >
                        <Hand size={20} />
                      </button>
                      <button
                        onClick={handleScreenShare}
                        className={`p-2 rounded-full ${
                          isScreenSharing ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                        }`}
                        title="Share Screen"
                      >
                        <Presentation size={20} />
                      </button>
                      <button
                        className="p-2 rounded-full hover:bg-gray-100"
                        title="Settings"
                      >
                        <Settings size={20} />
                      </button>
                    </div>
                  </div>
                  <VideoConference />
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="border-b border-gray-200">
                    <div className="flex items-center">
                      <button
                        onClick={() => setActiveTab('whiteboard')}
                        className={`px-6 py-3 flex items-center space-x-2 border-b-2 font-medium transition-all duration-200 ${
                          activeTab === 'whiteboard'
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Grid size={18} />
                        <span>Whiteboard</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('chat')}
                        className={`px-6 py-3 flex items-center space-x-2 border-b-2 font-medium transition-all duration-200 ${
                          activeTab === 'chat'
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <MessageSquare size={18} />
                        <span>Chat</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('participants')}
                        className={`px-6 py-3 flex items-center space-x-2 border-b-2 font-medium transition-all duration-200 ${
                          activeTab === 'participants'
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Users size={18} />
                        <span>Participants</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4 h-[500px] overflow-y-auto">
                    {activeTab === 'whiteboard' && <Whiteboard />}
                    {activeTab === 'chat' && <Chat />}
                    {activeTab === 'participants' && (
                      <div className="space-y-4">
                        {/* Add your participants list component here */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <Sidebar 
                  instructor={instructor}
                  currentTime={new Date().toLocaleTimeString()}
                  totalParticipants={24}
                />
              </div>
            </div>
          </main>
        </div>
      )}

      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/video-conference"
              element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
