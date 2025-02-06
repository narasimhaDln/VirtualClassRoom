import React, { useRef, useState } from "react";
import { getFirestore, collection, addDoc, getDoc, updateDoc, doc } from "firebase/firestore";
import { app } from "../firebase"; // Firebase config import karo

const db = getFirestore(app);

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [callId, setCallId] = useState("");

  const startCall = async () => {
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const callDoc = await addDoc(collection(db, "calls"), { offer });
    setCallId(callDoc.id);
    console.log("Call ID:", callDoc.id);

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };
  };

  const answerCall = async () => {
    const callDoc = doc(db, "calls", callId);
    const callData = (await getDoc(callDoc)).data();
    if (!callData) return;

    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    await pc.setRemoteDescription(callData.offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await updateDoc(callDoc, { answer });

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };
  };

  return (
    <div className="container">
      <h2>Video Call</h2>
      <div className="video-container">
        <video ref={localVideoRef} autoPlay muted />
        <video ref={remoteVideoRef} autoPlay />
      </div>
      <button onClick={startCall}>Start Call</button>
      <input value={callId} onChange={(e) => setCallId(e.target.value)} placeholder="Enter Call ID" />
      <button onClick={answerCall}>Join Call</button>
    </div>
  );
};

export default VideoCall;
