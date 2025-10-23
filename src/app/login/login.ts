import { Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';


@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  
  activeTab = signal<'login' | 'register'>('login');
  message = signal<string | null>(null);
  messageType = signal<'success' | 'error' | 'info' | 'warning'>('info');
  showMessage = signal(false);
  
  // Computed property for dynamic message box background color
  messageBgColor = () => {
    switch (this.messageType()) {
      case 'success': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      case 'warning': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  // --- Three.js Properties ---
  @ViewChild('threeCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private scene!: any;
  private camera!: any;
  private renderer!: any;
  private cubes: any;
  
  // --- Lifecycle and Initialization ---

  ngAfterViewInit(): void {
    // Ensure canvas is ready before initializing 3D
    if (this.canvasRef) {
      this.initThree();
      this.animate();
    }
  }

  // --- UI and State Methods ---

  /** Toggles the active form tab. */
  toggleMode(mode: 'login' | 'register'): void {
    this.activeTab.set(mode);
  }

  /**
   * Displays a non-intrusive status message box.
   */
  logMessage(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    this.message.set(message);
    this.messageType.set(type);
    this.showMessage.set(true);
    
    // Hide the message after 5 seconds
    setTimeout(() => {
      this.showMessage.set(false);
      // Wait for transition to complete before clearing message
      setTimeout(() => this.message.set(null), 300);
    }, 5000);
  }

  /** Handles mock login submission. */
  onLoginSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement)?.value;
    
    this.logMessage(`Mock Login attempt for user: ${username}`, 'info');

    // Simulate successful login after a delay
    setTimeout(() => {
        this.logMessage(`Login simulated! Welcome, ${username}.`, 'success');
    }, 1000);
  }

  /** Handles mock registration submission. */
  onRegisterSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;

    this.logMessage(`Mock Registration attempt for email: ${email}`, 'info');
    
    // Simulate successful registration
    setTimeout(() => {
        this.logMessage(`Registration simulated! Please check ${email} for confirmation.`, 'success');
        this.toggleMode('login'); // Switch back to login after registration success
    }, 1000);
  }

  // --- Three.js Methods ---

  initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    
    this.scene = new (window as any).THREE.Scene();
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new (window as any).THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    this.camera.position.z = 5;

    this.renderer = new (window as any).THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);

    const ambientLight = new (window as any).THREE.AmbientLight(0x404040, 5);
    this.scene.add(ambientLight);

    const directionalLight = new (window as any).THREE.DirectionalLight(0x4f46e5, 3);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    this.cubes = new (window as any).THREE.Group();
    const geometry = new (window as any).THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new (window as any).THREE.MeshPhongMaterial({ color: 0x4f46e5, shininess: 30, flatShading: true });

    for (let i = 0; i < 150; i++) {
        const cube = new (window as any).THREE.Mesh(geometry, material);
        
        cube.position.x = (Math.random() - 0.5) * 15;
        cube.position.y = (Math.random() - 0.5) * 10;
        cube.position.z = (Math.random() - 0.5) * 20 - 10;
        
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;

        (cube as any).userData.rotationSpeedX = (Math.random() - 0.5) * 0.005;
        (cube as any).userData.rotationSpeedY = (Math.random() - 0.5) * 0.005;

        this.cubes.add(cube);
    }
    this.scene.add(this.cubes);
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    if (this.cubes) {
      this.cubes.children.forEach((cube: any) => {
          cube.rotation.x += cube.userData.rotationSpeedX;
          cube.rotation.y += cube.userData.rotationSpeedY;
      });

      this.cubes.rotation.y += 0.0005;
      this.cubes.rotation.x += 0.0002;

      this.renderer.render(this.scene, this.camera);
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.camera && this.renderer) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

}
