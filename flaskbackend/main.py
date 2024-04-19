import base64
from flask import Flask,request,jsonify
import requests
import tensorflow as tf
import tensorflow_hub as tfhub
import time
from keras.models import load_model
from collections import Counter
import numpy as np
from flask_cors import CORS
import os
from PIL import Image

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/upload_video', methods=['POST'])
def upload_video():
    video_file = request.files['video']
    print(video_file)
    blob_data = video_file.read()
    byte_array = bytearray(blob_data)
    with open("video.mpg", 'wb') as f:
        f.write(byte_array)
    return jsonify({"message":"done"})

@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    audio = request.files['audio']
    blob_data = audio.read()
    byte_array = bytearray(blob_data)
    with open("audio.wav", 'wb') as f:
        f.write(byte_array)
    return jsonify({"message":"done"})

@app.route('/upload_image', methods=['POST'])
def image_upload():
    image=request.files['image']
    image=Image.open(image)
    image.save("image.png")
    return jsonify({"message":"done"})

if __name__ == '__main__':
    app.run(debug=True,port=5000)
