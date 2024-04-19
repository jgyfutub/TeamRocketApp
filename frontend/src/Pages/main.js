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
        // setSentence(result.data.result)
    }
        } else {
          alert("Select a file first")
        }
      }
    

    return (
        <div>
        <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload an MPG file</button>
        </div>
        </div>
    )
}