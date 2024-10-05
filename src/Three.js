import * as THREE from 'three'
import {useEffect, useRef} from 'react'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function Three() {
    const refContainer = useRef(null);
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        refContainer.current && refContainer.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, 10, 150);

        const sunlight = new THREE.PointLight(0xffffff, 2, 100);
        sunlight.position.set(0, 0, 0);
        scene.add(sunlight);

        const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({color: 0xfff000});
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);

        function createPlanet(radius, color, xval, yval){
            const planetGeometry = new THREE.SphereGeometry(radius, 30, 32);
            const planetMaterial = new THREE.MeshBasicMaterial({color: color});
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.position.x = xval;
            planet.position.y = yval;
            scene.add(planet);
            return planet;
        }

        const mercury = createPlanet(0.38, 0x47494f, 15, 15);
        const venus = createPlanet(0.95, 0xedbe24, 20, 25);
        const earth = createPlanet(1, 0x244af2, 30, 37);
        const mars = createPlanet(0.53, 0xbf3d15, 39, 46);
        const jupiter = createPlanet(6, 0xa38065, 49, 52); 
        const saturn = createPlanet(5, 0xbab195, 57, 64); 
        const uranus = createPlanet(4, 0x88acba, 68, 74);
        const neptune = createPlanet(3.88, 0x2b5be3, 78, 85);
        
        function createOrbit(radius1, radius2, segments = 64){
            const curve = new THREE.EllipseCurve(0, 0, radius1, radius2, 0, 2 * Math.PI, false, 0);
            const points = curve.getPoints(segments);
            const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const orbitMaterial = new THREE.LineBasicMaterial({color: 0xffffff});
            const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            return orbit;
        }
        
        function createStars(){
            const starGeometry = new THREE.BufferGeometry();
            const starMaterial = new THREE.PointsMaterial({color: 0xffffff});
            const starVertices = [];
            for(let i = 0; i < 100000; ++i){
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
        scene.add(createOrbit(15, 15));
        scene.add(createOrbit(20, 25));
        scene.add(createOrbit(30, 37));
        scene.add(createOrbit(39, 46));
        scene.add(createOrbit(49, 52));
        scene.add(createOrbit(57, 64));
        scene.add(createOrbit(68, 74));
        scene.add(createOrbit(78, 85));
        function animate() {
            requestAnimationFrame(animate);
            const time = Date.now() * 0.0001;
            mercury.position.set(15 * Math.cos(time * 4), 0, 15 * Math.sin(time * 4));
            venus.position.set(20 * Math.cos(time * 2), 0, 25 * Math.sin(time * 2));
            earth.position.set(30 * Math.cos(time * 1.6), 0, 37 * Math.sin(time * 1.6));
            mars.position.set(39 * Math.cos(time * 1.3), 0, 46 * Math.sin(time * 1.3));
            jupiter.position.set(49 * Math.cos(time * 0.5), 0, 52 * Math.sin(time * 0.5));
            saturn.position.set(57 * Math.cos(time * 0.3), 0, 64 * Math.sin(time * 0.3));
            uranus.position.set(68 * Math.cos(time * 0.2), 0, 74 * Math.sin(time * 0.2));
            neptune.position.set(78 * Math.cos(time * 0.1), 0, 85 * Math.sin(time * 0.1));
            sun.rotation.y += 0.001;
            controls.update();
            renderer.render(scene, camera);
        }
        animate();


    }, []); 
    return (<div ref = {refContainer}></div>);
}
export default Three