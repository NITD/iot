import requests
import sys
sys.stdout.write("Enter fan id ")
fanid = int(raw_input())
sys.stdout.write("Enter client type ")
clientType = raw_input()
sys.stdout.write("Enter client id ")
clientId = int(raw_input())
r = requests.post("http://localhost:3000/api/fan/"+str(fanid)+"/client/"+str(clientType), data={'id': clientId})
print r.text