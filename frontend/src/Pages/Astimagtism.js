import React, { useEffect, useState, useRef, useCallback  } from 'react'

import eye from './eyes.png'
import { useNavigate } from "react-router-dom";
import pattern from './pattern.png'

export default function Astimagtism(){
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true)
    const [isVisible2, setIsVisible2] = useState(false)
    const [isVisible3, setIsVisible3] = useState(false)
    const [isVisible4, setIsVisible4] = useState(false)
    const [showresult, setshowresult] = useState(false)
    const [test1 , settest1] = useState(false)
    const [test2 , settest2] = useState(false)
    const [result,setresult] = useState(false)
    const toggleVisibility1=(e)=>{
        setIsVisible(!isVisible);
        setIsVisible2(!isVisible2);
    }

    const toggleVisibility2=(e)=>{
        setIsVisible2(!isVisible2);
        setIsVisible3(!isVisible3);
        if (e.target.value==='yes'){
            settest1(true)
        }
    }

    const toggleVisibility3=(e)=>{
        setIsVisible3(!isVisible3);
        setIsVisible4(!isVisible4);
    }
    const toggleVisibility4=(e)=>{
        setIsVisible4(!isVisible4);
        setshowresult(!showresult)
        if (e.target.value==='yes'){
            settest2(true)
        }
        console.log(test1,test2)
        if (test2 && test1){
            setresult('You have low chances of astimagitsm')
        }
        else if (test2 && !test1 || !test2 && test1){
            setresult('You have medium chances of astimagitsm')
        }
        else{
            setresult('You have high chances of astimagtism')
        }

    }
    return(<div>
        {isVisible && <div className='card1'>
            
            <img src={eye}/>
            <p>Keep both eyes open and cover the <bold>left</bold> eye.</p>
            <p>Focus on the center of the semicircle.</p>
            <p>Do all the lines appear in the same shade of black,</p>
            <p>or do you see that some</p>
            <button onClick={toggleVisibility1}>Next</button>
        </div> }
        {isVisible2 && <div className='test1'>
        <img src={pattern}/>
        <p>Do all the lines appear in the same shade of black?</p>
        <div style={{display:'flex',justifyContent:'center',columnGap:40}}>
            <button onClick={toggleVisibility2} value='yes'>yes </button >
            <button  onClick={toggleVisibility2} value='no'>no </button >
        </div>
        </div>}
        {isVisible3 && <div className='card1'>
        <img src={eye}/>
        <p>Keep both eyes open and cover the <bold>right</bold> eye.</p>
        <p>Focus on the center of the semicircle.</p>
        <p>Do all the lines appear in the same shade of black, </p>
        <p>or do you see that some</p>
        <button onClick={toggleVisibility3}>next</button>
        </div>}
        {isVisible4 && <div className='test1'>
            <img src={pattern}/>
        <p>Do all the lines appear in the same shade of black?</p>
        <div style={{display:'flex',justifyContent:'center',columnGap:40}}>
            <button  onClick={toggleVisibility4} value='yes'>yes </button >
            <button  onClick={toggleVisibility4} value='no'>no </button >
        </div>
        </div>}
        {showresult && <div className='result'>
        <p>The result is</p><br/>
        <h3>{result}</h3>
        <button onClick={ () => { navigate("/")}}>Return to  Home</button>
        </div>}

    </div>)
}