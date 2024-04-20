import React, { useEffect, useState, useRef  } from 'react';
import axios from 'axios';

export default function Mainpage(){
    const mimeType='video/webm'

    const [permission, setPermission]=useState(false)
    const media=useRef(null)
    const Feed=useRef(null)
    const [recording, setRecording]=useState("inactive")
    const [stream, setStream]=useState(null)
    const [video, setVideo]=useState([])
    const [recorded, setRecorded]=useState(null)
    const [file, setFile]=useState(null)
    const [Blob, setBlob]=useState(null)
    const [sentence,setSentence]=useState('')

    const handleFileChange=(e)=>{
        const file=e.target.files[0]
        setFile(file)
      }

      const handleUpload =()=>{
        if (file) {
        const reader=new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload=async (e)=>{
        const arrayBuffer=e.target.result
        console.log(file.type)
        const blob=new Blob([arrayBuffer], { type: 'video/mpeg' })
        const formData=new FormData()
        formData.append('video',blob)
        const result=await axios.post('http://127.0.0.1:5000/upload_video', formData)
        setSentence(result.data.result)
    }
        } else {
          alert("Select a file first")
        }
      }
    
      const TextToSpeech = ({ text }) => {
        const [isPaused, setIsPaused] = useState(false);
        const [utterance, setUtterance] = useState(null);
      
        useEffect(() => {
          const synth = window.speechSynthesis;
          const u = new SpeechSynthesisUtterance(text);
      
          setUtterance(u);
      
          return () => {
            synth.cancel();
          };
        }, [text]);
      
        const handlePlay = () => {
          const synth = window.speechSynthesis;
      
          if (isPaused) {
            synth.resume();
          }
      
          synth.speak(utterance);
      
          setIsPaused(false);
        };
      
        const handlePause = () => {
          const synth = window.speechSynthesis;
      
          synth.pause();
      
          setIsPaused(true);
        };
      
        const handleStop = () => {
          const synth = window.speechSynthesis;
      
          synth.cancel();
      
          setIsPaused(false);
        };
      
        return (
          <div>
            <button onClick={handlePlay}>{isPaused ? "Resume" : "Play"}</button>
            <button onClick={handlePause}>Pause</button>
            <button onClick={handleStop}>Stop</button>
          </div>
        );
      };
      
    
      
          const getCameraPermission = async () => {
              setVideo(null);
              if ("MediaRecorder" in window) {
                  try {
                      const videoConstraints = {
                          audio: false,
                          video: true,
                      };
                      const audioConstraints = { audio: true };
                      const audioStream = await navigator.mediaDevices.getUserMedia(
                          audioConstraints
                      );
                      const videoStream = await navigator.mediaDevices.getUserMedia(
                          videoConstraints
                      );
                      setPermission(true);
                      const combinedStream = new MediaStream([
                          ...videoStream.getVideoTracks(),
                          ...audioStream.getAudioTracks(),
                      ]);
                      setStream(combinedStream);
                      Feed.current.srcObject = videoStream;
                  } catch (err) {
                      alert(err.message);
                  }
              } else {
                  alert("The MediaRecorder API is not supported in your browser.");
              }
          };
      
          const startRecording = async () => {
              setRecording("recording");
              const media = new MediaRecorder(stream, { mimeType });
              media.current = media;
              media.current.start();
              let localVideoChunks = [];
              media.current.ondataavailable = (event) => {
                  if (typeof event.data === "undefined") return;
                  if (event.data.size === 0) return;
                  localVideoChunks.push(event.data);
              };
              setVideo(localVideoChunks);
          };
      
          const stopRecording =  () => {
              setPermission(false);
              setRecording("inactive");
              media.current.stop();
              media.current.onstop = async () => {
                  const videoBlob = new Blob(video, { type: 'video/mpeg'});
                  const formData = new FormData();
                  formData.append('video',videoBlob);        
                  const result = await axios.post('http://127.0.0.1:5000/upload_video', formData)
                  setVideo([]);
              };
          };
    return (
        <div>
        <h2>Video Recorder</h2>
			<main>
				<div className="video-controls">
					{!permission ? (
						<button onClick={getCameraPermission} type="button">
							Get Camera
						</button>
					) : null}
					{permission && recording === "inactive" ? (
						<button onClick={startRecording} type="button">
							Start Recording
						</button>
					) : null}
					{recording === "recording" ? (
						<button onClick={stopRecording} type="button">
							Stop Recording
						</button>
					) : null}
				</div>
			</main>

			<div className="video-player">
				{!recorded ? (
					<video ref={Feed} autoPlay className="live-player"></video>
				) : null}
			</div>
            <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload an MPG file</button>
            </div>
            <p>{sentence}</p>
            {sentence!=""?(
                <TextToSpeech text={sentence}/>
            ):(<div></div>)}
        </div>
    )
}