import React, { useEffect, useState, useRef  } from 'react'
import axios from 'axios'
import './soundclassifier.css'

export default function SoundClassifier(){
    const [File, setFile]=useState(null)
    const [permission, setPermission]=useState(false)
    const media=useRef(null)
	const [Status, setStatus]=useState("inactive")
	const [stream, setStream]=useState(null)
	const [Chunks, setChunks]=useState([])
	const [audio, setAudio]=useState(null)
	const [result,setresult]=useState([])
    const mimeType ="audio/wav"

    const handleFileChange=(e) => {
        setFile(e.target.files[0])
      }
    
    const handleUpload=async(e)=>{
        if (File.type=="audio/wav") {
            const reader=new FileReader()
            reader.readAsArrayBuffer(File)
            reader.onload=async (e) => {
                const arrayBuffer=e.target.result
                const blob=new Blob([arrayBuffer], { type: File.type})
				console.log(File.type)
                const formData=new FormData()
                formData.append('audio',blob)
                const result=await axios.post('http://127.0.0.1:5000/upload_audio', formData)
				console.log(result.data.result)
				result.data.result.forEach(item => {
					setresult(result => [...result, item])})
            }
        } else {
          alert("Select a file first or use .wav format files")
        }
    }

    const getMicrophonePermission=async () => {
		if ("MediaRecorder" in window) {
			try {
				const mediaStream=await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: false,
				});
				setPermission(true);
				setStream(mediaStream);
			} catch (err) {
				alert(err.message);
			}
		} else {
			alert("The MediaRecorder API not supported in your browser.");
		}
	};

	const startRecording=async () => {
		setStatus("recording");
		const media=new MediaRecorder(stream, { type: mimeType });
		media.current=media;
		media.current.start();
		let localAudioChunks=[];
		media.current.ondataavailable=(event) => {
			if (typeof event.data === "undefined") return;
			if (event.data.size === 0) return;
			localAudioChunks.push(event.data);
		};
		setChunks(localAudioChunks);
	};

	const stopRecording=() => {
		setStatus("inactive");
		media.current.stop();
		media.current.onstop=async () => {
			const audioBlob=new Blob(Chunks, { type: mimeType });
			const audioUrl=URL.createObjectURL(audioBlob);
			const formData=new FormData();
            formData.append('audio',audioBlob);
			formData.append('url',audioUrl)
			setAudio(audioUrl);
            const result=await axios.post('http://127.0.0.1:5000/upload_audio', formData)
			setChunks([]);
		};
	};


    return (
        <div>
        <h2>Audio Recorder</h2>
				<div className="audio-controls">
					{!permission ? (
						<button onClick={getMicrophonePermission} type="button">
							Get Microphone
						</button>
					) : null}
					{permission && Status === "inactive" ? (
						<button onClick={startRecording} type="button">
							Start Recording
						</button>
					) : null}
					{Status === "recording" ? (
						<button onClick={stopRecording} type="button">
							Stop Recording
						</button>
					) : null}
				</div>
        <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload an WAV file</button>
        </div>
        {
					result.length!=0?(
						<div>
						<p>The main sound is : {result[0]}</p>
						<br/>
						<p>the other possibilities are: </p>
						<ul>
					{result.slice(1).map((item, index) => (
					<li key={index}>{item}</li>
					))}
				</ul>
	   </div>
					):<div></div> } 
        </div>
    )
}