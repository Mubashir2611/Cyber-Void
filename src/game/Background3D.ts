import * as THREE from 'three';

export default class Background3D {
  private scene: THREE.Scene;
  private cityMesh: THREE.Group;
  private gridMesh: THREE.LineSegments;
  private particles: THREE.Points;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.createBackground();
  }

  private createBackground() {
    // Create cyberpunk grid floor
    this.createGrid();
    
    // Create floating city silhouettes
    this.createCity();
    
    // Create particle field
    this.createParticles();
    
    // Add atmospheric lighting
    this.createLighting();
  }

  private createGrid() {
    const gridSize = 50;
    const gridDivisions = 50;
    
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({ 
      color: 0x00FFFF,
      transparent: true,
      opacity: 0.3
    });
    
    const points = [];
    const size = gridSize;
    const step = size / gridDivisions;
    
    // Horizontal lines
    for (let i = 0; i <= gridDivisions; i++) {
      const y = -size / 2 + i * step;
      points.push(-size / 2, y, 0, size / 2, y, 0);
    }
    
    // Vertical lines
    for (let i = 0; i <= gridDivisions; i++) {
      const x = -size / 2 + i * step;
      points.push(x, -size / 2, 0, x, size / 2, 0);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    this.gridMesh = new THREE.LineSegments(geometry, material);
    this.gridMesh.rotation.x = -Math.PI / 2;
    this.gridMesh.position.z = -10;
    this.scene.add(this.gridMesh);
  }

  private createCity() {
    this.cityMesh = new THREE.Group();
    
    // Create building silhouettes
    for (let i = 0; i < 20; i++) {
      const height = Math.random() * 15 + 5;
      const width = Math.random() * 3 + 1;
      const depth = Math.random() * 3 + 1;
      
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0x000033,
        transparent: true,
        opacity: 0.7
      });
      
      const building = new THREE.Mesh(geometry, material);
      building.position.x = (Math.random() - 0.5) * 40;
      building.position.y = height / 2;
      building.position.z = -15 - Math.random() * 10;
      
      // Add random neon lights
      if (Math.random() > 0.5) {
        const lightGeometry = new THREE.PlaneGeometry(0.2, 0.2);
        const lightMaterial = new THREE.MeshBasicMaterial({ 
          color: Math.random() > 0.5 ? 0xFF00FF : 0x00FFFF,
          transparent: true,
          opacity: 0.8
        });
        
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.x = building.position.x + (Math.random() - 0.5) * width;
        light.position.y = building.position.y + (Math.random() - 0.5) * height;
        light.position.z = building.position.z + depth / 2 + 0.1;
        
        this.cityMesh.add(light);
      }
      
      this.cityMesh.add(building);
    }
    
    this.scene.add(this.cityMesh);
  }

  private createParticles() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = Math.random() * 50;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;
      
      // Random neon colors
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i3] = 1; colors[i3 + 1] = 0; colors[i3 + 2] = 1; // Magenta
      } else if (colorChoice < 0.66) {
        colors[i3] = 0; colors[i3 + 1] = 1; colors[i3 + 2] = 1; // Cyan
      } else {
        colors[i3] = 0.5; colors[i3 + 1] = 0; colors[i3 + 2] = 1; // Purple
      }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private createLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.scene.add(ambientLight);
    
    // Directional light with cyan tint
    const directionalLight = new THREE.DirectionalLight(0x00FFFF, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    // Pink accent light
    const accentLight = new THREE.DirectionalLight(0xFF00FF, 0.5);
    accentLight.position.set(-1, -1, 1);
    this.scene.add(accentLight);
  }

  public update() {
    // Animate grid
    if (this.gridMesh) {
      this.gridMesh.position.z += 0.1;
      if (this.gridMesh.position.z > 5) {
        this.gridMesh.position.z = -15;
      }
    }
    
    // Animate city (parallax effect)
    if (this.cityMesh) {
      this.cityMesh.rotation.y += 0.001;
    }
    
    // Animate particles
    if (this.particles) {
      this.particles.rotation.y += 0.002;
      
      // Make particles float
      const positions = this.particles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.01;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }
  }
}