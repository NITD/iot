import requests
import sys
sys.stdout.write("Enter ip ")
ip = raw_input()
sys.stdout.write("Enter garagedoor id ")
garagedoorid = int(raw_input())
sys.stdout.write("Enter garagedoor name ")
garagedoorname = raw_input()
r = requests.post("http://"+ip+":3000/api/garagedoor/"+str(garagedoorid), data={'name': garagedoorname})
print r.text
