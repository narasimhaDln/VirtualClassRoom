import React from 'react';
import { Book, Clock, Users, Star, ChevronRight,ChevronLeft  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Courses() {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      instructor: 'Wes Bos',
      duration: '8 weeks',
      students: 234,
      level: 'Beginner',
      rating: 4.8,
      image: 'https://cdn.pixabay.com/photo/2015/04/23/17/41/javascript-736400_1280.png',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 2,
      title: 'React.js Advanced Concepts',
      instructor: 'Narayana ',
      duration: '10 weeks',
      students: 189,
      level: 'Advanced',
      rating: 4.9,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      id: 3,
      title: 'Data Structures & Algorithms',
      instructor: 'Dr. Emily White',
      duration: '12 weeks',
      students: 156,
      level: 'Intermediate',
      rating: 4.7,
      image: 'https://cdn1.iconfinder.com/data/icons/artificial-intelligence-1-2/128/Bynary-Tree-Hierarchy-Data-Structure-Nodes-512.png',
      color: 'from-purple-400 to-indigo-500'
    },
    {
      id:4,
      title:'Apptitude',
      instructor:'Hemanth',
      duration:'15 weeks',
      level: 'Beginner',
      rating:4.5,
      image:'https://tse4.mm.bing.net/th?id=OIP.aZUiGsMM9XK1FejVfoLYOgHaFo&pid=Api&P=0&h=180',
      color:'from-red-400 to-orange-500'

    },
    {
      id:5,
      title:'Standup',
      instructor:'D.Naveen',
      duration:'18weeks',
      level: 'Beginner',
      rating:4.5,
      image:'https://tse4.mm.bing.net/th?id=OIP.wi_p1Ek3M1KINKl5CqZMrQAAAA&pid=Api&P=0&h=180',
      color:'from-teal-400 to-orange-500'
    }
  ];


  const handleJoinCourse = () => {
    navigate('/video-conference');
  };

  const handleJoinClass = () => {
    navigate('/video-conference');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

      <button
              onClick={handleJoinClass}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Class</span>
            </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Courses</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20 hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className={`h-48 bg-gradient-to-r ${course.color} p-6 flex items-center justify-center`}>
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="h-32 w-32 object-contain filter drop-shadow-lg"
                />
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                
                <div className="flex items-center text-gray-600 space-x-4">
                  <div className="flex items-center space-x-1">
                    <Book className="w-4 h-4" />
                    <span className="text-sm">{course.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{course.students} students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">{course.rating}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleJoinCourse}
                    className={`w-full py-2 px-4 rounded-lg bg-blue-500 ${course.color} text-white font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity`}
                  >
                    <span>Join Class</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

