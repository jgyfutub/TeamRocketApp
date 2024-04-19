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

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/upload_video', methods=['POST'])
def upload_video():
    pass

@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    pass

@app.route('/upload_image', methods=['POST'])
def image_upload():
    pass

if __name__ == '__main__':
    app.run(debug=True,port=5000)
