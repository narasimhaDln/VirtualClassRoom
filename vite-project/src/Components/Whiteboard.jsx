import React, { useRef, useEffect, useState } from 'react';
import { Eraser, Pencil, Undo2, Redo2, Trash2, Square, Circle, Type, Image as ImageIcon, Download, 
  Minus, ArrowRight, Move, ZoomIn, ZoomOut } from 'lucide-react';

export default function Whiteboard() {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [actions, setActions] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [currentAction, setCurrentAction] = useState(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  
  const presetColors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw grid
    const drawGrid = () => {
      const gridSize = 20;
      context.strokeStyle = '#EEEEEE';
      context.lineWidth = 0.5;

      for (let x = 0; x < canvas.width; x += gridSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
      }
    };

    drawGrid();
    redrawCanvas();
  }, [zoom, pan]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    actions.forEach(action => {
      drawAction(context, action);
    });
  };

  const drawAction = (context, action) => {
    context.strokeStyle = action.color || '#000000';
    context.lineWidth = action.size || 2;
    context.lineCap = 'round';

    switch (action.tool) {
      case 'pen':
        if (action.points && action.points.length > 1) {
          context.beginPath();
          context.moveTo(action.points[0].x, action.points[0].y);
          action.points.forEach((point, i) => {
            if (i > 0) {
              context.lineTo(point.x, point.y);
            }
          });
          context.stroke();
        }
        break;
      case 'rectangle':
        if (action.position && action.dimensions) {
          context.strokeRect(
            action.position.x,
            action.position.y,
            action.dimensions.width,
            action.dimensions.height
          );
        }
        break;
      case 'circle':
        if (action.position && action.dimensions) {
          context.beginPath();
          context.ellipse(
            action.position.x + action.dimensions.width / 2,
            action.position.y + action.dimensions.height / 2,
            Math.abs(action.dimensions.width / 2),
            Math.abs(action.dimensions.height / 2),
            0,
            0,
            2 * Math.PI
          );
          context.stroke();
        }
        break;
      case 'text':
        if (action.position && action.text) {
          context.font = '16px Arial';
          context.fillStyle = action.color || '#000000';
          context.fillText(action.text, action.position.x, action.position.y);
        }
        break;
      case 'line':
        if (action.points && action.points.length === 2) {
          context.beginPath();
          context.moveTo(action.points[0].x, action.points[0].y);
          context.lineTo(action.points[1].x, action.points[1].y);
          context.stroke();
        }
        break;
      case 'arrow':
        if (action.points && action.points.length === 2) {
          const angle = Math.atan2(
            action.points[1].y - action.points[0].y,
            action.points[1].x - action.points[0].x
          );
          const headLength = 15;

          context.beginPath();
          context.moveTo(action.points[0].x, action.points[0].y);
          context.lineTo(action.points[1].x, action.points[1].y);
          
          context.lineTo(
            action.points[1].x - headLength * Math.cos(angle - Math.PI / 6),
            action.points[1].y - headLength * Math.sin(angle - Math.PI / 6)
          );
          context.moveTo(action.points[1].x, action.points[1].y);
          context.lineTo(
            action.points[1].x - headLength * Math.cos(angle + Math.PI / 6),
            action.points[1].y - headLength * Math.sin(angle + Math.PI / 6)
          );
          context.stroke();
        }
        break;
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'text') {
      setTextPosition({ x, y });
      setShowTextInput(true);
      return;
    }

    setIsDrawing(true);
    setCurrentAction({
      tool,
      color,
      size,
      points: [{ x, y }],
      position: { x, y },
      dimensions: { width: 0, height: 0 },
    });
  };

  const draw = (e) => {
    if (!isDrawing || !currentAction) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const context = canvas.getContext('2d');
    if (!context) return;

    const newAction = { ...currentAction };

    switch (tool) {
      case 'pen':
        newAction.points = [...(currentAction.points || []), { x, y }];
        break;
      case 'rectangle':
      case 'circle':
        newAction.dimensions = {
          width: x - (currentAction.position?.x || 0),
          height: y - (currentAction.position?.y || 0),
        };
        break;
    }

    setCurrentAction(newAction);
    redrawCanvas();
    drawAction(context, newAction);
  };

  const stopDrawing = () => {
    if (!isDrawing || !currentAction) return;
    setIsDrawing(false);
    setActions([...actions, currentAction]);
    setRedoStack([]);
    setCurrentAction(null);
  };

  const handleUndo = () => {
    if (actions.length === 0) return;
    const newActions = [...actions];
    const undoneAction = newActions.pop();
    if (undoneAction) {
      setActions(newActions);
      setRedoStack([...redoStack, undoneAction]);
      redrawCanvas();
    }
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const newRedoStack = [...redoStack];
    const redoneAction = newRedoStack.pop();
    if (redoneAction) {
      setActions([...actions, redoneAction]);
      setRedoStack(newRedoStack);
      redrawCanvas();
    }
  };

  const handleClear = () => {
    setActions([]);
    setRedoStack([]);
    redrawCanvas();
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) {
      setShowTextInput(false);
      return;
    }

    const newAction = {
      tool: 'text',
      color,
      text: textInput,
      position: textPosition,
    };

    setActions([...actions, newAction]);
    setTextInput('');
    setShowTextInput(false);
    redrawCanvas();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = dataUrl;
    link.click();
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  const ToolButton = ({ tool, icon, tooltip }) => (
    <div className="relative group">
      <button
        onClick={() => setCurrentTool(tool)}
        className={`p-2 rounded ${
          tool === currentTool ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
        }`}
      >
        {icon}
      </button>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {tooltip}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
              <ToolButton tool="pen" icon={<Pencil size={20} />} tooltip="Pen" />
              <ToolButton tool="eraser" icon={<Eraser size={20} />} tooltip="Eraser" />
              <ToolButton tool="line" icon={<Minus size={20} />} tooltip="Line" />
              <ToolButton tool="arrow" icon={<ArrowRight size={20} />} tooltip="Arrow" />
              <ToolButton tool="rectangle" icon={<Square size={20} />} tooltip="Rectangle" />
              <ToolButton tool="circle" icon={<Circle size={20} />} tooltip="Circle" />
              <ToolButton tool="text" icon={<Type size={20} />} tooltip="Text" />
            </div>

            <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <div className="flex space-x-1">
                {presetColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    onClick={() => setColor(presetColor)}
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: presetColor }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="p-1 border rounded"
              >
                <option value="2">Thin</option>
                <option value="4">Medium</option>
                <option value="6">Thick</option>
              </select>
              <div className="w-16 h-8 border rounded bg-white flex items-center justify-center">
                <div
                  className="rounded-full bg-black"
                  style={{ width: size, height: size }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={handleZoomIn} className="p-2 rounded hover:bg-gray-100">
              <ZoomIn size={20} />
            </button>
            <button onClick={handleZoomOut} className="p-2 rounded hover:bg-gray-100">
              <ZoomOut size={20} />
            </button>
            <button onClick={handleUndo} className="p-2 rounded hover:bg-gray-100" disabled={actions.length === 0}>
              <Undo2 size={20} />
            </button>
            <button onClick={handleRedo} className="p-2 rounded hover:bg-gray-100" disabled={redoStack.length === 0}>
              <Redo2 size={20} />
            </button>
            <button onClick={handleDownload} className="p-2 rounded hover:bg-gray-100">
              <Download size={20} />
            </button>
            <button onClick={handleClear} className="p-2 rounded bg-red-500 text-white hover:bg-red-600">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative mt-4 border border-gray-300 rounded overflow-hidden">
        <div
          className="w-full h-[600px] overflow-hidden"
          style={{
            cursor: tool === 'pan' ? 'move' : 'crosshair',
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
        
        {showTextInput && (
          <div
            className="absolute bg-white p-2 rounded shadow-lg"
            style={{ left: textPosition.x, top: textPosition.y }}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
              className="border rounded p-1"
              autoFocus
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setShowTextInput(false)}
                className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleTextSubmit}
                className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}