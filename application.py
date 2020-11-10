import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit, send

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template('index.html')

@socketio.on('message')
def message(data):
    print('received message: ' + data)
    send(data, broadcast=True)

@socketio.on('new username')
def new_username(data):
    username=""
    username=data["username"]
    print(username)
    emit("add username",{"username":username})

@socketio.on('my event')
def handle_my_custom_event(data):
    emit('my response', data, broadcast=True)

