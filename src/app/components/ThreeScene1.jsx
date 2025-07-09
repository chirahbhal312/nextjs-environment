'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GroundedSkybox } from 'three/examples/jsm/objects/GroundedSkybox.js';

export default function Page() {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const envtexture = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/rogland_clear_night_4k.hdr';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 45);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 5, 0);
    controls.minDistance = 15;
    controls.maxDistance = camera.position.length() * 1.25;
    controls.maxPolarAngle = Math.PI / 2.5;
    // controls.enablePan = false;
    controls.screenSpacePanning = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.update();

    const hdrLoader = new RGBELoader();
    hdrLoader.load(envtexture, (envMap) => {
      envMap.mapping = THREE.EquirectangularReflectionMapping;

      const skybox = new GroundedSkybox(envMap, 15, 100);
      skybox.position.y = 15;
      scene.add(skybox);

    //   const light = new THREE.DirectionalLight(0xffffff, 1);
    //   light.position.set(10, 20, 10);
    //   scene.add(light);
    //   scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xb9cf82, 5);
// 0x87ceeb = sky blue, 0x444444 = dark ground
scene.add(hemiLight);


      const loader = new GLTFLoader();
      loader.load('https://modelviewer.dev/shared-assets/models/Astronaut.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(5, 5, 5);
        model.position.set(0, 0, 0);
        scene.add(model);
      });

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();
    });

    return () => {
      renderer.dispose();
      if (renderer.domElement && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
}                                                   