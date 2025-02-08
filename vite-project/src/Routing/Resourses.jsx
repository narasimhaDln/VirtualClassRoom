import React from 'react';
import { Book, FileText, Video, Download, ExternalLink,ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function Resources() {
  const navigate=useNavigate()
  const resources = [
    {
      type: 'Course Material',
      items: [
        {
          title: 'JavaScript Fundamentals PDF',
          icon: <FileText className="w-5 h-5" />,
          size: '2.4 MB',
          format: 'PDF',
          downloadUrl: 'https://www.tutorialspoint.com/javascript/javascript_tutorial.pdf'
        },
        {
          title: 'React.js Course Notes',
          icon: <Book className="w-5 h-5" />,
          size: '1.8 MB',
          format: 'PDF',
          downloadUrl: 'https://reactjs.org/docs/getting-started.html'
        },
        {
          title: 'Data Structures Handbook',
          icon: <FileText className="w-5 h-5" />,
          size: '3.2 MB',
          format: 'PDF',
          downloadUrl: 'https://www.javatpoint.com/data-structure-tutorial'
        }
      ]
    },
    {
      type: 'Video Lectures',
      items: [
        {
          title: 'Introduction to JavaScript',
          icon: <Video className="w-5 h-5" />,
          duration: '45 mins',
          format: 'MP4',
          link: 'https://youtu.be/iLWTnMzWtj4?si=6ioDsWGx8j5nnhJ4'
        },
        {
          title: 'React Hooks Deep Dive',
          icon: <Video className="w-5 h-5" />,
          duration: '60 mins',
          format: 'MP4',
          link: 'https://youtu.be/HnXPKtro4SM?si=KKgzRZ9yl2KIwtL7'
        }
      ]
    },
    {
      type: 'Additional Resources',
      items: [
        {
          title: 'MDN Web Docs',
          icon: <ExternalLink className="w-5 h-5" />,
          link: 'https://developer.mozilla.org/en-US/'
        },
        {
          title: 'React Documentation',
          icon: <ExternalLink className="w-5 h-5" />,
          link: 'https://react.dev/learn'
        }
      ]
    }
  ];

  const handleDownload = (downloadUrl) => {
    // In a real app, implement actual file download
  window.open(downloadUrl, '_blank', 'noopener noreferrer');
  };

  const handleVisit = (link) => {
    window.open(link, '_blank', 'noopener noreferrer');
  };
  const handleJoinClass = () => {
    navigate('/video-conference');
  };


  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-100 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      <button
              onClick={handleJoinClass}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Class</span>
            </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Learning Resources</h1>
        
        <div className="grid gap-8">
          {resources.map((section, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/20">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 border-b">
                <h2 className="text-xl font-semibold text-white">{section.type}</h2>
              </div>
              
              <div className="divide-y divide-gray-200/70">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-gray-500">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">
                          {item.size && `Size: ${item.size}`}
                          {item.duration && `Duration: ${item.duration}`}
                          {item.format && ` • Format: ${item.format}`}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => item.link ? handleVisit(item.link) : handleDownload(item.downloadUrl)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {item.link ? (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          <span>Visit</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}