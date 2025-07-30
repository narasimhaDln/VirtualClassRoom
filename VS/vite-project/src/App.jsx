import React, { useContext } from 'react'
import "./App.css"
import va from "./assets/ai.png"
import { CiMicrophoneOn } from "react-icons/ci";
import { dataContext } from "./context/UserContext"
import speakingImg from "./assets/speak.gif";
import aiGif from "./assets/aiVoice.gif"
function App() {
  let {recognition,speaking,setSpeaking ,prompt,response,setPrompt,setResponse} = useContext(dataContext)

  return (
    <div className='main'>
    <img src={va} alt='' id='shifra' />
    <span>I'm Lexa ,Your Advance Virtual Assistance</span>
      {!speaking ? <button onClick={() => {
        setPrompt("Listening....")
        setSpeaking(true)
        setResponse(false);
        recognition.start()
      }}>Click here<CiMicrophoneOn />
      </button>
        :
        <div className='response'>
          {!response?  <img src={speakingImg} alt='' id='speak' />:  <img src={aiGif} alt='' id='aiGif' />}
        
          <p>{prompt}</p>
          
      </div>
}
    </div>
  )
}

export default App