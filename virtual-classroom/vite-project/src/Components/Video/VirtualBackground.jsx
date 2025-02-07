import React, { useState, useRef, useEffect } from 'react';
import { Image, X, Upload, Camera, Loader, Settings, Sliders } from 'lucide-react';
import { toast } from 'react-hot-toast';

const backgrounds = [
  { id: 'none', name: 'None', url: null },
  { id: 'blur', name: 'Blur', url: 'blur' },
  { id: 'office', name: 'Office', url: '/backgrounds/office.jpg' },
  { id: 'beach', name: 'Beach', url: '/backgrounds/beach.jpg' },
  { id: 'library', name: 'Library', url: '/backgrounds/library.jpg' },
  { id: 'gradient1', name: 'Gradient Blue', url: 'gradient-blue' },
  { id: 'gradient2', name: 'Gradient Green', url: 'gradient-green' }
];

export function VirtualBackground({ onClose, onSelect, currentBackground }) {
  const [customBg, setCustomBg] = useState(null);
  const [recentBackgrounds, setRecentBackgrounds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [settings, setSettings] = useState({
    blurAmount: 8,
    edgeDetection: 0.5,
    smoothing: 0.5,
    quality: 'balanced'
  });
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);

  // Load recent backgrounds from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentBackgrounds');
    if (saved) {
      setRecentBackgrounds(JSON.parse(saved));
    }
  }, []);

  const handleCustomUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsProcessing(true);
      // Simulate image processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const url = URL.createObjectURL(file);
      setCustomBg(url);
      
      // Add to recent backgrounds
      const newRecent = [{ id: `custom-${Date.now()}`, name: 'Custom', url }]
        .concat(recentBackgrounds)
        .slice(0, 5);
      
      setRecentBackgrounds(newRecent);
      localStorage.setItem('recentBackgrounds', JSON.stringify(newRecent));
      
      onSelect(url);
      toast.success('Background applied successfully');
    } catch (error) {
      toast.error('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const captureWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      webcamRef.current.srcObject = stream;
      
      // Wait for video to load
      await new Promise(resolve => {
        webcamRef.current.onloadedmetadata = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = webcamRef.current.videoWidth;
      canvas.height = webcamRef.current.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(webcamRef.current, 0, 0);
      
      const url = canvas.toDataURL('image/jpeg');
      setCustomBg(url);
      onSelect(url);
      
      // Stop webcam
      stream.getTracks().forEach(track => track.stop());
      
      toast.success('Webcam snapshot applied as background');
    } catch (error) {
      toast.error('Failed to capture webcam image');
    }
  };

  const applyBackground = (bg) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      onSelect(bg.url);
      setIsProcessing(false);
      toast.success(`${bg.name} background applied`);
    }, 500);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-96 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium">Virtual Background</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            <Settings size={20} />
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg space-y-3">
          <div>
            <label className="text-gray-300 text-sm block mb-1">Blur Amount</label>
            <input
              type="range"
              min="1"
              max="20"
              value={settings.blurAmount}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                blurAmount: parseInt(e.target.value)
              }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm block mb-1">Edge Detection</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.edgeDetection}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                edgeDetection: parseFloat(e.target.value)
              }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm block mb-1">Quality</label>
            <select
              value={settings.quality}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                quality: e.target.value
              }))}
              className="w-full bg-gray-600 text-white rounded px-2 py-1"
            >
              <option value="performance">Performance</option>
              <option value="balanced">Balanced</option>
              <option value="quality">Quality</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {backgrounds.map(bg => (
          <button
            key={bg.id}
            onClick={() => applyBackground(bg)}
            className={`aspect-video rounded-lg overflow-hidden relative ${
              currentBackground === bg.url ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {bg.url === 'blur' ? (
              <div className="w-full h-full bg-gray-600 backdrop-blur" />
            ) : bg.url?.startsWith('gradient') ? (
              <div 
                className="w-full h-full" 
                style={{
                  background: bg.url === 'gradient-blue' 
                    ? 'linear-gradient(45deg, #2563eb, #3b82f6)'
                    : 'linear-gradient(45deg, #059669, #10b981)'
                }}
              />
            ) : bg.url ? (
              <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-700" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-white text-sm font-medium">{bg.name}</span>
            </div>
          </button>
        ))}

        {/* Recent Backgrounds */}
        {recentBackgrounds.map(bg => (
          <button
            key={bg.id}
            onClick={() => applyBackground(bg)}
            className={`aspect-video rounded-lg overflow-hidden relative ${
              currentBackground === bg.url ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-white text-sm font-medium">{bg.name}</span>
            </div>
          </button>
        ))}

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
          disabled={isProcessing}
        >
          <div className="text-center">
            {isProcessing ? (
              <Loader className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" />
            ) : (
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            )}
            <span className="text-gray-400 text-sm">Upload</span>
          </div>
        </button>

        {/* Webcam Capture Button */}
        <button
          onClick={captureWebcam}
          className="aspect-video rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
        >
          <div className="text-center">
            <Camera className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <span className="text-gray-400 text-sm">Capture</span>
          </div>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleCustomUpload}
      />

      <video
        ref={webcamRef}
        className="hidden"
        autoPlay
        playsInline
      />

      {isProcessing && (
        <div className="mt-4 text-center text-gray-400 text-sm">
          Processing background...
        </div>
      )}
    </div>
  );
} 