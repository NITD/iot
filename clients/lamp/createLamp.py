import requests
import sys
sys.stdout.write("Enter ip ")
ip = raw_input()
sys.stdout.write("Enter lamp id ")
lampid = int(raw_input())
sys.stdout.write("Enter lamp name ")
lampname = raw_input()
sys.stdout.write("Enter lamp power ")
lampwatts = int(raw_input())
r = requests.post("http://"+ip+":3000/api/lamp/"+str(lampid), data={'name': lampname, 'watts': lampwatts})
print r.text
