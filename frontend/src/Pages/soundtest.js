import React, { useState ,useEffect} from 'react';
import ReactHowler from 'react-howler';
import { useNavigate } from 'react-router-dom';

function AudioPlayer() {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(true);
  const [volume,setVolume] = useState(1.0)
  const [reaction,setReaction] = useState('yes')

  const handlePlayPause = () => {
    setPlaying(!playing);
  }
  const changeVolume=()=>{
    setVolume(volume-0.2)
  }
  const changeReaction=()=>{
    setReaction('no')
  }

if (volume>0.1){

    if (reaction==='yes'){
  return (
    <div style={{justifyContent:'center'}}>
      <ReactHowler
        src="http://goldfirestudios.com/proj/howlerjs/sound.ogg"
        playing={playing}
        volume={volume}
      />
      <button onClick={handlePlayPause}>
        {playing ? 'Pause' : 'Play'}
      </button>
      <p>Are you able to hear voice</p>
      <p>Volume {volume.toFixed(1)}</p>
      <div style={{display:'flex',justifyContent:'center'}}>
      <div style={{display:'flex',columnGap:20,flexWrap:'wrap'}} >
        <button onClick={changeVolume}>yes</button>
        <button onClick={changeReaction}>no</button>
      </div>
      </div>
    </div>
  );}else{
    return (
    <div>
    <h2>You might have a deaf problem please contact a</h2>
    <button onClick={ () => { navigate("/")}}>Home</button>
    </div>
    )
  }
}
  else{
    return(
        <div>
        <h2>You are absolutely fine!!</h2>
        <button onClick={ () => { navigate("/")}}>Home</button>
        </div>
    )
  }
}

export default AudioPlayer;