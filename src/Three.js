import * as THREE from 'three'
import { useEffect, useRef, useCallback } from 'react'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function Three() {
    const refContainer = useRef(null);
    const rendererRef = useRef(null);

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

    async function update_json_api() {
        const api_gateway = "http://localhost:3000/";

        for (var index = 0; index < planete.length; index++) {
            const api_query = `${api_gateway}${planete[index].api_command}`;
            const response = await fetch(api_query);
            const json = await response.json();
            planete[index].api_json = json;
            planete[index].radius = planete[index].api_json[0].radius * 15;
        }
    }

    useEffect(() => {
        update_json_api().then(() => {
            if (!rendererRef.current) {
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.0000000000001, 500000000000000);
                const renderer = new THREE.WebGLRenderer();
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

                function createPlanet(radius, texture, xval, yval) {
                    const planetGeometry = new THREE.SphereGeometry(radius, 30, 32);
                    const planetMaterial = new THREE.MeshBasicMaterial({ map: texture });
                    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
                    planet.position.x = xval;
                    planet.position.y = yval;
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

                let objplanete = [];
                planete.forEach((planeta, index) => {
                    planete[index].texture = texture.load(planeta.texture); // Conversie string in textura
                    console.log(planeta.radius)
                    planete[index].r1 = Math.abs(planeta.o3 - planeta.o1); // razele elipsei
                    planete[index].r2 = Math.abs(planeta.o4 - planeta.o2) * 0.95;
                    planete[index].x = (planeta.o4 + planeta.o2) / 2; // decalajul fata de soare al orbitei
                    planete[index].y = (planeta.o3 + planeta.o1) / 2;

                    objplanete.push(createPlanet(planeta.radius, planeta.texture, planete[index].x, planete[index].y))
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

                function animate() {
                    const date = new Date();
                    const time = date.getSeconds() + date.getMinutes();

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

                        if(index == 0)
                            console.log(`${x} ${y}`);
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
    return (<div ref={refContainer}></div>);
}

export default Three