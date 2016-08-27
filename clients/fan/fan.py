from socketIO_client import SocketIO, LoggingNamespace
import json
import sys

status = "off"
level = 0

sys.stdout.write("Enter fan id ")
fanId = int(raw_input())

sys.stdout.write("Enter ip ")
ip = raw_input()

socket = SocketIO(ip, 3000, params = {'query': 'id='+str(fanId)+'&type=fan'})

def changeFanStatus(*message):
    global level
    global status
    level = message[0]['level']
    if (message[0]['status'] == 'on'):
        status = 'on'
        print level
    else:
        status = 'off';
        print level
	socket.emit('status', { 'status': status,'level': level });

def changeFanStatusOff(*message):
    global level
    global status
    level = 0
    status = 'off'
    socket.emit('status', { 'status': status,'level': level });

def onConnected(*message):
    global level
    global status
    socket.emit('status', { 'status': status, 'level': level })
    socket.emit('get status')

socket.on('connected', onConnected)
socket.on('disconnect', changeFanStatusOff)
socket.on('status', changeFanStatus)
socket.wait()
