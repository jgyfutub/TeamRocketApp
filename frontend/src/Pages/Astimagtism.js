import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import eye from './eyes.png';
import pattern from './pattern.png';

export default function Astigmatism() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    const [isVisible2, setIsVisible2] = useState(false);
    const [isVisible3, setIsVisible3] = useState(false);
    const [isVisible4, setIsVisible4] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [test1, setTest1] = useState(false);
    const [test2, setTest2] = useState(false);
    const [result, setResult] = useState("");

    const toggleVisibility1 = () => {
        setIsVisible(!isVisible);
        setIsVisible2(!isVisible2);
    };

    const toggleVisibility2 = (e) => {
        setIsVisible2(!isVisible2);
        setIsVisible3(!isVisible3);
        setTest1(e.target.value === 'yes');
    };

    const toggleVisibility3 = () => {
        setIsVisible3(!isVisible3);
        setIsVisible4(!isVisible4);
    };

    const toggleVisibility4 = (e) => {
        setIsVisible4(!isVisible4);
        setShowResult(!showResult);
        setTest2(e.target.value === 'yes');

        if (test1 && test2) {
            setResult('You have low chances of astigmatism');
        } else if (test1 !== test2) {
            setResult('You have medium chances of astigmatism');
        } else {
            setResult('You have high chances of astigmatism');
        }
    };

    return (
        <div>
            {isVisible && (
                <div className='card1' aria-expanded={isVisible} aria-labelledby="eyeTestLabel1" aria-describedby="eyeTestDesc1">
                    <img src={eye} alt="Eye examination illustration" />
                    <p>Keep both eyes open and cover the <strong>left</strong> eye.</p>
                    <p>Focus on the center of the semicircle.</p>
                    <p>Do all the lines appear in the same shade of black, or do you see that some</p>
                    <button onClick={toggleVisibility1}>Next</button>
                </div>
            )}
            {isVisible2 && (
                <div className='test1' aria-expanded={isVisible2} aria-labelledby="patternTestLabel1" aria-describedby="patternTestDesc1">
                    <img src={pattern} alt="Pattern test image"/>
                    <p>Do all the lines appear in the same shade of black?</p>
                    <div style={{ display: 'flex', justifyContent: 'center', columnGap: 40 }}>
                        <button onClick={toggleVisibility2} value='yes'>Yes</button>
                        <button onClick={toggleVisibility2} value='no'>No</button>
                    </div>
                </div>
            )}
            {isVisible3 && (
                <div className='card1' aria-expanded={isVisible3} aria-labelledby="eyeTestLabel2" aria-describedby="eyeTestDesc2">
                    <img src={eye} alt="Eye examination illustration"/>
                    <p>Keep both eyes open and cover the <strong>right</strong> eye.</p>
                    <p>Focus on the center of the semicircle.</p>
                    <p>Do all the lines appear in the same shade of black, or do you see that some</p>
                    <button onClick={toggleVisibility3}>Next</button>
                </div>
            )}
            {isVisible4 && (
                <div className='test1' aria-expanded={isVisible4} aria-labelledby="patternTestLabel2" aria-describedby="patternTestDesc2">
                    <img src={pattern} alt="Pattern test image"/>
                    <p>Do all the lines appear in the same shade of black?</p>
                    <div style={{ display: 'flex', justifyContent: 'center', columnGap: 40 }}>
                        <button onClick={toggleVisibility4} value='yes'>Yes</button>
                        <button onClick={toggleVisibility4} value='no'>No</button>
                    </div>
                </div>
            )}
            {showResult && (
                <div className='result' aria-live="polite" aria-labelledby="resultLabel" aria-describedby="resultDesc">
                    <p>The result is:</p><br/>
                    <h3>{result}</h3>
                    <button onClick={() => navigate("/")} aria-label="Return to Home Page">Return to Home</button>
                </div>
            )}
        </div>
    );
}
