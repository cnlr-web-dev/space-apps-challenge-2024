import * as THREE from 'three'
import { useEffect, useRef, useCallback } from 'react'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function Three() {
    const refContainer = useRef(null);
    const rendererRef = useRef(null);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 500000000000000);

    let info = ["Revised: April 12, 2021             Mercury                            199 / 1\n\n PHYSICAL DATA (updated 2024-Mar-04):\n  Vol. Mean Radius (km) =  2439.4+-0.1    Density (g cm^-3)     = 5.427\n  Mass x10^23 (kg)      =     3.302       Volume (x10^10 km^3)  = 6.085  \n  Sidereal rot. period  =    58.6463 d    Sid. rot. rate (rad/s)= 0.00000124001\n  Mean solar day        =   175.9421 d    Core radius (km)      = ~1600 \n  Geometric Albedo      =     0.106       Surface emissivity    = 0.77+-0.06\n  GM (km^3/s^2)         = 22031.86855     Equatorial radius, Re = 2440.53 km\n  GM 1-sigma (km^3/s^2) =                 Mass ratio (Sun/plnt) = 6023682\n  Mom. of Inertia       =     0.33        Equ. gravity  m/s^2   = 3.701     \n  Atmos. pressure (bar) = < 5x10^-15      Max. angular diam.    = 11.0\"   \n  Mean Temperature (K)  = 440             Visual mag. V(1,0)    = -0.42 \n  Obliquity to orbit[1] =  2.11' +/- 0.1' Hill's sphere rad. Rp = 94.4 \n  Sidereal orb. per.    =  0.2408467 y    Mean Orbit vel.  km/s = 47.362 \n  Sidereal orb. per.    = 87.969257  d    Escape vel. km/s      =  4.435\n                                 Perihelion  Aphelion    Mean\n  Solar Constant (W/m^2)         14462       6278        9126\n  Maximum Planetary IR (W/m^2)   12700       5500        8000\n  Minimum Planetary IR (W/m^2)   6           6           6\n", "Revised: April 12, 2021                Venus                           299 / 2\n \n PHYSICAL DATA (updated 2020-Oct-19):\n  Vol. Mean Radius (km) =  6051.84+-0.01 Density (g/cm^3)      =  5.204\n  Mass x10^23 (kg)      =    48.685      Volume (x10^10 km^3)  = 92.843\n  Sidereal rot. period  =   243.018484 d Sid. Rot. Rate (rad/s)= -0.00000029924\n  Mean solar day        =   116.7490 d   Equ. gravity  m/s^2   =  8.870\n  Mom. of Inertia       =     0.33       Core radius (km)      = ~3200\n  Geometric Albedo      =     0.65       Potential Love # k2   = ~0.25\n  GM (km^3/s^2)         = 324858.592     Equatorial Radius, Re = 6051.893 km\n  GM 1-sigma (km^3/s^2) =    +-0.006     Mass ratio (Sun/Venus)= 408523.72\n  Atmos. pressure (bar) =  90            Max. angular diam.    =   60.2\"\n  Mean Temperature (K)  = 735            Visual mag. V(1,0)    =   -4.40\n  Obliquity to orbit    = 177.3 deg      Hill's sphere rad.,Rp =  167.1\n  Sidereal orb. per., y =   0.61519726   Orbit speed, km/s     =   35.021\n  Sidereal orb. per., d = 224.70079922   Escape speed, km/s    =   10.361\n                                 Perihelion  Aphelion    Mean\n  Solar Constant (W/m^2)         2759         2614       2650\n  Maximum Planetary IR (W/m^2)    153         153         153\n  Minimum Planetary IR (W/m^2)    153         153         153\n", "Revised: April 12, 2021                 Earth                              399\n \n GEOPHYSICAL PROPERTIES (revised May 9, 2022):\n  Vol. Mean Radius (km)    = 6371.01+-0.02   Mass x10^24 (kg)= 5.97219+-0.0006\n  Equ. radius, km          = 6378.137        Mass layers:\n  Polar axis, km           = 6356.752          Atmos         = 5.1   x 10^18 kg\n  Flattening               = 1/298.257223563   oceans        = 1.4   x 10^21 kg\n  Density, g/cm^3          = 5.51              crust         = 2.6   x 10^22 kg\n  J2 (IERS 2010)           = 0.00108262545     mantle        = 4.043 x 10^24 kg\n  g_p, m/s^2  (polar)      = 9.8321863685      outer core    = 1.835 x 10^24 kg\n  g_e, m/s^2  (equatorial) = 9.7803267715      inner core    = 9.675 x 10^22 kg\n  g_o, m/s^2               = 9.82022         Fluid core rad  = 3480 km\n  GM, km^3/s^2             = 398600.435436   Inner core rad  = 1215 km\n  GM 1-sigma, km^3/s^2     =      0.0014     Escape velocity = 11.186 km/s\n  Rot. Rate (rad/s)        = 0.00007292115   Surface area:\n  Mean sidereal day, hr    = 23.9344695944     land          = 1.48 x 10^8 km\n  Mean solar day 2000.0, s = 86400.002         sea           = 3.62 x 10^8 km\n  Mean solar day 1820.0, s = 86400.0         Love no., k2    = 0.299\n  Moment of inertia        = 0.3308          Atm. pressure   = 1.0 bar\n  Mean surface temp (Ts), K= 287.6           Volume, km^3    = 1.08321 x 10^12\n  Mean effect. temp (Te), K= 255             Magnetic moment = 0.61 gauss Rp^3\n  Geometric albedo         = 0.367           Vis. mag. V(1,0)= -3.86\n  Solar Constant (W/m^2)   = 1367.6 (mean), 1414 (perihelion), 1322 (aphelion)\n HELIOCENTRIC ORBIT CHARACTERISTICS:\n  Obliquity to orbit, deg  = 23.4392911  Sidereal orb period  = 1.0000174 y\n  Orbital speed, km/s      = 29.79       Sidereal orb period  = 365.25636 d\n  Mean daily motion, deg/d = 0.9856474   Hill's sphere radius = 234.9       \n", "Revised: June 21, 2016                 Mars                            499 / 4\n \n PHYSICAL DATA (updated 2019-Oct-29):\n  Vol. mean radius (km) = 3389.92+-0.04   Density (g/cm^3)      =  3.933(5+-4)\n  Mass x10^23 (kg)      =    6.4171       Flattening, f         =  1/169.779\n  Volume (x10^10 km^3)  =   16.318        Equatorial radius (km)=  3396.19\n  Sidereal rot. period  =   24.622962 hr  Sid. rot. rate, rad/s =  0.0000708822 \n  Mean solar day (sol)  =   88775.24415 s Polar gravity m/s^2   =  3.758\n  Core radius (km)      = ~1700           Equ. gravity  m/s^2   =  3.71\n  Geometric Albedo      =    0.150                                              \n\n  GM (km^3/s^2)         = 42828.375214    Mass ratio (Sun/Mars) = 3098703.59\n  GM 1-sigma (km^3/s^2) = +- 0.00028      Mass of atmosphere, kg= ~ 2.5 x 10^16\n  Mean temperature (K)  =  210            Atmos. pressure (bar) =    0.0056 \n  Obliquity to orbit    =   25.19 deg     Max. angular diam.    =  17.9\"\n  Mean sidereal orb per =    1.88081578 y Visual mag. V(1,0)    =  -1.52\n  Mean sidereal orb per =  686.98 d       Orbital speed,  km/s  =  24.13\n  Hill's sphere rad. Rp =  319.8          Escape speed, km/s    =   5.027\n                                 Perihelion  Aphelion    Mean\n  Solar Constant (W/m^2)         717         493         589\n  Maximum Planetary IR (W/m^2)   470         315         390\n  Minimum Planetary IR (W/m^2)    30          30          30\n", "Revised: April 12, 2021               Jupiter                              599\n \n PHYSICAL DATA (revised 2024-Jun-30):\n  Mass x 10^22 (g)      = 189818722 +- 8817 Density (g/cm^3)  = 1.3262 +- .0003\n  Equat. radius (1 bar) = 71492+-4 km       Polar radius (km)     = 66854+-10\n  Vol. Mean Radius (km) = 69911+-6          Flattening            = 0.06487\n  Geometric Albedo      = 0.52              Rocky core mass (Mc/M)= 0.0261\n  Sid. rot. period (III)= 9h 55m 29.711 s   Sid. rot. rate (rad/s)= 0.00017585\n  Mean solar day, hrs   = ~9.9259         \n  GM (km^3/s^2)         = 126686531.900     GM 1-sigma (km^3/s^2) =  +- 1.2732\n  Equ. grav, ge (m/s^2) = 24.79             Pol. grav, gp (m/s^2) =  28.34\n  Vis. magnitude V(1,0) = -9.40\n  Vis. mag. (opposition)= -2.70             Obliquity to orbit    =  3.13 deg\n  Sidereal orbit period = 11.861982204 y    Sidereal orbit period = 4332.589 d\n  Mean daily motion     = 0.0831294 deg/d   Mean orbit speed, km/s= 13.0697\n  Atmos. temp. (1 bar)  = 165+-5 K          Escape speed, km/s    =  59.5           \n  A_roche(ice)/Rp       =  2.76             Hill's sphere rad. Rp = 740\n                                 Perihelion   Aphelion     Mean\n  Solar Constant (W/m^2)         56           46           51\n  Maximum Planetary IR (W/m^2)   13.7         13.4         13.6\n  Minimum Planetary IR (W/m^2)   13.7         13.4         13.6\n", "Revised: January 26, 2022             Saturn                               699\n \n PHYSICAL DATA:\n  Mass x10^26 (kg)      = 5.6834          Density (g/cm^3)       =  0.687+-.001\n  Equat. radius (1 bar) = 60268+-4 km     Polar radius (km)      = 54364+-10\n  Vol. Mean Radius (km) = 58232+-6        Flattening             =  0.09796\n  Geometric Albedo      = 0.47            Rocky core mass (Mc/M) =  0.1027\n  Sid. rot. period (III)= 10h 39m 22.4s   Sid. rot. rate (rad/s) =  0.000163785 \n  Mean solar day, hrs   =~10.656         \n  GM (km^3/s^2)         = 37931206.234    GM 1-sigma (km^3/s^2)  = +- 98\n  Equ. grav, ge (m/s^2) = 10.44           Pol. grav, gp (m/s^2)  = 12.14+-0.01\n  Vis. magnitude V(1,0) = -8.88          \n  Vis. mag. (opposition)= +0.67           Obliquity to orbit     = 26.73 deg\n  Sidereal orbit period = 29.447498 yr    Sidereal orbit period  = 10755.698 d\n  Mean daily motion     = 0.0334979 deg/d Mean orbit velocity    =  9.68 km/s\n  Atmos. temp. (1 bar)  = 134+-4 K        Escape speed, km/s    =  35.5          \n  Aroche(ice)/Rp        =  2.71           Hill's sphere rad. Rp  = 1100\n                                 Perihelion  Aphelion    Mean\n  Solar Constant (W/m^2)         16.8        13.6        15.1\n  Maximum Planetary IR (W/m^2)    4.7         4.5         4.6\n  Minimum Planetary IR (W/m^2)    4.7         4.5         4.6\n", "Revised: September 30, 2021           Uranus                               799\n \n PHYSICAL DATA:\n  Mass x10^24 (kg)      = 86.813          Density (g/cm^3)       =  1.271\n  Equat. radius (1 bar) = 25559+-4 km     Polar radius (km)      = 24973+-20\n  Vol. Mean Radius (km) = 25362+-12       Flattening             =  0.02293\n  Geometric Albedo      = 0.51\n  Sid. rot. period (III)= 17.24+-0.01 h   Sid. rot. rate (rad/s) = -0.000101237\n  Mean solar day, h     =~17.24           Rocky core mass (Mc/M) =  0.0012        \n  GM (km^3/s^2)         = 5793951.256     GM 1-sigma (km^3/s^2)  = +-4.3 \n  Equ. grav, ge (m/s^2) =  8.87           Pol. grav, gp (m/s^2)  =   9.19+-0.02\n  Visual magnitude V(1,0)= -7.11\n  Vis. mag. (opposition)=  +5.52          Obliquity to orbit     = 97.77 deg\n  Sidereal orbit period = 84.0120465 y    Sidereal orbit period  = 30685.4 d\n  Mean daily motion     = 0.01176904 dg/d Mean orbit velocity    =  6.8 km/s\n  Atmos. temp. (1 bar)  =  76+-2 K        Escape speed, km/s     =  21.3           \n  Aroche(ice)/Rp        =  2.20           Hill's sphere rad., Rp = 2700\n                                 Perihelion   Aphelion    Mean\n  Solar Constant (W/m^2)         4.09         3.39        3.71\n  Maximum Planetary IR (W/m^2)   0.72         0.55        0.63\n  Minimum Planetary IR (W/m^2)   0.72         0.55        0.63\n"];

    let planete = [
        {
            name: "Mercury",
            o1: 1814618.2,
            o2: 3788255.2497414695,
            o3: -5927350.4,
            o4: -3788255.2497414695,
            rot: 0.12227068694301324,
            radius: 100,
            api_json: {},
            api_command: 199,
            render_scale: 0,
            texture: "images/mercury.jpg",
        },
        {
            name: "Venus",
            o1: 7165589.400000001,
            o2: 7233190.505997658,
            o3: -7301123.8,
            o4: -7233190.505997658,
            rot: 0.05924827411109566,
            radius: 100,
            api_json: {},
            api_command: 299,
            render_scale: 0,
            texture: "images/venus.jpg",
        },
        {
            name: "Earth",
            o1: 9832913.799999999,
            o2: 9998629.672814833,
            o3: -10167138.4,
            o4: -9998629.672814833,
            rot: -2.6720990848033185e-07,
            radius: 100,
            api_json: {},
            api_command: 399,
            render_scale: 0,
            texture: "images/earth.jpg",
        },
        {
            name: "Mars",
            o1: 14303162.4,
            o2: 15170505.360708557,
            o3: -16171044.4,
            o4: -15170505.360708557,
            rot: 0.03228320542488929,
            radius: 100,
            api_json: {},
            api_command: 499,
            render_scale: 0,
            texture: "images/mars.jpg",
        },
        {
            name: "Jupiter",
            o1: 51545007.599999994,
            o2: 51967928.580270864,
            o3: -52512732.4,
            o4: -51967928.580270864,
            rot: 0.02276602153047185,
            radius: 100,
            api_json: {},
            api_command: 599,
            render_scale: 0,
            texture: "images/jupiter.jpg",
        },
        {
            name: "Saturn",
            o1: 94828141.50000001,
            o2: 95228325.03284821,
            o3: -95905377.3,
            o4: -95228325.03284821,
            rot: 0.04338874330931084,
            radius: 100,
            api_json: {},
            api_command: 699,
            render_scale: 0,
            texture: "images/saturn.jpg",
        },
        {
            name: "Uranus",
            o1: 191419072.00000003,
            o2: 191677254.12456194,
            o3: -192364220.8,
            o4: -191677254.12456194,
            rot: 0.013485074058964219,
            radius: 100,
            api_json: {},
            api_command: 799,
            render_scale: 0,
            texture: "images/uranus.jpg",
        },
        {
            name: "Neptune",
            o1: 300613322.8,
            o2: 300688132.14307946,
            o3: -300785132.4,
            o4: -300688132.14307946,
            rot: 0.030893086454925476,
            radius: 100,
            api_json: {},
            api_command: 899,
            render_scale: 0,
            texture: "images/neptune.jpg",
        },
    ]
    let objplanete = [];

    async function update_json_api() {
        try{
            const api_gateway = "http://89.137.132.40:3000/";
            const response = await fetch(api_gateway);
            const json = await response.json();
    
            for (var index = 0; index < planete.length; index++) {
                planete[index].api_json = json[index];
                planete[index].radius = planete[index].api_json[0].radius * 15;
            }
        } catch(e){
            planete[0] = undefined;
        }
    }

    /// Functie de teleportare
    function lookAt(i) {
        console.log(objplanete[i]);
        camera.position.set(objplanete[i].position.x + objplanete[i].position.x / 18, objplanete[i].position.y, objplanete[i].position.z);
    }

    useEffect(() => {
        setInterval(() => console.log(camera.position), 1000);
        update_json_api().then(() => {
            if(planete[0] == undefined)
            {
                alert("Internal server error. Reloading.");
                window.location.reload();
            }

            if (!rendererRef.current) {
                const scene = new THREE.Scene();
                const renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setSize(window.innerWidth, window.innerHeight, false);
                refContainer.current && refContainer.current.appendChild(renderer.domElement);

                rendererRef.current = renderer;

                const texture = new THREE.TextureLoader();
                const controls = new OrbitControls(camera, renderer.domElement);
                camera.position.set(0, 10, 1500000);

                const bgGeometry = new THREE.SphereGeometry(2000, 100, 100);
                const bgMaterial = new THREE.MeshStandardMaterial({ map: texture.load('images/sun.jpg'), side: THREE.DoubleSide });
                const bg = new THREE.Mesh(bgGeometry, bgMaterial);
                scene.add(bg);

                const sunlight = new THREE.PointLight(0xffffff, 2, 100);
                sunlight.position.set(0, 0, 0);
                scene.add(sunlight);

                const sunTexture = texture.load('images/sun.jpg')
                const sunGeometry = new THREE.SphereGeometry(695700 * 4, 32, 32);
                const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xfff000, map: sunTexture });
                const sun = new THREE.Mesh(sunGeometry, sunMaterial);
                scene.add(sun);

                function createPlanet(radius, texture, xval, yval, i) {
                    const planetGeometry = new THREE.SphereGeometry(radius, 128, 128);
                    const planetMaterial = new THREE.MeshBasicMaterial({ map: texture });
                    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
                    planet.position.x = xval;
                    planet.position.y = yval;
                    planet.userData = i;
                    scene.add(planet);
                    return planet;
                }

                function createOrbit(r1, r2, x, y, rot, segments = 128) {
                    const curve = new THREE.EllipseCurve(x, y, r1, r2, 0, 2 * Math.PI, false, -rot);
                    const points = curve.getPoints(segments);
                    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
                    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
                    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
                    orbit.rotation.x = Math.PI / 2;
                    return orbit;
                }

                function ecuatia_elipsei(r1, r2, ox, oy, px, py) {
                    // https://www.geeksforgeeks.org/check-if-a-point-is-inside-outside-or-on-the-ellipse/
                    return (Math.pow(px - ox, 2) / Math.pow(r1, 2)) +
                        (Math.pow(py - oy, 2) / Math.pow(r2, 2));

                    // <1 => px, py -> in elipsa
                    // ===1 => px, py -> pe elipsa
                    // >1 => in afara elipsei 
                }

                const raycaster = new THREE.Raycaster();
                const mouse = new THREE.Vector2();
                renderer.domElement.addEventListener('click', (e) => {
                    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

                    raycaster.setFromCamera(mouse, camera);
                    const intersects = raycaster.intersectObjects(objplanete, true);

                    if (intersects.length > 0) {
                        alert(info[intersects[0].object.userData])
                    }
                });

                planete.forEach((planeta, index) => {
                    planete[index].texture = texture.load(planeta.texture); // Conversie string in textura
                    console.log(planeta.radius)
                    planete[index].r1 = Math.abs(planeta.o3 - planeta.o1); // razele elipsei
                    planete[index].r2 = Math.abs(planeta.o4 - planeta.o2) * 0.95;
                    planete[index].x = (planeta.o4 + planeta.o2) / 2; // decalajul fata de soare al orbitei
                    planete[index].y = (planeta.o3 + planeta.o1) / 2;

                    objplanete.push(createPlanet(planeta.radius, planeta.texture, planete[index].x, planete[index].y, index))
                    scene.add(createOrbit(planete[index].r1, planete[index].r2, planete[index].x, planete[index].y, planeta.rot))
                })

                function createStars() {
                    const starGeometry = new THREE.BufferGeometry();
                    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
                    const starVertices = [];
                    for (let i = 0; i < 5000; i++) {
                        const x = (Math.random() - 0.5) * 2000000000000;
                        const y = (Math.random() - 0.5) * 2000000000000;
                        const z = (Math.random() - 0.5) * 2000000000000;
                        starVertices.push(x, y, z);
                    }
                    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
                    const stars = new THREE.Points(starGeometry, starMaterial);
                    scene.add(stars);
                }
                createStars();

                window.addEventListener('resize', onWindowResize, false)
                function onWindowResize() {
                    camera.aspect = window.innerWidth / window.innerHeight
                    camera.updateProjectionMatrix()
                    renderer.setSize(window.innerWidth, window.innerHeight)
                }

                function animate() {
                    const date = new Date();
                    const time = date.getSeconds() + date.getMinutes() * 60;

                    objplanete.forEach((planeta, index) => {
                        var planeta_obiect = planete[index];
                        var json_packet = planete[index].api_json[time];
                        var x = json_packet.x * planeta_obiect.render_scale;
                        var y = json_packet.y * planeta_obiect.render_scale;

                        // foloseste forta bruta pentru a genera dinamic scala corecta
                        // si pentru a pune planeta pe orbita sa
                        var acuratete = 1.01;
                        while (ecuatia_elipsei(planeta_obiect.r1, planeta_obiect.r2, planeta_obiect.x, planeta_obiect.y, x, y) < acuratete) {
                            planete[index].render_scale += 10;
                            x = json_packet.x * planete[index].render_scale;
                            y = json_packet.y * planete[index].render_scale;
                        }

                        while (ecuatia_elipsei(planeta_obiect.r1, planeta_obiect.r2, planeta_obiect.x, planeta_obiect.y, x, y) > acuratete) {
                            planete[index].render_scale -= 0.001;
                            x = json_packet.x * planete[index].render_scale;
                            y = json_packet.y * planete[index].render_scale;
                        }

                        planeta.position.set(x, 0, y);
                        planeta.rotation.y += 0.001;
                    })

                    sun.rotation.y += 0.001;
                    controls.update();
                    renderer.render(scene, camera);
                    requestAnimationFrame(animate);
                }
                animate();
            }
        });
    }, []);

    return (<div>
        <input type='number' max={7} onChange={(event) => lookAt(event.target.value)} />
        <div className='z-0' ref={refContainer}></div>
    </div>
    );
}

export default Three