from socketIO_client import SocketIO, LoggingNamespace
import json
import sys

status = 'off'

sys.stdout.write("Enter switchSensor id ")
switchSensorId = int(raw_input())

socket = SocketIO('localhost', 3000, params = {'query': 'id='+str(switchSensorId)+'&type=switchSensor'})

def connected(*message):
    socket.emit('status', {'status': status })

socket.on('connected', connected)

def switchOff():
    global status
    status = 'off'
    socket.emit('status', {'status': status})

def switchOn():
    global status
    status = 'on'
    socket.emit('status', {'status': status})

while (True) :
    switch = raw_input()
    if (switch == 'switch'):
        print status
        if (status == 'off'):
            switchOn()
        else:
            switchOff()
    elif (switch == 'close'):
        break
        
        
