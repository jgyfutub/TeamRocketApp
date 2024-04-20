import React, { useState, useRef } from 'react';
import axios from 'axios';
import './soundclassifier.css';

export default function SoundClassifier() {
    const [file, setFile] = useState(null);
    const [permission, setPermission] = useState(false);
    const media = useRef(null);
    const [status, setStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [result, setResult] = useState([]);
    const mimeType = "audio/wav";

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        alert('File selected for upload.'); // Audible feedback when file is selected
    };

    const handleUpload = async (e) => {
        if (file && file.type === "audio/wav") {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async (e) => {
                const arrayBuffer = e.target.result;
                const blob = new Blob([arrayBuffer], { type: file.type });
                const formData = new FormData();
                formData.append('audio', blob);
                const result = await axios.post('http://127.0.0.1:5000/upload_audio', formData);
                setResult(result.data.result);
                alert('Audio file uploaded and processed.'); // Feedback when file is uploaded and processed
            };
        } else {
            alert("Please select a .wav format file for upload.");
        }
    };

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(mediaStream);
                alert('Microphone access granted.'); // Feedback when microphone access is granted
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const startRecording = async () => {
        setStatus("recording");
        const mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });
        media.current = mediaRecorder;
        mediaRecorder.start();
        let localAudioChunks = [];
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                localAudioChunks.push(event.data);
            }
        };
        setChunks(localAudioChunks);
        alert('Recording started.'); // Feedback when recording starts
    };

    const stopRecording = () => {
        setStatus("inactive");
        media.current.stop();
        media.current.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: mimeType });
            const audioUrl = URL.createObjectURL(audioBlob);
            const formData = new FormData();
            formData.append('audio', audioBlob);
            const result = await axios.post('http://127.0.0.1:5000/upload_audio', formData);
            setResult(result.data.result);
            setChunks([]);
            alert('Recording stopped and data sent.'); // Feedback when recording stops
        };
    };

    return (
        <div>
            <h2>Audio Recorder</h2>
            <div className="audio-controls">
                {!permission && (
                    <button onClick={getMicrophonePermission} type="button" aria-label="Get Microphone access">
                        Get Microphone
                    </button>
                )}
                {permission && status === "inactive" && (
                    <button onClick={startRecording} type="button" aria-label="Start recording">
                        Start Recording
                    </button>
                )}
                {status === "recording" && (
                    <button onClick={stopRecording} type="button" aria-label="Stop recording">
                        Stop Recording
                    </button>
                )}
            </div>
            <div>
                <input type="file" onChange={handleFileChange} style={{ width: 200, marginRight: 50 }} aria-label="Select an audio file" />
                <button onClick={handleUpload} aria-label="Upload an WAV file">Upload an WAV file</button>
            </div>
            {result.length !== 0 && (
                <div aria-live="polite">
                    <p>The main sound is: {result[0]}</p>
                    <p>The other possibilities are:</p>
                    <ul style={{ display: 'grid', justifyContent: 'center' }}>
                        {result.slice(1).map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
