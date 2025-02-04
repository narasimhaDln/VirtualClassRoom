"use client";

import { useRef, useEffect, useState } from "react";
import { Pencil, Eraser, Trash2, RotateCcw, RotateCw, Image as ImageIcon, Type, Save, Plus } from "lucide-react";

// Constants for tools
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

  // Notes functionality
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      setCtx(context);
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      saveState(); // Save initial state
    }
  }, []);

  // Save canvas state to history
  const saveState = () => {
    if (canvasRef.current) {
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
  const startDrawing = (e) => {
    if (tool === TOOLS.PENCIL) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    } else if (tool === TOOLS.TEXT) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      saveState(); // Save state after adding text
    }
  };

  // Draw or erase
  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    if (tool === TOOLS.PENCIL) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.stroke();
    } else if (tool === TOOLS.ERASER) {
      ctx.clearRect(e.nativeEvent.offsetX - 10, e.nativeEvent.offsetY - 10, 20, 20);
    }
  };

  // Stop drawing
  const stopDrawing = () => {
    if (ctx && tool === TOOLS.PENCIL) {
      ctx.closePath();
      setIsDrawing(false);
      saveState(); // Save state after drawing
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      saveState(); // Save state after clearing
    }
  };

  // Insert image
  const insertImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 50, 50, 200, 200); // Adjust position and size as needed
          saveState(); // Save state after inserting image
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Save canvas as image
  const saveCanvas = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL(); // Get image data URL from canvas
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "whiteboard.png"; // Set the filename for download
      a.click(); // Trigger the download
    }
  };

  // Add a new note
  const addNewNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote]);
      setNewNote(""); // Clear input after adding
    }
  };

  // Delete a note
  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 p-6">
      {/* Header */}
      <div className="text-center mb-4 text-xl font-bold text-gray-700">
        <h1>Virtual Whiteboard</h1>
        <p className="text-sm text-gray-600">Create, Draw, and Collaborate on your Ideas!</p>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 p-4 flex justify-between items-center shadow-[5px_5px_0_#000] border-2 border-black">
        <div className="flex space-x-4">
          {/* Drawing Tools */}
          <div className="flex space-x-2">
            <button
              className={`p-2 border-2 shadow-[3px_3px_0_#000] transition ${tool === TOOLS.PENCIL ? "bg-blue-500 text-white" : "bg-gray-50"}`}
              onClick={() => setTool(TOOLS.PENCIL)}
              title="Draw with Pencil"
            >
              <Pencil size={20} />
            </button>
            <button
              className={`p-2 border-2 shadow-[3px_3px_0_#000] transition ${tool === TOOLS.ERASER ? "bg-red-500 text-white" : "bg-gray-50"}`}
              onClick={() => setTool(TOOLS.ERASER)}
              title="Erase drawings"
            >
              <Eraser size={20} />
            </button>
            <button
              className={`p-2 border-2 shadow-[3px_3px_0_#000] transition ${tool === TOOLS.TEXT ? "bg-green-500 text-white" : "bg-gray-50"}`}
              onClick={() => setTool(TOOLS.TEXT)}
              title="Add Text"
            >
              <Type size={20} />
            </button>
          </div>

          {/* Color and Line Width */}
          <div className="flex space-x-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 border-2 shadow-[3px_3px_0_#000] cursor-pointer"
              title="Pick a color"
            />
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="w-32 cursor-pointer"
              title="Adjust Line Width"
            />
          </div>

          {/* Text Options */}
          {tool === TOOLS.TEXT && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your text here"
                className="p-2 border-2 shadow-[3px_3px_0_#000] bg-gray-50"
              />
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="p-2 border-2 shadow-[3px_3px_0_#000] bg-gray-50"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
              </select>
              <input
                type="range"
                min="10"
                max="50"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-32 cursor-pointer"
                title="Adjust Font Size"
              />
            </div>
          )}

          {/* Image Upload */}
          <label className="p-2 border-2 shadow-[3px_3px_0_#000] bg-gray-50 transition hover:bg-gray-200 cursor-pointer" title="Insert Image">
            <ImageIcon size={20} />
            <input type="file" accept="image/*" onChange={insertImage} className="hidden" />
          </label>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            className="p-2 border-2 shadow-[3px_3px_0_#000] bg-gray-50 transition hover:bg-gray-200"
            onClick={undo}
            title="Undo your last action"
          >
            <RotateCcw size={20} />
          </button>
          <button
            className="p-2 border-2 shadow-[3px_3px_0_#000] bg-gray-50 transition hover:bg-gray-200"
            onClick={redo}
            title="Redo your last action"
          >
            <RotateCw size={20} />
          </button>
          <button
            className="p-2 border-2 shadow-[3px_3px_0_#000] bg-red-500 text-white transition hover:bg-red-600"
            onClick={clearCanvas}
            title="Clear the whiteboard"
          >
            <Trash2 size={20} />
          </button>
          <button
            className="p-2 border-2 shadow-[3px_3px_0_#000] bg-gray-50 transition hover:bg-gray-200"
            onClick={saveCanvas}
            title="Save your artwork"
          >
            <Save size={20} />
          </button>
        </div>
      </div>

      {/* Canvas and Notes Section */}
      <div className="flex flex-grow mt-4 space-x-4">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-3/4 bg-white border-2 shadow-[5px_5px_0_#000]"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />

        {/* Notes Section */}
        <div className="w-1/4 bg-gray-50 p-4 border-2 shadow-[5px_5px_0_#000]">
          <h2 className="text-lg font-semibold mb-4">Notes</h2>
          <div className="space-y-2">
            {/* Add Note Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="flex-grow p-2 border-2 shadow-[3px_3px_0_#000] bg-gray-50"
              />
              <button
                onClick={addNewNote}
                className="p-2 bg-blue-500 text-white shadow-[3px_3px_0_#000] transition hover:bg-blue-600"
                title="Add a new note"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Display Notes */}
            {notes.map((note, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border-2 shadow-[3px_3px_0_#000]"
              >
                <span>{note}</span>
                <button
                  onClick={() => deleteNote(index)}
                  className="text-red-500 hover:text-red-600"
                  title="Delete this note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
