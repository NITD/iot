import requests
import sys
sys.stdout.write("Enter ip ")
ip = raw_input()
sys.stdout.write("Enter motor id ")
motorid = int(raw_input())
sys.stdout.write("Enter motor name ")
motorname = raw_input()
sys.stdout.write("Enter motor power ")
motorwatts = int(raw_input())
sys.stdout.write("Enter motor rate ")
motorrate = int(raw_input())
r = requests.post("http://"+ip+":3000/api/motor/"+str(motorid), data={'name': motorname, 'watts': motorwatts, 'rate': motorrate})
print r.text
