import requests
import sys
sys.stdout.write("Enter ip ")
ip = raw_input()
sys.stdout.write("Enter levelsensor id ")
levelsensorid = int(raw_input())
sys.stdout.write("Enter levelsensor name ")
levelsensorname = raw_input()
r = requests.post("http://"+ip+":3000/api/levelsensor/"+str(levelsensorid), data={'name': levelsensorname})
print r.text
