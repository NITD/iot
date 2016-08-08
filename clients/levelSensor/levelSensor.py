from socketIO_client import SocketIO, LoggingNamespace
import json
import sys

level = 0
sys.stdout.write("Enter levelSensor id ")
levelSensorId = int(raw_input())
	
socket = SocketIO('localhost', 3000, params = {'query': 'id='+str(levelSensorId)+'&type=levelSensor'})

def sliderChanged():
    global level
    if (level == 0):
        socket.emit('status', { 'status': 'off', 'level': level })
    else:
        socket.emit('status', { 'status': 'on', 'level': level })

socket.on('connected',sliderChanged)

while (True):
    change = raw_input()
    if (change == "u"):
        level = level + 2
        sliderChanged()
    elif (level >= 2):
        level = level - 2
        sliderChanged()
