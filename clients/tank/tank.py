from socketIO_client import SocketIO, LoggingNamespace
import json
import sys
import thread
level = 0
capacity = 250
requesting = False

sys.stdout.write("Enter ip ")
ip = raw_input()

sys.stdout.write("Enter tank id ")
tankId = int(raw_input())

sys.stdout.write("Enter tank capacity ")
capacity = int(raw_input())

socket = SocketIO(ip, 3000, params = {'query': 'id='+str(tankId)+'&type=tank'})

def requestWater():
    global requesting
    requesting = True
    print "hi"
    socket.emit('get water')

def stopRequestingWater():
    global requesting
    requesting = False
    socket.emit('stop water')

def showOverflowMessage():
    global requesting
    requesting = False
    print "Overflow"
    stopRequestingWater()

def onConnected(*message):
    global level
    global requesting
    socket.emit('level', { 'level': level })
    if (requesting):
        socket.emit('get water')

def onWater(*message):
    global level
    global capacity
    print message[0]
    newLevel = level + message[0]['capacity']
    if (requesting == False):
        socket.emit('stop water')
    if (newLevel > capacity):
        level = capacity
        stopRequestingWater()
        showOverflowMessage()
    else:
        level = newLevel
        if (level == capacity):
            stopRequestingWater()
    socket.emit('level', {'level': level })
    percentLevel = float(level)/ capacity * 100
    print percentLevel

def thread1():
    socket.on('connected', onConnected)
    socket.on('water', onWater)
    socket.wait()
def thread2():
    global requesting
    global level
    global capacity
    while (True):
        if (raw_input() == "r"):
            print requesting
            if (requesting):
                stopRequestingWater()
            else:
                if (level < capacity):
                    requestWater()
                else:
                    showOverflowMessage()
thread.start_new_thread(thread1,())
thread.start_new_thread(thread2,())
while 1:
    pass