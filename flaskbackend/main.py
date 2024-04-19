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
from scipy.io import wavfile
from PIL import Image
import csv
import scipy


app = Flask(__name__)
CORS(app, supports_credentials=True)


def class_names_from_csv(class_map_csv_text):
  class_names = []
  with tf.io.gfile.GFile(class_map_csv_text) as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
      class_names.append(row['display_name'])

  return class_names

def ensure_sample_rate(original_sample_rate, waveform,
                       desired_sample_rate=16000):
  if original_sample_rate != desired_sample_rate:
    desired_length = int(round(float(len(waveform)) /
                               original_sample_rate * desired_sample_rate))
    waveform = scipy.signal.resample(waveform, desired_length)
  return desired_sample_rate, waveform


soundmodel = tfhub.load('https://www.kaggle.com/models/google/yamnet/TensorFlow2/yamnet/1')

class_map_path = soundmodel.class_map_path().numpy()
class_names = class_names_from_csv(class_map_path)


@app.route('/upload_video', methods=['POST'])
def upload_video():
    video_file = request.files['video']
    print(video_file)
    blob_data = video_file.read()
    byte_array = bytearray(blob_data)
    with open("./files/video.mpg", 'wb') as f:
        f.write(byte_array)
    return jsonify({"message":"done"})

@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    audio = request.files['audio']
    blob_data = audio.read()
    byte_array = bytearray(blob_data)
    with open("./files/audio.wav", 'wb') as f:
        f.write(byte_array)
    sample_rate,wav_data = wavfile.read("./files/audio.wav")
    if np.ndim(np.array(wav_data))==2:
       wav_data=[int(sum(i)/len(i)) for i in wav_data]
    sample_rate, wav_data = ensure_sample_rate(sample_rate, wav_data)
    waveform = wav_data / tf.int16.max
    scores, _,_ =soundmodel(waveform)
    scores_np = scores.numpy()
    infered_class = class_names[scores_np.mean(axis=0).argmax()]
    print(infered_class)
    mean_scores = np.mean(scores, axis=0)
    top_n = 10
    top_class_indices = np.argsort(mean_scores)[::-1][:top_n]
    arr=[class_names[top_class_indices[x]] for x in range(0, top_n, 1)]
    return jsonify({"message":"done","result":arr})

@app.route('/upload_image', methods=['POST'])
def image_upload():
    image=request.files['image']
    image=Image.open(image)
    image.save("./files/image.png")
    return jsonify({"message":"done"})

if __name__ == '__main__':
    app.run(debug=True,port=5000)
