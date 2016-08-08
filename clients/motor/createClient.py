import requests
import sys
sys.stdout.write("Enter motor id ")
motorid = int(raw_input())
sys.stdout.write("Enter client type ")
clientType = raw_input()
sys.stdout.write("Enter client id ")
clientId = int(raw_input())
r = requests.post("http://localhost:3000/api/motor/"+str(motorid)+"/client/"+str(clientType), data={'id': clientId})
print r.text
