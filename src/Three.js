import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function Three() {
    const refContainer = useRef(null);
    const rendererRef = useRef(null);

    let planete = [
        {
            name: "Mercury",
            xval: -101,
            yval: -89,
            radius: 0.38,
            speed: 4,
            texture: 'images/mercury.jpg',
        },
        {
            name: "Venus",
            xval: 855,
            yval: 982,
            radius: 0.95,
            speed: 2,
            texture: 'images/venus.jpg',
        },
        {
            name: "Earth",
            xval: -974,
            yval: -1174,
            radius: 1,
            speed: 1.6,
            texture: 'images/earth.jpg',
        }, {
            name: "Mars",
            xval: -1013,
            yval: 507,
            radius: 0.53,
            speed: 1.3,
            texture: 'images/mars.jpg',
        }, {
            name: "Jupiter",
            xval: -3425,
            yval: -6643,
            radius: 6,
            speed: 0.5,
            texture: 'images/jupiter.jpg',
        }, {
            name: "Saturn",
            xval: 12194,
            yval: 12705,
            radius: 5,
            speed: 0.3,
            texture: 'images/saturn.jpg',
        }, {
            name: "Uranus",
            xval: 20153,
            yval: 15449,
            radius: 4,
            speed: 0.2,
            texture: 'images/uranus.jpg'
        }, {
            name: "Neptune",
            xval: 10109,
            yval: -18852,
            radius: 3.88,
            speed: 0.1,
            texture: 'images/neptune.jpg',
        },
    ]

    useEffect(() => {
        if (!rendererRef.current) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
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
            function createOrbit(radius1, radius2, segments = 64) {
                const curve = new THREE.EllipseCurve(0, 0, radius1, radius2, 0, 2 * Math.PI, false, 0);
                const points = curve.getPoints(segments);
                const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
                const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
                orbit.rotation.x = Math.PI / 2;
                return orbit;
            }

            let objplanete = [];
            planete.forEach((planeta, index) => {
                planeta[index].texture = texture.load(planeta.texture); // Conversie string in textura
                objplanete.push(createPlanet(planeta.radius, planeta.texture, planeta.xval, planeta.yval))
                scene.add(createOrbit(planeta.xval, planeta.yval))
            })

            function createStars() {
                const starGeometry = new THREE.BufferGeometry();
                const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
                const starVertices = [];
                for (let i = 0; i < 10000; ++i) {
                    const x = (Math.random() - 0.5) * 2000;
                    const y = (Math.random() - 0.5) * 2000;
                    const z = (Math.random() - 0.5) * 2000;
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