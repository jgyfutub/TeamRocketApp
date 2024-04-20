import React, { useEffect, useState, useRef  } from 'react'
import axios from 'axios'
import Webcam from "react-webcam";

export default function ImageToText(){
    const [image,setimage]=useState(null)
    const [imgSrc, setImgSrc] = useState(null)
    const [sentence,setSentence]=useState('')
    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
      };
    //   useEffect(()=>{
    //     console.log(imgSrc)
    //   },[imgSrc])
    //   const WebcamCapture = () => (
    //     <Webcam
    //       audio={false}
    //       height={720}
    //       screenshotFormat="image/jpeg"
    //       width={1280}
    //       videoConstraints={videoConstraints}
    //     >
    //       {({ getScreenshot }) => (
    //         <button
    //           onClick={() => {
    //             const imageSrc = getScreenshot()
    //             setImgSrc(imgSrc)
    //           }}
    //         >
    //           Capture photo
    //         </button>
    //       )}
    //     </Webcam>
    //   );

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

    const handleFileChange = (event) => {
        setimage(event.target.files[0])
      };
    const handleUpload=async(event)=>{
        const formdata=new FormData()
        formdata.append('image',image)
        const result=await axios.post('http://127.0.0.1:5000/upload_image',formdata)
        setSentence(result.data.result)
    }
    return (<div>
    {/* <WebcamCapture/> */}
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