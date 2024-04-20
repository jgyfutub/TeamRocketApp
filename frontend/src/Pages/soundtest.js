import React, { useState } from 'react';
import ReactHowler from 'react-howler';
import { useNavigate } from 'react-router-dom';

function AudioPlayer() {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(1.0);
  const [reaction, setReaction] = useState('yes');

  const handlePlayPause = () => {
    setPlaying(!playing);
    alert(`Playback ${playing ? 'paused' : 'resumed'}.`);  // Providing feedback on play/pause
  }

  const changeVolume = () => {
    setVolume(volume - 0.2);
    alert(`Volume decreased to ${volume.toFixed(1)}.`);  // Providing feedback on volume change
  }

  const changeReaction = () => {
    setReaction('no');
    alert('No, unable to hear the sound.');  // Providing feedback on reaction change
  }

  if (volume > 0.1) {
    if (reaction === 'yes') {
      return (
        <div style={{ justifyContent: 'center' }}>
          <ReactHowler
            src="http://goldfirestudios.com/proj/howlerjs/sound.ogg"
            playing={playing}
            volume={volume}
          />
          <button onClick={handlePlayPause} aria-label={playing ? 'Pause Audio' : 'Play Audio'}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <p>Are you able to hear voice</p>
          <p>Volume {volume.toFixed(1)}</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', columnGap: 20, flexWrap: 'wrap' }}>
              <button onClick={changeVolume} aria-label="Decrease Volume">Yes</button>
              <button onClick={changeReaction} aria-label="Cannot Hear Sound">No</button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h2>You might have a hearing problem please contact a</h2>
          <button onClick={() => { navigate("/") }} aria-label="Go to Home Page">Home</button>
        </div>
      );
    }
  } else {
    return (
      <div>
        <h2>You are absolutely fine!!</h2>
        <button onClick={() => { navigate("/") }} aria-label="Go to Home Page">Home</button>
      </div>
    );
  }
}

export default AudioPlayer;
