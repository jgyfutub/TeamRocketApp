import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mainpage from './Pages/main';
import Home from './Pages/Home';
import SoundClassifier from './Pages/soundclassifier';
import ImageToText from './Pages/imageclassifier';
import Astimagtism from './Pages/Astimagtism';
import EyeTest from './Pages/eyechart';
import AudioPlayer from './Pages/soundtest';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/lipreading' element={<Mainpage/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/sounddetector' element={<SoundClassifier/>}/>
        <Route path='/imagetotext' element={<ImageToText/>}/>
        <Route path='/astimagtism' element={<Astimagtism/>}/>
        <Route path='/eyechart' element={<EyeTest/>}/>
        <Route path='/soundtest' element={<AudioPlayer/>}/>
        {/* <Route exact path="/terminos" render={() => {window.location.href="index.html"}} /> */}
      </Routes>
    </div>
  </Router>
  );
}

export default App;
