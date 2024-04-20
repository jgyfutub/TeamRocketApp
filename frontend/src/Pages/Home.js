import React from "react";
import { useNavigate } from "react-router-dom";
import './Home.css'
import backgroundImage from './bg.png'; 

export default function Home(){
    const navigate = useNavigate();

    const backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',  
        width: '100%'  
    };

    return(
        <div style={backgroundStyle}>
            <h1 style={{marginBottom:'50px'}}>We love you...</h1>
            <h1>Tools</h1>
            <div style={{display:'flex',justifyContent:'center'}}>
                <div style={{display:'grid',marginInline:'auto'}}>
                    <button onClick={ () => { navigate("/lipreading")}}>Lip reading</button>
                    <button onClick={ () => { navigate("/sounddetector")}}>Prediction of sound</button>
                    <button onClick={ () => { navigate("/imagetotext")}}>Image to text</button>
                </div>
            </div>
            <h1>Tests</h1>
            <div style={{display:'flex',justifyContent:'center'}}>
                <div style={{display:'grid',marginInline:'auto'}}>
                    <button onClick={ () => { navigate("/astigmatism")}}>Astigmatism</button>
                    <button className="button" onClick={() => navigate("/eyechart")}>Eye Chart Test</button>
                </div>
            </div>
        </div>
    );
}
