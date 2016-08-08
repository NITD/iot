import requests
import sys
sys.stdout.write("Enter fan id ")
fanid = int(raw_input())
sys.stdout.write("Enter fan name ")
fanname = raw_input()
sys.stdout.write("Enter fan power ")
fanwatts = raw_input()
r = requests.post("http://localhost:3000/api/fan/"+str(fanid), data={'name': fanname, 'watts': fanwatts})
print r.text
