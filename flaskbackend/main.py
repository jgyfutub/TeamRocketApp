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
import io
import cv2
import time
from transformers import pipeline
import random
import wave
import soundfile as sf

def generate_random_string():
    random_string = ''.join(random.choices('0123456789', k=10))
    return random_string

app=Flask(__name__)
CORS(app, supports_credentials=True)
image_to_text=pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")



def class_names_from_csv(class_map_csv_text):
  class_names=[]
  with tf.io.gfile.GFile(class_map_csv_text) as csvfile:
    reader=csv.DictReader(csvfile)
    for row in reader:
      class_names.append(row['display_name'])

  return class_names

def ensure_sample_rate(original_sample_rate, waveform,
                       desired_sample_rate=16000):
  if original_sample_rate != desired_sample_rate:
    desired_length=int(round(float(len(waveform)) /
                               original_sample_rate * desired_sample_rate))
    waveform=scipy.signal.resample(waveform, desired_length)
  return desired_sample_rate, waveform


soundmodel=tfhub.load('https://www.kaggle.com/models/google/yamnet/TensorFlow2/yamnet/1')

class_map_path=soundmodel.class_map_path().numpy()
class_names=class_names_from_csv(class_map_path)

def loadvideo(path):
  cap=cv2.VideoCapture(path)
  frames=[]
  for _ in range(int(cap.get(cv2.CAP_PROP_FRAME_COUNT))):
    ret,frame=cap.read()
    print(frame)
    frame=tf.image.rgb_to_grayscale(frame)
    frames.append(frame[190:236,80:200,:])
  cap.release()

  mean=tf.math.reduce_mean(frames)
  std=tf.math.reduce_std(tf.cast(frames,tf.float32))
  return tf.cast((frames-mean),tf.float32)/std

def CTCLoss(y_true, y_pred):
    batch_len=tf.cast(tf.shape(y_true)[0], dtype="int64")
    input_length=tf.cast(tf.shape(y_pred)[1], dtype="int64")
    label_length=tf.cast(tf.shape(y_true)[1], dtype="int64")

    input_length=input_length * tf.ones(shape=(batch_len, 1), dtype="int64")
    label_length=label_length * tf.ones(shape=(batch_len, 1), dtype="int64")

    loss=tf.keras.backend.ctc_batch_cost(y_true, y_pred, input_length, label_length)
    return loss


model=load_model(r"C:\Users\Acer\Downloads\lipreadmodel.h5", custom_objects={'CTCLoss':CTCLoss})


@app.route('/upload_video', methods=['POST'])
def upload_video():
    video_file=request.files['video']
    print(video_file)
    blob_data=video_file.read()
    byte_array=bytearray(blob_data)
    ranstring=generate_random_string()
    with open("./files/video"+ranstring+".mpg", 'wb') as f:
        f.write(byte_array)
    sample=loadvideo("./files/video"+ranstring+".mpg")
    sample=tf.expand_dims(sample, axis=0)
    print(sample)
    sample =tf.pad(sample, [[0, 0], [0, 0], [0, 0], [0, 20], [0, 0]])
    result=model.predict(sample)
    vocab=[x for x in "abcdefghijklmnopqrstuvwxyz'?!123456789 "]
    char_to_num=tf.keras.layers.StringLookup(vocabulary=vocab, oov_token="")
    num_to_char=tf.keras.layers.StringLookup(
        vocabulary=char_to_num.get_vocabulary(), oov_token="", invert=True
    )
    decoded=tf.keras.backend.ctc_decode(result, input_length=[75], greedy=True)[0][0].numpy()
    regular_string=[tf.strings.reduce_join([num_to_char(word) for word in sentence]) for sentence in decoded][0].numpy().decode('utf-8')
    print(regular_string)
    return jsonify({"message":"done","result":regular_string})

@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    audio=request.files['audio']
    blob_data=audio.read()
    byte_array=bytearray(blob_data)
    ranstring=generate_random_string()
    with open("./files/audio"+ranstring+".wav", 'wb') as f:
        f.write(byte_array)
    sample_rate,wav_data=wavfile.read("./files/audio"+ranstring+".wav")
    if np.ndim(np.array(wav_data))==2:
       wav_data=[int(sum(i)/len(i)) for i in wav_data]
    sample_rate, wav_data=ensure_sample_rate(sample_rate, wav_data)
    waveform=wav_data / tf.int16.max
    scores, _,_ =soundmodel(waveform)
    scores_np=scores.numpy()
    infered_class=class_names[scores_np.mean(axis=0).argmax()]
    print(infered_class)
    mean_scores=np.mean(scores, axis=0)
    top_n=10
    top_class_indices=np.argsort(mean_scores)[::-1][:top_n]
    arr=[class_names[top_class_indices[x]] for x in range(0, top_n, 1)]
    return jsonify({"message":"done","result":arr})

@app.route('/upload_recaudio', methods=['POST'])
def upload_recaudio():
    audio=request.files['audio']
    blob_data=audio.read()
    byte_array=bytearray(blob_data)
    byte_array = [float(val) / 255.0 for val in byte_array]
    ranstring=generate_random_string()
    with open("./files/audio"+ranstring+".wav", 'wb') as f:
        sf.write("./files/audio"+ranstring+".wav",byte_array,16000)
    with wave.open("./files/audio"+ranstring+".wav", 'rb') as wav_file:
        sample_rate = wav_file.getframerate()
        num_channels = wav_file.getnchannels()
        sample_width = wav_file.getsampwidth()
        num_frames = wav_file.getnframes()
        audio_data = wav_file.readframes(num_frames)
        audio_array = list(wave.struct.unpack(f'{num_frames * num_channels}h', audio_data))
        sample_rate, wav_data=ensure_sample_rate(sample_rate, audio_array )
        max_value = max(abs(sample) for sample in wav_data)
        waveform = [sample / max_value for sample in wav_data]
        scores, _,_ =soundmodel(waveform)
        scores_np=scores.numpy()
        infered_class=class_names[scores_np.mean(axis=0).argmax()]
        mean_scores=np.mean(scores, axis=0)
        top_n=10
        top_class_indices=np.argsort(mean_scores)[::-1][:top_n]
        arr=[class_names[top_class_indices[x]] for x in range(0, top_n, 1)]
        return jsonify({"message":"done","result":arr})
    

@app.route('/upload_image', methods=['POST'])
def image_upload():
    image=request.files['image']
    image=Image.open(image)
    ranstring=generate_random_string()
    image.save("./files/image"+ranstring+".png")
    result=image_to_text("./files/image"+ranstring+".png")[0]['generated_text']
    return jsonify({"message":"done","result":result})


@app.route('/upload_captured_image', methods=['POST'])
def image_captured_upload():
    image=request.form.get('image')
    _, data = image.split(',')
    print(data)
    image_data = io.BytesIO(base64.b64decode(data))
    image = Image.open(image_data)
    ranstring=generate_random_string()
    image.save("./files/image"+ranstring+".png")
    result=image_to_text("./files/image"+ranstring+".png")[0]['generated_text']
    print(result)
    return jsonify({"message":"done","result":result})
if __name__ == '__main__':
    app.run(debug=True,port=5000)
