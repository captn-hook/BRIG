#get 1 file name from args

from operator import le
from re import T
import sys

if len(sys.argv) != 2:
    print("Usage: python3 csv.py filename")
    sys.exit(1)

#open file

Ds = []
Ts = []

Dspot = False
Tspot = False

Transmission = []

Trnsspot = False
with open(sys.argv[1], "r") as file:

    #read file
    for line in file:

        if len(line) == 1:
            continue

        if line[0] == 'D':

            Dspot = True
            Tspot = False
            Trnsspot = False

            continue
            
        if line[0] == 'T':
            Dspot = False

            if line[1] == 's':
                Tspot = True
                Trnsspot = False

            if line[1] == 'r':
                Trnsspot = True
                Tspot = False

            continue

        if Dspot == True:
            Ds.append(line[1:-2])
        
        if Tspot == True:
            Ts.append(line[1:-2])

        if Trnsspot == True:
            if line[-1] == '\n':
                Transmission.append(line[:-1])
            else:
                Transmission.append(line)

offsetX = 0
offsetY = 0

#-8.5, -2
for i in range(len(Ts)):
        xyz = Ts[i].split('/')

        newY = float(xyz[1]) * -1

        Ts[i] = str(float(xyz[0]) + offsetX) + '/' + str(newY + offsetY) + '/' + xyz[2]

for i in range(len(Ds)):
        xyz = Ds[i].split('/')

        newY = float(xyz[1]) * -1

        Ds[i] = str(float(xyz[0]) + offsetX) + '/' + str(newY + offsetY) + '/' + xyz[2]

if len(Ds) * len(Ts) == len(Transmission):
    #write csv
    print("OUTPUT:", len(Ds), len(Ts), len(Ds) * len(Ts),len(Transmission))

    with open("data.csv","w") as file:

        out = ''
        #rows
        for i in range(len(Ts) + 2):

            if i == 0:
                line = "Labels,M0,"

                for j in range(len(Ds)):
                    line += "M" + str(j + 1) + ","
                
                line = line[:-1] + "\n"

            elif i == 1:
                line = "T0,XYZ,"

                for j in Ds:
                    line += str(j) + ","
                
                line = line[:-1] + "\n"

            else:
                x = i - 2

                line = "T" + str(x + 1) + ","

                line += Ts[x - 1] + ","

                #Transmission is M lines long for each t
                #for every d 
                i = 0
                for j in Transmission[x::(len(Ds) - 1)]:
                    i += 1
                    print(i)
                    if i <= len(Ds):
                        line += str(j) + ","
                    else:
                        break
                    
                line = line[:-1] + "\n"

            print(line)

            out += line
        
        out += "INSIGHTS\nVIEWS"
        file.write(out)
        

    
else:
    print("D: ", len(Ds), Ds)
    print("T: ", len(Ts), Ts)
    print("Transmission: ", len(Transmission), Transmission)

    print("Error: Ds and Ts don't match Transmission")
    sys.exit(1)
