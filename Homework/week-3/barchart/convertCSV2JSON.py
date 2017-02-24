# # converts CSV format to JSON
## dataset
# ref: http://data.oneworld.nl/dataset/populatie-totaal/resource/d9e54fee-9183-4556-87a3-0533ebf67863

# ref: http://statline.cbs.nl/Statweb/publication/?DM=SLNL&PA=37296ned&D1=57%2c68&D2=0%2c10%2c20%2c30%2c40%2c50%2c60%2c64-65&HDR=G1&STB=T&VW=D

import csv  
import json  
  
# Open the CSV  
csv_f_path = "Population1.csv"
fieldnames = ("jaartal","populatie", "groeipercentage")
# "Onderwerpen_1", "Bevolkingsgroei", "Bevolkingsdichtheid"


f = open( csv_f_path, 'rU' )  
# Change each fieldname to the appropriate field name. I know, so difficult.  
reader = csv.DictReader( f, fieldnames)  
# Parse the CSV into JSON 

out = json.dumps( [ row for row in reader ] )  
print "JSON parsed!"  
# Save the JSON  
f = open( 'testJson.json', 'w')  
print out
f.write(out)  

print "JSON saved!"  

#http://www.andymboyle.com/2011/11/02/quick-csv-to-json-parser-in-python/
#s