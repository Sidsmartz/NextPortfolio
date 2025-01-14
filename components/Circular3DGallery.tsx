"use client";
import React, { useEffect } from "react";
import * as THREE from "three";

const Circular3DGallery = () => {
  useEffect(() => {
    const canvasId = "circular-gallery-canvas";

    // Remove the specific canvas if it already exists
    const existingCanvas = document.getElementById(canvasId);
    if (existingCanvas) {
      existingCanvas.remove();
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#000319", 1);
    renderer.domElement.id = canvasId; // Assign a unique id to the canvas
    document.body.appendChild(renderer.domElement);

    const galleryGroup = new THREE.Group();
    scene.add(galleryGroup);

    const radius = 6;
    const height = 30;
    const segments = 30;

    const textureLoader = new THREE.TextureLoader();

    function getRandomImageNumber() {
      return Math.floor(Math.random() * 21) + 1;
    }

    function loadImageTexture(imageNumber) {
      return new Promise((resolve) => {
        const texture = textureLoader.load(
          `assets/img${imageNumber}.jpg`,
          (loadedTexture) => {
            loadedTexture.generateMipmaps = true;
            loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
            loadedTexture.magFilter = THREE.LinearFilter;
            loadedTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            resolve(loadedTexture);
          }
        );
      });
    }

    function createCurvedPlane(width, height, radius, segments) {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const indices = [];
      const uvs = [];

      const segmentsX = segments * 4;
      const segmentsY = Math.floor(height * 12);
      const theta = width / radius;

      for (let y = 0; y <= segmentsY; y++) {
        const yPos = (y / segmentsY - 0.5) * height;
        for (let x = 0; x <= segmentsX; x++) {
          const xAngle = (x / segmentsX - 0.5) * theta;
          const xPos = Math.sin(xAngle) * radius;
          const zPos = Math.cos(xAngle) * radius;
          vertices.push(xPos, yPos, zPos);

          uvs.push((x / segmentsX) * 0.8 + 0.1, y / segmentsY);
        }
      }

      for (let y = 0; y < segmentsY; y++) {
        for (let x = 0; x < segmentsX; x++) {
          const a = x + (segmentsX + 1) * y;
          const b = x + (segmentsX + 1) * (y + 1);
          const c = x + 1 + (segmentsX + 1) * (y + 1);
          const d = x + 1 + (segmentsX + 1) * y;
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();

      return geometry;
    }

    async function initializeBlocks() {
      const numVerticalSections = 12;
      const blocksPerSection = 4;
      const verticalSpacing = 3.25;
      const blocks = [];

      const totalBlockHeight = numVerticalSections * verticalSpacing;
      const heightBuffer = (height - totalBlockHeight) / 2;
      const startY = -height / 2 + heightBuffer + verticalSpacing;

      const sectionAngle = (Math.PI * 2) / blocksPerSection;
      const maxRandomAngle = sectionAngle * 0.3;

      for (let section = 0; section < numVerticalSections; section++) {
        const baseY = startY + section * verticalSpacing;

        for (let i = 0; i < blocksPerSection; i++) {
          const yOffset = Math.random() * 0.2 - 0.1;

          const blockGeometry = createCurvedPlane(5, 3, radius, 10);
          const imageNumber = getRandomImageNumber();
          const texture = await loadImageTexture(imageNumber);

          const blockMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
            toneMapped: false,
          });

          const block = new THREE.Mesh(blockGeometry, blockMaterial);
          block.position.y = baseY + yOffset;

          const blockContainer = new THREE.Group();

          const baseAngle = sectionAngle * i;
          const randomAngleOffset = (Math.random() * 2 - 1) * maxRandomAngle;
          const finalAngle = baseAngle + randomAngleOffset;

          blockContainer.rotation.y = finalAngle;
          blockContainer.add(block);

          blocks.push(blockContainer);
          galleryGroup.add(blockContainer);
        }
      }
    }

    initializeBlocks();

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    camera.position.z = 12;

    function animate() {
      requestAnimationFrame(animate);
      galleryGroup.rotation.y += 0.0025;
      renderer.render(scene, camera);
    }

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();

    return () => {
      const canvasToRemove = document.getElementById(canvasId);
      if (canvasToRemove) {
        canvasToRemove.remove();
      }
    };
  }, []);

  return null;
};

export default Circular3DGallery;
