import React, { useState, useRef, useEffect } from 'react';
import { 
  Pencil, Square, Circle, Type, Eraser, 
  Trash2, Download, X, MousePointer 
} from 'lucide-react';

export function ScreenShare({ stream, onClose }) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pointer');
  const [color, setColor] = useState('#FF0000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  const tools = [
    { id: 'pointer', icon: MousePointer, name: 'Pointer' },
    { id: 'pen', icon: Pencil, name: 'Pen' },
    { id: 'rectangle', icon: Square, name: 'Rectangle' },
    { id: 'circle', icon: Circle, name: 'Circle' },
    { id: 'text', icon: Type, name: 'Text' },
    { id: 'eraser', icon: Eraser, name: 'Eraser' }
  ];

  const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear and resize canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw existing annotations
    annotations.forEach(annotation => drawAnnotation(ctx, annotation));
  }, [annotations]);

  const startDrawing = (e) => {
    if (tool === 'pointer') return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    setCurrentPath([{ x: offsetX, y: offsetY }]);
  };

  const draw = (e) => {
    if (!isDrawing || tool === 'pointer') return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    setCurrentPath(prev => [...prev, { x: offsetX, y: offsetY }]);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    currentPath.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    setAnnotations(prev => [...prev, {
      tool,
      color,
      path: currentPath
    }]);
    setCurrentPath([]);
  };

  const drawAnnotation = (ctx, annotation) => {
    ctx.strokeStyle = annotation.color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    annotation.path.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
  };

  const clearAnnotations = () => {
    setAnnotations([]);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveAnnotations = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'annotations.png';
    link.href = image;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-4 w-full max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            {tools.map(t => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`p-2 rounded ${
                  tool === t.id ? 'bg-blue-500' : 'bg-gray-700'
                } hover:bg-opacity-80`}
                title={t.name}
              >
                <t.icon className="w-5 h-5 text-white" />
              </button>
            ))}
            <div className="w-px h-6 bg-gray-700" />
            <div className="flex items-center space-x-1">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded ${
                    color === c ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearAnnotations}
              className="p-2 rounded bg-gray-700 hover:bg-gray-600"
              title="Clear All"
            >
              <Trash2 className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={saveAnnotations}
              className="p-2 rounded bg-gray-700 hover:bg-gray-600"
              title="Save"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded bg-gray-700 hover:bg-gray-600"
              title="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="relative bg-black rounded-lg overflow-hidden">
          {stream && (
            <video
              autoPlay
              playsInline
              className="w-full h-full"
              srcObject={stream}
            />
          )}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
} 