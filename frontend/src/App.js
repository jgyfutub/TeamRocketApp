import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mainpage from './Pages/main';
import Home from './Pages/Home';
import SoundClassifier from './Pages/soundclassifer';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/lipreading' element={<Mainpage/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/sounddetector' element={<SoundClassifier/>}/>
      </Routes>
    </div>
  </Router>
  );
}

export default App;
