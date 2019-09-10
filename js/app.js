// ==UserScript==
// @name     starter three.js framework
// @version  1.0.0
// @match    https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
// @grant    none
// ==/UserScript==

// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let mesh;

function init() {
  // Get a reference to the container element that will hold our scene
  container = document.querySelector("#scene-container");

  // create a Scene
  scene = new THREE.Scene();

  scene.background = new THREE.Color(0x8fbcd4);

  createCamera();
  createControls();
  createLights();
  createMeshes();
  createRenderer();

  // still calls animate recursively but works well with AR and VR for future proofing
  renderer.setAnimationLoop(() => {
    update();
    render();
  });

  // would have to include update & render in here but doesnt work well with AR and VR
  // function animate() {
  // call animate recursively
  // requestAnimationFrame(animate);
  // }
  // then call the animate function to render the scene
  //animate();
}

function createCamera() {
  // set up the options for a perspective camera
  const fov = 35; // fov = Field Of View
  const aspect = container.clientWidth / container.clientHeight;

  const near = 0.1;
  const far = 100;

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so that we can view the scene
  camera.position.set(-4, 4, 10);
}

function createControls() {
  controls = new THREE.OrbitControls(camera, container);
}

function createLights() {
  // creates light arough object to simulate indirect illumanation
  // Set the color to 0x111111 for a dim indoor scene
  //and 0xaaaaaa for a bright outdoor scene, leave intensity at 1
  const ambientLight = new THREE.AmbientLight(0x111111, 1);
  scene.add(ambientLight);

  // Create a directional light to simulate direct illumanation
  const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);

  // move the light up, to the right and forward a bit
  mainLight.position.set(10, 10, 10);

  // remember to add the both lights to the scene for global illumanation
  scene.add(ambientLight, mainLight);
}

function createMeshes() {
  // create a geometry
  const geometry = new THREE.BoxBufferGeometry(2, 2, 4);

  // create a texture loader.
  const textureLoader = new THREE.TextureLoader();

  // Load a texture. See the note in chapter 4 on working locally, or the page
  const texture = textureLoader.load("js/textures/uv_test_bw.png");

  // set the "color space" of the texture
  texture.encoding = THREE.sRGBEncoding;

  // reduce blurring at glancing angles
  texture.anisotropy = 16;

  // create a Standard material using the texture we just loaded as a color map
  // OR
  // create a purple Basic material MeshBasicMaterial (no light needed)
  // to create a purple standard material there will need to be light
  const material = new THREE.MeshStandardMaterial({
    map: texture
  });

  // create a Mesh containing the geometry and material
  mesh = new THREE.Mesh(geometry, material);

  // add the mesh to the scene object
  scene.add(mesh);
}

function createRenderer() {
  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer({ antialias: true });

  // set the gamma correction so that output colors look
  // correct on our screens
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  // allows use of SI units of lighting
  // such as Lux, Candela, and Lumens to set the lighting
  renderer.physicallyCorrectLights = true;

  // sets render size to same wodth/height of container element
  renderer.setSize(container.clientWidth, container.clientHeight);
  // sets right pixel ration for device rendering image
  renderer.setPixelRatio(window.devicePixelRatio);

  // add the automatically created <canvas> element to the page
  container.appendChild(renderer.domElement);
}

// render, or 'draw a still image', of the scene
function render() {
  // this will create one still image / frame each time the animate
  // function calls itself
  renderer.render(scene, camera);
}

// holds any logic that updates render(i.e. premade movements, user input, physics logic, etc)
function update() {
  // increase the mesh's rotation each frame
  mesh.rotation.z += 0.01;
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
}

// a function that will be called every time the window gets resized.
// It can get called a lot, so don't put any heavy computation in here
function onWindowResize() {
  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);

// call the init function to set everything up
init();
