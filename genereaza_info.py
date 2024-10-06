import requests
import re
import json

# https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND=%27199%27

def date_din(url):
    return requests.get(url=url).text

def tabel(text):
    return re.search("Revised:[\s\S]+?(?=\*{79})", text)[0]

def descarca(url):
    return tabel(date_din(url))

informatii = []

for i in range(1,8):
    informatii.append(descarca(f"https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='{i}99'"))

informatiif = open("info.json", "w+")
json.dump(informatii, informatiif)
informatiif.close()