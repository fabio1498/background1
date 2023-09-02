class THREEScene {
  constructor(container = document.body) {
    this.container = container;

    this.setup();
    this.camera();
    this.addObjects();
    this.eventListeners();
    this.settings();
    this.render();
  }

  settings() {
    this.settings = {
      blur: 0,
      speed: 0.5,
      noiseFreq: 1.0 };


    const gui = new dat.GUI();
    gui.add(this.settings, "blur", 0.0, 0.49, 0.01);
    gui.add(this.settings, "speed", 0.0, 1.5, 0.1);
    gui.add(this.settings, "noiseFreq", 0.0, 10.0, 0.1);
  }

  setup() {
    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2();
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true });

    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio = window.devicePixelRatio;
    this.renderer.setClearColor(0xffffff, 1);
    this.container.appendChild(this.renderer.domElement);
  }

  camera() {
    const FOV = 50;
    const NEAR = 0.001;
    const FAR = 100;
    const ASPECT_RATIO = this.viewport.aspectRatio;

    this.camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, NEAR, FAR);
    this.camera.position.set(0, 0, 10);
  }

  lights() {
    //const ambientLight = new THREE.AmbientLight(0x404040);
  }

  addObjects() {
    this.time = 0;
    this.geometry = new THREE.PlaneBufferGeometry(10, 10, 16, 16);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { type: "f", value: 0 },
        u_resolution: { type: "v4", value: new THREE.Vector4() },
        u_aspect: { type: "f", value: this.aspectRatio },
        u_noiseFreq: { value: 0 },
        blur: { value: 0 },
        speed: { value: 0 } },

      transparent: true,
      wireframe: false,
      vertexShader: document.getElementById("vertex").textContent,
      fragmentShader: document.getElementById("fragment").textContent });


    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);
    this.scene.add(this.mesh);
  }

  render() {
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);

    this.material.uniforms.u_time.value = this.clock.getElapsedTime();
    this.material.uniforms.blur.value = this.settings.blur;
    this.material.uniforms.speed.value = this.settings.speed;
    this.material.uniforms.u_noiseFreq.value = this.settings.noiseFreq;

    requestAnimationFrame(() => {
      this.render();
    });
  }

  eventListeners() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  onWindowResize() {
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  get viewport() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const aspectRatio = width / height;

    this.aspectRatio = aspectRatio;

    return {
      width,
      height,
      aspectRatio };

  }}


const scene = new THREEScene();