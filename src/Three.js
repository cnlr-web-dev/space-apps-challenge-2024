import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function Three() {
    const refContainer = useRef(null);
    const rendererRef = useRef(null);

    let planete = [
        {
            name: "Mercury",
            o1: 18.146182,
            o2: 37.88255249741469,
            o3: -59.273504,
            o4: -37.88255249741469,
            rot: 0.12227068694301324,
            radius: 100,
            texture: "images/mercury.jpg",
        },
        {
            name: "Venus",
            o1: 71.655894,
            o2: 72.33190505997658,
            o3: -73.011238,
            o4: -72.33190505997658,
            rot: 0.05924827411109566,
            radius: 100,
            texture: "images/venus.jpg",
        },
        {
            name: "Earth",
            o1: 98.329138,
            o2: 99.98629672814833,
            o3: -101.671384,
            o4: -99.98629672814833,
            rot: -2.6720990848033185e-07,
            radius: 100,
            texture: "images/earth.jpg",
        },
        {
            name: "Mars",
            o1: 143.031624,
            o2: 151.70505360708557,
            o3: -161.710444,
            o4: -151.70505360708557,
            rot: 0.03228320542488929,
            radius: 100,
            texture: "images/mars.jpg",
        },
        {
            name: "Jupiter",
            o1: 515.450076,
            o2: 519.6792858027086,
            o3: -525.1273239999999,
            o4: -519.6792858027086,
            rot: 0.02276602153047185,
            radius: 100,
            texture: "images/jupiter.jpg",
        },
        {
            name: "Saturn",
            o1: 948.2814150000002,
            o2: 952.2832503284822,
            o3: -959.053773,
            o4: -952.2832503284822,
            rot: 0.04338874330931084,
            radius: 100,
            texture: "images/saturn.jpg",
        },
        {
            name: "Uranus",
            o1: 1914.1907200000003,
            o2: 1916.7725412456193,
            o3: -1923.642208,
            o4: -1916.7725412456193,
            rot: 0.013485074058964219,
            radius: 100,
            texture: "images/uranus.jpg",
        },
        {
            name: "Neptune",
            o1: 3006.133228,
            o2: 3006.8813214307947,
            o3: -3007.8513239999997,
            o4: -3006.8813214307947,
            rot: 0.030893086454925476,
            radius: 100,
            texture: "images/neptune.jpg",
        },
    ]

    useEffect(() => {
        if (!rendererRef.current) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.0000000001, 500000000000);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight, false);
            refContainer.current && refContainer.current.appendChild(renderer.domElement);

            rendererRef.current = renderer;

            const texture = new THREE.TextureLoader();
            const controls = new OrbitControls(camera, renderer.domElement);
            camera.position.set(0, 10, 150);

            const bgGeometry = new THREE.SphereGeometry(2000, 100, 100);
            const bgMaterial = new THREE.MeshStandardMaterial({ map: texture.load('images/sun.jpg'), side: THREE.DoubleSide });
            const bg = new THREE.Mesh(bgGeometry, bgMaterial);
            scene.add(bg);

            const sunlight = new THREE.PointLight(0xffffff, 2, 100);
            sunlight.position.set(0, 0, 0);
            scene.add(sunlight);

            const sunTexture = texture.load('images/sun.jpg')
            const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
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

            function createOrbit(o1, o2, o3, o4, rot, segments = 128) {
                const r1 = Math.abs(o3 - o1); // razele elipsei
                const r2 = Math.abs(o4 - o2) * 0.95;
                const x = (o4 + o2) / 2; // decalajul fata de soare al orbitei
                const y = (o3 + o1) / 2;
                const curve = new THREE.EllipseCurve(x, y, r1, r2, 0, 2 * Math.PI, false, -rot);
                const points = curve.getPoints(segments);
                const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
                const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
                orbit.rotation.x = Math.PI / 2;
                return orbit;
            }

            let objplanete = [];
            planete.forEach((planeta, index) => {
                planete[index].texture = texture.load(planeta.texture); // Conversie string in textura
                objplanete.push(createPlanet(planeta.radius, planeta.texture, Math.abs(planeta.xval), Math.abs(planeta.yval)))
                scene.add(createOrbit(planeta.o1, planeta.o2, planeta.o3, planeta.o4, planeta.rot))
            })

            function createStars() {
                const starGeometry = new THREE.BufferGeometry();
                const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
                const starVertices = [];
                for (let i = 0; i < 10000; i++) {
                    const x = (Math.random() - 0.5) * 20000000;
                    const y = (Math.random() - 0.5) * 20000000;
                    const z = (Math.random() - 0.5) * 20000000;
                    starVertices.push(x, y, z);
                }
                starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
                const stars = new THREE.Points(starGeometry, starMaterial);
                scene.add(stars);
            }
            createStars();

            function animate() {
                requestAnimationFrame(animate);
                const time = Date.now() * 0.0001;

                objplanete.forEach((planeta, index) => {
                    planeta.position.set(planete[index].xval * Math.cos(time * planete[index].speed), 0, planete[index].yval * Math.sin(time * planete[index].speed));
                })

                sun.rotation.y += 0.001;
                controls.update();
                renderer.render(scene, camera);
            }
            animate();
        }
    }, []);
    return (<div ref={refContainer}></div>);
}

export default Three