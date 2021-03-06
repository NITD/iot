from socketIO_client import SocketIO, LoggingNamespace
import json
import sys

status = "off"

sys.stdout.write("Enter ip ")
ip = raw_input()

sys.stdout.write("Enter lamp id ")
lampId = int(raw_input())
	
socket = SocketIO(ip, 3000, params = {'query': 'id='+str(lampId)+'&type=lamp'})

def switchLampOn():
    global status
    print "Lamp is on"
    status = "on"
    socket.emit('status', {'status': status})

def switchLampOff():
    global status
    print "Lamp is off"
    status = "off"
    socket.emit('status', {'status': status})

def onConnected(*message):
    global status
    socket.emit('status', { 'status': status })
    socket.emit('get status')

def onStatus(*message):
    print message[0]
    stat = message[0]['status']
    if (stat == 'on'):
        switchLampOn()
    else:
        switchLampOff()

socket.on('connected', onConnected)
socket.on('disconnect', switchLampOff)
socket.on('status', onStatus)
socket.wait()
