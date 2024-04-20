import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Webcam from "react-webcam";

export default function ImageToText() {
  const [image, setImage] = useState(null);
  const [sentence, setSentence] = useState('');
  const [imgSrc, setImgSrc] = useState(null);

  const WebcamCapture = () => {
    const webcamRef = useRef(null);
    const [img, setImg] = useState(null);

    const videoConstraints = {
      width: 420,
      height: 420,
      facingMode: "user",
    };

    const capture = useCallback(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImg(imageSrc);
    }, [webcamRef]);

    const SentCaptureToFlask = async () => {
      const formData = new FormData();
      formData.append('image', img);
      const result = await axios.post('http://127.0.0.1:5000/upload_captured_image', formData);
      setSentence(result.data.result);
    };

    return (
      <div className="Container" aria-label="Webcam capture section">
        {img === null ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 50 }}>
            <Webcam
              audio={false}
              mirrored={true}
              height={400}
              width={400}
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={videoConstraints}
              aria-label="Webcam view"
            />
            <button onClick={capture} style={{ width: 150, height: 50, marginTop: '10%' }} aria-label="Capture photo">
              Capture photo
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 50 }}>
            <img src={img} alt="Captured screenshot" aria-label="Captured screenshot" />
            <button onClick={SentCaptureToFlask} style={{ width: 150, height: 50, marginTop: '10%' }} aria-label="Upload captured image to model">
              Upload to model
            </button>
          </div>
        )}
      </div>
    );
  };
  const TextToSpeech = ({ text }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);
  
    useEffect(() => {
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(text);
  
      setUtterance(u);
  
      return () => {
        synth.cancel();
      }
    }, [text]);
  
    const handlePlay = () => {
      const synth = window.speechSynthesis;
  
      if (isPaused) {
        synth.resume();
      }
  
      synth.speak(utterance);
  
      setIsPaused(false);
    }
  
    const handlePause = () => {
      const synth = window.speechSynthesis;
  
      synth.pause();
  
      setIsPaused(true);
    }
  
    // const handleStop = () => {
    //   const synth = window.speechSynthesis;
  
    //   synth.cancel();
  
    //   setIsPaused(false);
    // };
  
    return (
      <div style={{display:'flex',justifyContent:'space-evenly',flexWrap:'wrap'}}>
        <button onClick={handlePlay}>{isPaused ? "Resume" : "Play"}</button>
        {/* <button onClick={handlePause}>Pause</button> */}
      </div>
    )
  }

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    const formData = new FormData();
    formData.append('image', image);
    const result = await axios.post('http://127.0.0.1:5000/upload_image', formData);
    setSentence(result.data.result);
  };

  return (
    <div aria-label="Main interface for image-to-text conversion">
      <WebcamCapture />

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input type="file" onChange={handleFileChange} style={{ width: 200, marginRight: 50 }} aria-describedby="file-desc" />
        <button onClick={handleUpload} aria-label="Upload an image file">Upload an image File</button>
      </div>
      <p aria-live="polite">{sentence}</p>
      {sentence && <TextToSpeech text={sentence} />}
    </div>
  );
}