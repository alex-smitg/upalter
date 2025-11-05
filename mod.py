#drag and drop .obj file on this file
import sys
import os

def readModel(fromPath, toPath):
    vertices = []
    nVertices = []
    tVertices = []

    out = ""

    with open(f"{fromPath}.obj", "r") as file:
        for line in file:
            if line[0] == "v" and line[1] == " ":
                data = line.split(" ")
                v1 = float(data[1])
                v2 = float(data[2])
                v3 = float(data[3])
                vertices.append((v1, v2, v3))

            if line[0] == "v" and line[1] == "n":
                data = line.split(" ")
                v1 = float(data[1])
                v2 = float(data[2])
                v3 = float(data[3])
                nVertices.append((v1, v2, v3))

            if line[0] == "v" and line[1] == "t":
                data = line.split(" ")
                v1 = float(data[1])
                v2 = float(data[2])
                tVertices.append((v1, v2))
            
            if line[0] == "f":
                data = line.split(" ")          
                f1 = int(data[1].split("/")[0]) - 1 
                f2 = int(data[2].split("/")[0]) - 1 
                f3 = int(data[3].split("/")[0]) - 1


                f4 = int(data[1].split("/")[1]) - 1 
                f5 = int(data[2].split("/")[1]) - 1 
                f6 = int(data[3].split("/")[1]) - 1

                f7 = int(data[1].split("/")[2]) - 1 
                f8 = int(data[2].split("/")[2]) - 1 
                f9 = int(data[3].split("/")[2]) - 1


                outVertices = [[f1, f4, f7], [f2, f5, f8], [f3, f6, f9]] #pos, texture, niormal

                for i in outVertices:
                    for j in vertices[i[0]]:
                        out += str(j) + ","
                    for k in tVertices[i[1]]:
                        out += str(k) + ","
                    for n in nVertices[i[2]]:
                        out += str(n) + ","
                    

            
    with open(f"{toPath}.model", "w") as file:
        file.write(out)


    print("ok")

for i in range(1, len(sys.argv)):
    name = sys.argv[i].split(".")

    toName = sys.argv[i].split("\\")
    toName = toName[-1].split(".")[0]
    print(toName)
    
    path = sys.argv[0].split("\\")
    path.pop()
    path = os.path.join(*path)

    if name[-1] == "obj":
        readModel(name[0], toName)


