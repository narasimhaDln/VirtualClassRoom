import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Mic, Video, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function DeviceTest({ onClose, availableDevices, onDeviceSelect }) {
  const [testAudio, setTestAudio] = useState(null);
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const videoRef = useRef(null);
  const audioCtxRef = useRef(null);

  const testSpeaker = async () => {
    try {
      const audio = new Audio('/test-audio.mp3');
      setTestAudio(audio);
      await audio.play();
      toast.success('Playing test audio...');
    } catch (error) {
      toast.error('Failed to test speaker');
    }
  };

  const testMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsTestingMic(true);
      
      audioCtxRef.current = new AudioContext();
      const analyser = audioCtxRef.current.createAnalyser();
      const microphone = audioCtxRef.current.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateMicLevel = () => {
        if (!isTestingMic) return;
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setMicLevel(average / 255);
        requestAnimationFrame(updateMicLevel);
      };
      
      updateMicLevel();
      toast.success('Testing microphone...');
    } catch (error) {
      toast.error('Failed to test microphone');
    }
  };

  const testVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        toast.success('Testing camera...');
      }
    } catch (error) {
      toast.error('Failed to test camera');
    }
  };

  useEffect(() => {
    return () => {
      if (testAudio) testAudio.pause();
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-96 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-lg font-medium">Test Devices</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Speaker Test */}
          <div>
            <label className="text-gray-300 text-sm block mb-2">Speaker</label>
            <div className="flex items-center space-x-4">
              <select className="bg-gray-700 text-white rounded px-3 py-2 flex-1">
                {availableDevices.audiooutput?.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Speaker ${device.deviceId.slice(0, 5)}`}
                  </option>
                ))}
              </select>
              <button
                onClick={testSpeaker}
                className="p-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
              >
                <Volume2 size={20} />
              </button>
            </div>
          </div>

          {/* Microphone Test */}
          <div>
            <label className="text-gray-300 text-sm block mb-2">Microphone</label>
            <div className="flex items-center space-x-4">
              <select className="bg-gray-700 text-white rounded px-3 py-2 flex-1">
                {availableDevices.audioinput?.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
                  </option>
                ))}
              </select>
              <button
                onClick={testMicrophone}
                className="p-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
              >
                <Mic size={20} />
              </button>
            </div>
            {isTestingMic && (
              <div className="mt-2 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-full rounded-full transition-all duration-150"
                  style={{ width: `${micLevel * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Camera Test */}
          <div>
            <label className="text-gray-300 text-sm block mb-2">Camera</label>
            <div className="flex items-center space-x-4 mb-2">
              <select className="bg-gray-700 text-white rounded px-3 py-2 flex-1">
                {availableDevices.videoinput?.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                  </option>
                ))}
              </select>
              <button
                onClick={testVideo}
                className="p-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
              >
                <Video size={20} />
              </button>
            </div>
            <div className="bg-gray-900 rounded aspect-video overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 