import { useState, useCallback } from 'react';

export const useMediaStream = () => {
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [availableDevices, setAvailableDevices] = useState({});

  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });
      
      setLocalStream(stream);
      await updateAvailableDevices();
      return stream;
    } catch (error) {
      console.error('Error getting media devices:', error);
      throw error;
    }
  }, []);

  const updateAvailableDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const grouped = devices.reduce((acc, device) => {
      if (!acc[device.kind]) acc[device.kind] = [];
      acc[device.kind].push(device);
      return acc;
    }, {});
    setAvailableDevices(grouped);
  };

  const switchCamera = async (deviceId) => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } }
      });
      
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
          localStream.removeTrack(videoTrack);
          videoTrack.stop();
        }
        localStream.addTrack(newStream.getVideoTracks()[0]);
      }
    } catch (error) {
      console.error('Failed to switch camera:', error);
      throw error;
    }
  };

  const switchMicrophone = async (deviceId) => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } }
      });
      
      if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
          localStream.removeTrack(audioTrack);
          audioTrack.stop();
        }
        localStream.addTrack(newStream.getAudioTracks()[0]);
      }
    } catch (error) {
      console.error('Failed to switch microphone:', error);
      throw error;
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      setScreenStream(stream);
      return stream;
    } catch (error) {
      console.error('Screen sharing failed:', error);
      throw error;
    }
  };

  const stopScreenShare = async () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
  };

  return {
    localStream,
    screenStream,
    availableDevices,
    initializeMedia,
    switchCamera,
    switchMicrophone,
    startScreenShare,
    stopScreenShare
  };
};
