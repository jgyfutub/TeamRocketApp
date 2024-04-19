import React, { useEffect, useState, useRef  } from 'react'
import axios from 'axios'

export default function SoundClassifier(){
    const [File, setFile]=useState(null)
    const [permission, setPermission]=useState(false)
    const media=useRef(null)
	const [Status, setStatus]=useState("inactive")
	const [stream, setStream]=useState(null)
	const [Chunks, setAudioChunks]=useState([])
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

    return (
        <div>
        <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload an WAV file</button>
        </div>
        </div>
    )
}