import React from "react"
import { useNavigate } from "react-router-dom"
import './Home.css'
import backgroundImage from './bg.png'

export default function Home() {
    const navigate = useNavigate();

    const backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100%',
        marginTop: -70,
        paddingTop: 50
    };

     
    const handleNavigate = (path, description) => {
        navigate(path);
        alert(`Navigating to ${description}`);  
    }

    return (
        <div style={backgroundStyle}>
            <h1 style={{ color: 'black' ,fontSize: 60,fontWeight:'bold' }}>Empower all : Accessibility <span style={{ color: 'white'}}>and</span> Tools</h1>
            <h1 style={{ color: 'black' , fontWeight: 800}}>Tools</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'grid', marginInline: 'auto' }}>
                    <button onClick={() => handleNavigate("/lipreading", "Lip Reading Page")}
                            aria-label="Navigate to the Lip Reading page">Lip reading</button>
                    <button onClick={() => handleNavigate("/sounddetector", "Sound Prediction Page")}
                            aria-label="Navigate to the Prediction of Sound page">Sound prediction</button>
                    <button onClick={() => handleNavigate("/imagetotext", "Image to Text Conversion Page")}
                            aria-label="Navigate to the Image to Text page">Image to text</button>
                </div>
            </div>
            <h1 style={{ color: 'black', fontWeight: 800 }}>Tests</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'grid', marginInline: 'auto' }}>
                    <button onClick={() => handleNavigate("/astimagtism", "Astigmatism Test Page")}
                            aria-label="Navigate to the Astigmatism Test page">Astigmatism test</button>
                    <button className="button" onClick={() => handleNavigate("/eyechart", "Eye Chart Test Page")}
                            aria-label="Navigate to the Eye Chart Test page">Eye Chart Test</button>
                    <button onClick={() => handleNavigate("/soundtest", "Sound Test Page")}
                            aria-label="Navigate to the Sound Test page">Hearing test</button>
                </div>
            </div>
        </div>
    )
}
