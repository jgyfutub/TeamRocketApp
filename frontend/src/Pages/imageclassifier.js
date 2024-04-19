import { useState } from "react"

export default function ImageToText(){
    const [image,setimage]=useState(null)

    const handleFileChange = (event) => {
        setimage(event.target.files[0]);
      };
    const handleUpload=async(event)=>{
        const formdata=new FormData()
        formdata.append('image',image)
        const senddata=await axios.post('http://127.0.0.1:5000/upload_image',formdata)
    }
    return (<div>
    <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload an image File</button>
    </div>
    </div>)
}