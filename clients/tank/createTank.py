import requests
import sys
sys.stdout.write("Enter ip ")
ip = raw_input()
sys.stdout.write("Enter tank id ")
tankid = int(raw_input())
sys.stdout.write("Enter tank name ")
tankname = raw_input()
sys.stdout.write("Enter tank capacity ")
tankcapacity = int(raw_input())
r = requests.post("http://"+ip+":3000/api/tank/"+str(tankid), data={'name': tankname, 'capacity': tankcapacity})
print r.text
