from socketIO_client import SocketIO, LoggingNamespace
import json
import sys

status = "off"

sys.stdout.write("Enter ip ")
ip = raw_input()

sys.stdout.write("Enter motor id ")
motorId = int(raw_input())

def switchMotorOn():
    global status
    print "on"
    status = "on"
    socket.emit('status', {'status': status})

def switchMotorOff():
    global status
    print "off"
    status = "off"
    socket.emit('status', {'status': status})
    
socket = SocketIO(ip, 3000, params = {'query': 'id='+str(motorId)+'&type=motor'})

def onConnected(*message):
    global status
    socket.emit('status', { 'status': status })
    socket.emit('get status')

def onStatus(*message):
    print message[0]
    stat = message[0]['status']
    if (stat == 'on'):
        switchMotorOn()
    else:
        switchMotorOff()

socket.on('connected', onConnected)
socket.on('disconnect', switchMotorOff)
socket.on('status', onStatus)
socket.wait()
