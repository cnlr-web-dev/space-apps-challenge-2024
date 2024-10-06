from math import *
# https://ssd.jpl.nasa.gov/planets/approx_pos.html
planete = [
    "Mercury   0.38709843      0.20563661      7.00559432      252.25166724     77.45771895     48.33961819 199",
    "Venus     0.72333566      0.00677672      3.39467605      181.97909950    131.60246718     76.67984255 299",
    "Earth   1.00000261      0.01671123     -0.00001531      100.46457166    102.93768193      0.0 399",
    "Mars      1.52371034      0.09339410      1.84969142       -4.55343205    -23.94362959     49.55953891 499",
    "Jupiter   5.20288700      0.04838624      1.30439695       34.39644051     14.72847983    100.47390909 599",
    "Saturn    9.53667594      0.05386179      2.48599187       49.95424423     92.59887831    113.66242448 699",
    "Uranus   19.18916464      0.04725744      0.77263783      313.23810451    170.95427630     74.01692503 799",
    "Neptune  30.06992276      0.00859048      1.77004347      -55.12002969     44.96476227    131.78422574 899"
]

for planeta in planete:
    s = planeta.split()
    for i in range(1,len(s)):
        s[i] = float(s[i])

    # Reimplementare https://nasa.github.io/mission-viz/RMarkdown/Elliptical_Orbit_Design.html
    a = s[1] # axa semi-majora
    e = s[2] # eccentricitatea
    I = radians(s[3]) # inclinatia
    b = a * sqrt(1 - e*e) # axa semi-minora
    c = e * a # distanta de la centru la focus

    # genereaza intersectia orbitei cu axele sistemului de coordonate cartezian
    p1 = a * cos(radians(0)) - e # 0* x
    p2 = a * sqrt(1-e*e) * sin(radians(90)) # 90* y
    p3 = a * cos(radians(180)) - e # 180* x
    p4 = a * sqrt(1-e*e) * sin(radians(270)) # 270* y

    # scaleaza la valori mult mai mari
    p1 *= 10000000
    p2 *= 10000000
    p3 *= 10000000
    p4 *= 10000000

    print("{")
    print(f"name: \"{s[0]}\",")
    print(f"o1: {p1},")
    print(f"o2: {p2},")
    print(f"o3: {p3},")
    print(f"o4: {p4},")
    print(f"rot: {I},")
    print(f"radius: 100,")
    print("api_json: {},")
    print(f"api_command: {int(s[7])},")
    print("render_scale: 0,")
    print(f"texture: \"images/{s[0].lower()}.jpg\",")
    print("},")
