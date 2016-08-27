import requests
import sys
sys.stdout.write("Enter ip ")
ip = raw_input()
sys.stdout.write("Enter switchSensor id ")
switchSensorid = int(raw_input())
sys.stdout.write("Enter switchSensor name ")
switchSensorname = raw_input()
r = requests.post("http://"+ip+":3000/api/switchSensor/"+str(switchSensorid), data={'name': switchSensorname})
print r.text
