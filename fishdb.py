import sqlite3

class FishDB:

    def __init__(self):
        pass

    def fishExists(self,fid):
        connection = sqlite3.connect("fish.sqlite")
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM fish where id = ?", [fid])
        fish = cursor.fetchall()
        connection.close()
        print("exists: ",len(fish)>0)
        return (len(fish)>0)

    def getAllFish(self):
        connection = sqlite3.connect("fish.sqlite")
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM fish")
        fish = cursor.fetchall()
        connection.close()
        return fish
        
    def getOneFish(self, fid):
        connection = sqlite3.connect("fish.sqlite")
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM fish where id = ?", [fid])
        fish = cursor.fetchall()
        connection.close()
        return fish

    def addFish(self,name,width,height,left,top,color):
        connection = sqlite3.connect("fish.sqlite")
        cursor = connection.cursor()
##        print(name,width,height,left,top,color)
        cursor.execute("INSERT INTO fish (name,width,height,left,top,color) VALUES (?,?,?,?,?,?)",[name,width,height,left,top,color])
        connection.commit()
        connection.close()

    def updateFish(self, fid, attrValList):
        if len(attrValList)==0:
            print("No args for update. Cancelling...")
            return
        connection = sqlite3.connect("fish.sqlite")
        cursor = connection.cursor()
        qs = "UPDATE fish SET "
        attrs = int(len(attrValList)/2)
        subs = []
        for i in range(attrs):
            if ';' not in attrValList[i*2]:
                qs += "'{}'=?,".format(attrValList[i*2])
                subs.append(attrValList[i*2+1])
            else:
                print("nonono")
                connection.close()
        qs = qs[:-1]
        qs += " WHERE id=?"
        print("qs",qs)
        print("subs",subs)
        subs.append(fid)
        print("avl",attrValList)
        connection.execute(qs,subs)
        connection.commit()
        connection.close()

    def deleteFish(self, fid):
        connection = sqlite3.connect("fish.sqlite")
        cursor = connection.cursor()
        cursor.execute("DELETE FROM fish WHERE id=?",[fid])
        connection.commit()
        connection.close()
    

    
