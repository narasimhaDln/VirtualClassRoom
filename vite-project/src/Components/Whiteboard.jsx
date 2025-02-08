import { useRef, useEffect, useState } from "react";

const TOOLS = {
  PENCIL: "pencil",
  ERASER: "eraser",
  TEXT: "text",
};

export default function WhiteboardDashboard() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState(TOOLS.PENCIL);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotes, setShowNotes] = useState(true);

  // Initialize canvas with responsive dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      setCtx(context);
      
      const resizeCanvas = () => {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        // Restore previous drawing after resize
        if (history.length > 0 && historyIndex >= 0) {
          context.putImageData(history[historyIndex], 0, 0);
        }
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      saveState();

      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, []);

  // Save canvas state to history
  const saveState = () => {
    if (canvasRef.current && ctx) {
      requestAnimationFrame(() => {
        const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(imageData);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      });
    }
  };

  // Undo functionality
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      ctx.putImageData(prevState, 0, 0);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Redo functionality
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      ctx.putImageData(nextState, 0, 0);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Start drawing or adding text
  const startDrawing = ({ nativeEvent }) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = nativeEvent.type.includes('touch') 
      ? nativeEvent.touches[0].clientX - rect.left 
      : nativeEvent.offsetX;
    const y = nativeEvent.type.includes('touch') 
      ? nativeEvent.touches[0].clientY - rect.top 
      : nativeEvent.offsetY;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    if (tool === TOOLS.ERASER) {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = lineWidth * 2;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
    
    setIsDrawing(true);
  };

  // Draw or erase
  const draw = ({ nativeEvent }) => {
    if (!isDrawing || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = nativeEvent.type.includes('touch') 
      ? nativeEvent.touches[0].clientX - rect.left 
      : nativeEvent.offsetX;
    const y = nativeEvent.type.includes('touch') 
      ? nativeEvent.touches[0].clientY - rect.top 
      : nativeEvent.offsetY;

    if (tool === TOOLS.ERASER) {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = lineWidth * 2;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Stop drawing
  const stopDrawing = () => {
    if (ctx && tool === TOOLS.PENCIL) {
      ctx.closePath();
      setIsDrawing(false);
      saveState();
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      saveState();
    }
  };

  // Save canvas as image
  const saveCanvas = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "whiteboard.png";
      a.click();
    }
  };

  // Add a new note
  const addNewNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote]);
      setNewNote("");
    }
  };

  // Delete a note
  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-2 sm:p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-2 md:mb-4">
        <h1 className="text-lg md:text-xl font-bold text-gray-700">Virtual Whiteboard</h1>
        <p className="text-xs md:text-sm text-gray-600">Create, Draw, and Collaborate on your Ideas!</p>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 bg-gray-50 border rounded-lg mb-2"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        ☰ Menu
      </button>

      {/* Toolbar */}
      <div className={`bg-gray-50 p-2 md:p-4 flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg border-2 border-gray-300 rounded-lg ${showMobileMenu ? 'block' : 'hidden md:flex'}`}>
        {/* Drawing Tools */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="flex space-x-1 md:space-x-2">
            <button
              className={`p-1 md:p-2 border-2 shadow-sm transition ${tool === TOOLS.PENCIL ? "bg-blue-500 text-white" : "bg-gray-50"}`}
              onClick={() => setTool(TOOLS.PENCIL)}
            >
              ✏️
            </button>
            <button
              className={`p-1 md:p-2 border-2 shadow-sm transition ${tool === TOOLS.ERASER ? "bg-red-500 text-white" : "bg-gray-50"}`}
              onClick={() => setTool(TOOLS.ERASER)}
            >
              🧹
            </button>
            <button
              className={`p-1 md:p-2 border-2 shadow-sm transition ${tool === TOOLS.TEXT ? "bg-green-500 text-white" : "bg-gray-50"}`}
              onClick={() => setTool(TOOLS.TEXT)}
            >
              📝
            </button>
          </div>

          <div className="flex space-x-2 items-center">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 md:w-10 md:h-10 border-2 shadow-sm cursor-pointer"
            />
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="w-24 md:w-32 cursor-pointer"
            />
          </div>
        </div>

        {/* Text Options - Only show when text tool is selected */}
        {tool === TOOLS.TEXT && (
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0 w-full md:w-auto">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type text..."
              className="p-1 md:p-2 border-2 shadow-sm bg-gray-50 w-full md:w-auto"
            />
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="p-1 md:p-2 border-2 shadow-sm bg-gray-50"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <button className="p-1 md:p-2 border-2 shadow-sm bg-gray-50" onClick={undo}>
            ↩️
          </button>
          <button className="p-1 md:p-2 border-2 shadow-sm bg-gray-50" onClick={redo}>
            ↪️
          </button>
          <button className="p-1 md:p-2 border-2 shadow-sm bg-red-500 text-white" onClick={clearCanvas}>
            🗑️
          </button>
          <button className="p-1 md:p-2 border-2 shadow-sm bg-gray-50" onClick={saveCanvas}>
            💾
          </button>
        </div>
      </div>

      {/* Canvas and Notes Container */}
      <div className="flex flex-col lg:flex-row mt-2 md:mt-4 gap-2 md:gap-4 flex-grow">
        {/* Canvas Container */}
        <div className="w-full lg:w-3/4 h-[60vh] md:h-[70vh] lg:h-auto">
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-white border-2 shadow-lg rounded-lg"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {/* Notes Section - Toggleable on mobile */}
        <div className="w-full lg:w-1/4">
          <button 
            className="w-full p-2 bg-gray-200 rounded-lg mb-2 lg:hidden"
            onClick={() => setShowNotes(!showNotes)}
          >
            {showNotes ? 'Hide Notes' : 'Show Notes'}
          </button>
          
          <div className={`bg-gray-50 p-2 md:p-4 border-2 shadow-lg rounded-lg ${showNotes ? 'block' : 'hidden lg:block'}`}>
            <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">Notes</h2>
            <div className="space-y-2 w-1/2 ">
              <div className="flex space-x-2 w-1/2 " >
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="p-1 md:p-2 border-2 shadow-sm bg-gray-50"


                />
                <button
                  onClick={addNewNote}
                  className="p-1 md:p-2  bg-blue-500 text-white shadow-sm "
                >
                  ➕
                </button>
              </div>

              <div className="max-h-[30vh] lg:max-h-[50vh] flex-grow overflow-y-auto">
                {notes.map((note, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 border-2 shadow-sm mt-2"
                  >
                    <span className="text-sm md:text-base">{note}</span>
                    <button
                      onClick={() => deleteNote(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}