import React from "react";
import { useNavigate } from "react-router-dom";
export default function Home(){
    const navigate = useNavigate();
    return(
        <div >
            <h1 style={{marginBottom:'50px'}}>Welcome to Home page</h1>
            <h1>Tools</h1>
            <div style={{display:'flex',justifyContent:'center'}}>
            <div style={{display:'grid',marginInline:'auto'}}>
            <button onClick={ () => { navigate("/lipreading")}}>Lip reading</button>
            <button onClick={ () => { navigate("/sounddetector")}}>Predicition of sound</button>
            <button onClick={ () => { navigate("/imagetotext")}}>Image to text</button>
            </div>
            </div>
            <h1>Tests</h1>
            <div style={{display:'flex',justifyContent:'center'}}>
            <div style={{display:'grid',marginInline:'auto'}}>
            <button onClick={ () => { navigate("/astimagtism")}}>Astimagtism</button>
            </div>
           </div>
        </div>
    )
}