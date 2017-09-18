import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from fishdb import FishDB

class FishServer(BaseHTTPRequestHandler):
    
    def do_GET(self):
        # handle path fish/id by returning the requested fish or an error
        if self.path.startswith("/fish/ID"):
        # parse ID from string
            fid = self.path[self.path.find("ID")+2:]
            if fid.isdigit():
                fish = self.getOneFish(fid)
                ##print(fish)
                ## db rows -> list of dicts
                if self.fishExists(fid):
                    self.send_response(200)
                    self.send_header('Access-Control-Allow-Origin','*')
                    self.send_header('Content-Type', 'application/JSON')
                    self.end_headers()
                    flist = []
                    for f in fish:
                        # f[0] is the id, value is list of attributes
                        # 0 id, 1 name, 2 width, 3 height, 4 x, 5 y, 6 color
                        fdict = {"id":f[0], "name":f[1], "width": f[2], "height":f[3], "left":f[4], "top":f[5], "color":f[6]}
                        flist.append(fdict)
                    jsondata = json.dumps(flist)
                    self.wfile.write(bytes(jsondata, "utf-8"))
                else:
                    self.handle404()
            else:
                self.handle404()

        elif self.path.startswith("/fish"):
            #handle path fish by returning all the fish
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin','*')
            self.send_header('Content-Type', 'application/JSON')
            self.end_headers()
            fish = self.getAllFish()
            ##print(fish)
            flist = []
            for f in fish:
                fdict = {"id":f[0], "name":f[1], "width": f[2], "height":f[3], "left":f[4], "top":f[5], "color":f[6]}
                flist.append(fdict)
            jsondata = json.dumps(flist)
            self.wfile.write(bytes(jsondata, "utf-8"))
            
        else:
            # 404 erreee
            self.handle404()


    def do_POST(self):
        if self.path[-5:]=="/fish":
            #send status and response headers
            self.send_response(201)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            #read x-www-form-urlencoded input
            readlength = int(self.headers['Content-Length'])
            rawdata = self.rfile.read(readlength).decode("utf-8")
            parsed_data = parse_qs(rawdata)
            ##print(parsed_data)
            #add fish to DB
            #prevent program-stopping key-value input juuuust in case
            try:
                name = parsed_data['name'][0]
                width = parsed_data['width'][0]
                height = parsed_data['height'][0]
                left = parsed_data['left'][0]
                top = parsed_data['top'][0]
                color = parsed_data['color'][0]
                self.addFish(name,width,height,left,top,color)
            except:
                print("Key error.")
                
        else:
            self.handle404();

            
    def do_OPTIONS(self):
        if self.path.startswith("/fish"):
            #handle path fish by returning all the fish
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin','*')
            self.send_header('Access-Control-Allow-Methods','POST, GET, OPTIONS, PUT, DELETE')
            self.end_headers()
        
        else:
            # 404 err
            self.handle404()


    def do_PUT(self):
        if self.path.startswith("/fish/ID"):
        # parse ID from string
            fid = self.path[self.path.find("ID")+2:]
            if fid.isdigit():
                #send status and response headers
                #read x-www-form-urlencoded input
                readlength = int(self.headers['Content-Length'])
                rawdata = self.rfile.read(readlength).decode("utf-8")
                parsed_data = parse_qs(rawdata)
                ##print(parsed_data)
                #update or add fish to DB
                #test if fish exists
                print(self.fishExists(fid))
                if self.fishExists(fid):
                    self.send_response(200)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    attrValList = []
                    if 'name' in parsed_data:
                        attrValList.append("name")
                        attrValList.append(parsed_data['name'][0])
                    if 'width' in parsed_data:
                        attrValList.append("width")
                        attrValList.append(parsed_data['width'][0])
                    if 'height' in parsed_data:
                        attrValList.append("height")
                        attrValList.append(parsed_data['height'][0])
                    if 'left' in parsed_data:
                        attrValList.append("left")
                        attrValList.append(parsed_data['left'][0])
                    if 'top' in parsed_data:
                        attrValList.append("top")
                        attrValList.append(parsed_data['top'][0])
                    if 'color' in parsed_data:
                        attrValList.append("color")
                        attrValList.append(parsed_data['color'][0])
                    ##print(attrValList)
                    self.updateFish(fid,attrValList)
                else:
                    self.handle404()                    
            else:
                self.handle404()

        else:
            self.handle404();


    def do_DELETE(self):
        if self.path.startswith("/fish/ID"):
        # parse ID from string
            fid = self.path[self.path.find("ID")+2:]
            if fid.isdigit():
                #send status and response headers
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.deleteFish(fid)                
            else:
                self.handle404()

        else:
            self.handle404();


    def handle404(self):
        self.send_response(404)
        self.send_header('Access-Control-Allow-Origin','*')
        self.send_header('Content-Type','text/html')
        self.end_headers()
        self.wfile.write(bytes("<h2>404 Error.</h2> <p>Page not found.</p>", "utf-8"))

    #database ops
    def fishExists(self,fid):
        db = FishDB()
        return db.fishExists(fid)
        
    def getAllFish(self):
        db = FishDB()
        fish = db.getAllFish()
        return fish

    def getOneFish(self, fid):
        db = FishDB()
        fish = db.getOneFish(fid)
        return fish

    def addFish(self,name,width,height,left,top,color):
        db = FishDB()
        db.addFish(name,width,height,left,top,color)

    def updateFish(self,fid,attrValList):
        db = FishDB()
        db.updateFish(fid,attrValList)

    def deleteFish(self,fid):
        db = FishDB()
        db.deleteFish(fid)
        
def run():
	listen = ('127.0.0.1', 8080)
	server = HTTPServer(listen, FishServer)
	print("Listening . . . ")
	server.serve_forever()

run()
    
##'main' function for testing stuff
##parse id from query string
##def main():
##    test = "asdfjklID233"
##    fid = test[test.find("ID")+2:]
##    ##print(fid)
##    fs = FishServer()
##main()
