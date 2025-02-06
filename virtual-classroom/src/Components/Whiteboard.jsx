import { useRef, useEffect, useState } from 'react';
import { Eraser, Pencil, Undo2, Redo2, Trash2, Square, Circle, Type, Image as ImageIcon, Download } from 'lucide-react';

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Redraw all actions
    redrawCanvas();
  }, []);

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

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded ${
                tool === 'pen' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`}
            >
              <Pencil size={20} />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded ${
                tool === 'eraser' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`}
            >
              <Eraser size={20} />
            </button>
            <button
              onClick={() => setTool('rectangle')}
              className={`p-2 rounded ${
                tool === 'rectangle' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`}
            >
              <Square size={20} />
            </button>
            <button
              onClick={() => setTool('circle')}
              className={`p-2 rounded ${
                tool === 'circle' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`}
            >
              <Circle size={20} />
            </button>
            <button
              onClick={() => setTool('text')}
              className={`p-2 rounded ${
                tool === 'text' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`}
            >
              <Type size={20} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="p-1 border rounded"
            >
              <option value="2">Thin</option>
              <option value="4">Medium</option>
              <option value="6">Thick</option>
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleUndo}
            className="p-2 rounded hover:bg-gray-100"
            disabled={actions.length === 0}
          >
            <Undo2 size={20} />
          </button>
          <button
            onClick={handleRedo}
            className="p-2 rounded hover:bg-gray-100"
            disabled={redoStack.length === 0}
          >
            <Redo2 size={20} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Download size={20} />
          </button>
          <button
            onClick={handleClear}
            className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] border border-gray-300 rounded"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

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