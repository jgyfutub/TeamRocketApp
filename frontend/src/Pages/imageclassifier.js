import React, { useEffect, useState, useRef, useCallback  } from 'react'
import axios from 'axios'
import Webcam from "react-webcam";

export default function ImageToText(){
    const [image,setimage]=useState(null)
    const [sentence,setSentence]=useState('')
  const [imgSrc, setImgSrc] = useState(null);
  const WebcamCapture=()=>{
    const [img, setImg] = useState(null);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 420,
    height: 420,
    facingMode: "user",
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
  }, [webcamRef]);
  const SentCaputuredtoFlask=async()=>{
    const formdata=new FormData()
    formdata.append('image',img )
    const result=await axios.post('http://127.0.0.1:5000/upload_captured_image',formdata)
    setSentence(result.data.result)
    
  }


  return (
    <div className="Container">
      {img === null ? (
        <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',columnGap:50}}>
          <Webcam
            audio={false}
            mirrored={true}
            height={400}
            width={400}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
          />
          <button onClick={capture} style={{width:150,height:50,marginTop:'10%'}}>Capture photo</button>
        </div>
      ) : (
        <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',columnGap:50}}>
          <img src={img} alt="screenshot" />
          <button onClick={SentCaputuredtoFlask} style={{width:150,height:50,marginTop:'10%'}}>Upload to model</button>
        </div>
      )}
    </div>
  )
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
        setimage(event.target.files[0])
      }
    const handleUpload=async(event)=>{
        const formdata=new FormData()
        formdata.append('image',image)
        const result=await axios.post('http://127.0.0.1:5000/upload_image',formdata)
        setSentence(result.data.result)
    }
    return (<div>
    <WebcamCapture/>
    <img src={imgSrc}/>
    <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center'}}>
                <input type="file" onChange={handleFileChange} style={{width:200,marginRight:50}} />
                <button onClick={handleUpload}>Upload an image File</button>
    </div>
    <p>{sentence}</p>
            {sentence!=""?(
                <TextToSpeech text={sentence}/>
            ):(<div></div>)}
    </div>)
}