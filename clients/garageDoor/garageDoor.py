from socketIO_client import SocketIO, LoggingNamespace
import json
import sys

status = "closed"

sys.stdout.write("Enter ip ")
ip = raw_input()

sys.stdout.write("Enter garageDoor id ")
garageDoorId = int(raw_input())
	
socket = SocketIO(ip, 3000, params = {'query': 'id='+str(garageDoorId)+'&type=garageDoor'})

def closeDoor():
    global status
    print "Door closed"
    status = "closed"
    socket.emit('status', {'status': status})

def openDoor():
    global status
    print "Door open"
    status = "open"
    socket.emit('status', {'status': status})

def onConnected(*message):
    global status
    socket.emit('status', { 'status': status })
    socket.emit('get status')

def onStatus(*message):
    print message[0]
    stat = message[0]['status']
    if (stat == 'on'):
        openDoor()
    else:
        closeDoor()

socket.on('connected', onConnected)
socket.on('disconnect', closeDoor)
socket.on('status', onStatus)
socket.wait()
