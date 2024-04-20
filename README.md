## Overview

This is a web app made for disabled people who have problem in hearing, seeing and talking. It takes input in different format and provides the desired output for user who later can use it to analyze and "see" things in his own way.The features of this app are:
- It can take audio file in its input and provide details about the audio, particulary made keeoing in mind the needs of deaf people
- It can take image file as an input, it may be captured then and there, or it may be an input from a device, the output is an audio file which tells us what is going in the image, vividly, made with keeping in minds blind people.
- The webapp can take take a video file as input and recognize the lip movement and make words out of it, making it enable to mute people to convey their messages or words.
- The webapp also provides some tests by which we can detect a particular type of disabiltiy, like astigmatism detection test.

## Tech Stack

- Tensorflow
- 

## Installation Guide 

- First git clone the project using the command ` git clone https://github.com/jgyfutub/TeamRocketApp.git `
- Open the cloned folder on Visual Studio Code.

## For Flask

- Open Command prompt of your system
- ensure that virtual enviroment and python is installed in system
- write ` python -m venv venv ` to enter a virtual enviroment
- write ` venv\Scripts\activate ` to activate it
- now cd to pybackend to access flask file
- install dependencies ` pip install flask tensorflow tensorflow-hub transformers opencv-python `
- now write  python main.py ` to start server at http://localhost:8000/ `

## For react

- open terminal in VS code and go into frontend folder if you are not there
- write ` npm i ` for all frontend modules to be downloaded
- write ` npm start ` to start the frontend server



