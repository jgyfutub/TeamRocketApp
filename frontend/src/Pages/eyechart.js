// EyeTest.js
import React, { useState } from 'react';
import './eyechart.css';

const EyeTest = () => {
  const [ticks, setTicks] = useState(new Array(11).fill(false));
  const [result, setResult] = useState('');

  const handleTick = (index) => {
     
    const updatedTicks = new Array(11).fill(false).map((_, i) => i <= index);
    setTicks(updatedTicks);
  }

  const handleSubmit = () => {
     
    const lastTickedIndex = ticks.lastIndexOf(true);
    if (lastTickedIndex !== -1) {
      setResult(rows[lastTickedIndex].snellen);
    } else {
      setResult('No rows selected.');
    }
  }

  const rows = [
     { text: 'E', size: '144px', snellen: '20/200' },
    { text: 'FP', size: '120px', snellen: '20/100' },
    { text: 'TOZ', size: '96px', snellen: '20/70' },
    { text: 'LPED', size: '76px', snellen: '20/50' },
    { text: 'PECFD', size: '60px', snellen: '20/40' },
    { text: 'EDFCZP', size: '48px', snellen: '20/30' },
    { text: 'FELOPZD', size: '36px', snellen: '20/25' },
    { text: 'DEFPOTEC', size: '32px', snellen: '20/20' },
    { text: 'LEFODPCT', size: '28px', snellen: '20/15' },
    { text: 'FDPLTCEO', size: '24px', snellen: '20/10' },
    { text: 'PEZOLCFTD', size: '20px', snellen: '20/5' },
  ]

  return (
    <div className="eye-test-container">
      {rows.map((row, index) => (
        <div key={index} className="eye-test-row">
          <span className="letters" style={{ fontSize: row.size }}>{row.text}</span>
          <input
            type="checkbox"
            className="eye-test-checkbox"
            checked={ticks[index]}
            onChange={() => handleTick(index)}
          />
        </div>
      ))}
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
      {result && <div className="result-display">Vision clarity: {result}</div>}
    </div>
  )
}

export default EyeTest;
