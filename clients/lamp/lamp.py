from socketIO_client import SocketIO, LoggingNamespace
import json
import sys

status = "off"

def switchLampOn():
	print "on"
	status = "on"

def switchLampOff():
	print "off"
	status = "off"
	
socket = SocketIO('localhost', 3000, params = {'query': 'id=1&type=lamp'})

def onConnected(*message):
	socket.emit('status', { 'status': status })
	socket.emit('get status')

def onStatus(*message):
	stat = message[0]['status']
	if (stat == 'on'):
		switchLampOn()
	else:
		switchLampOff()

socket.on('connected', onConnected)
socket.on('disconnect', switchLampOff)
socket.on('status', onStatus)
socket.wait()
