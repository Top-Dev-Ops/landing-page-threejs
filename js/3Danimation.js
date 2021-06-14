function isMobile() {
  var checker = {
    Android: function Android() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function BlackBerry() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function iOS() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function Opera() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function Windows() {
      return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function any() {
      return (
        checker.Android() ||
        checker.BlackBerry() ||
        checker.iOS() ||
        checker.Opera() ||
        checker.Windows()
      );
    },
  };
  return checker.any() ? true : false;
}

function isPortrait() {
  var portrait;
  if (window.matchMedia("(orientation: portrait)").matches) {
    portrait = true;
  }
  if (window.matchMedia("(orientation: landscape)").matches) {
    portrait = false;
  }
  return portrait;
}

// shader setting
const vertexShaderText = [
  "varying vec2 vUv;",
  "void main(){",
  "   vUv  = uv;",
  "   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
  "}",
].join("\n");
const fragmentShaderText = [
  "uniform sampler2D baseTexture;",
  "uniform sampler2D bloomTexture;",
  "varying vec2 vUv;",
  "void main(){",
  "   gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );",
  "}",
].join("\n");

const canvas = document.getElementById("canvas"),
  screenDimensions = {
    width: canvas.width,
    height: canvas.height,
  },
  scene = buildScene(),
  renderer = buildRender(screenDimensions);

var camera = buildCamera(screenDimensions),
  camera_pos = -1;

var mark = {
  body: null,
  ring: null,
  pos: {
    x: -35.5 - 2.3 * camera.aspect,
    y: 200 + 1.09 * camera.aspect,
  },
};

var sky,
  pillar,
  ground,
  ground1,
  gmap = { star: null, small: null, big: null },
  top_interval,
  mark_interval,
  light = {
    white: null,
    sub: null,
    blue: null,
    door: { up: null, mark: null, down: null },
    mark: { front: null, effect: null },
  };

var bloomComposer, finalComposer, top_ring; //bloom effect
var materials = {};
var bloomLayer = new THREE.Layers();
bloomLayer.set(1);
var darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });

const cloud_pos = [
  [
    [-8.81, 8.37, 900.08],
    [-8.82, 6.04, 809.33],
    [-4.42, 5.08, 811.73],
  ],
  [
    [4.66, 2.59, 615.7],
    [7.71, 9.51, 775.44],
    [0.18, 8.61, 953.74],
    [-9.9, 5.29, 952.65],
    [4.44, 6.72, 990.87],
  ],
  [
    [4.25, 6.06, 688.59],
    [-0.11, 5.47, 889.62],
    [-3.71, 8.72, 463.18],
    [-6.16, 1.05, 741.84],
    [5.74, 6.96, 692.63],
    [7.14, 8.89, 528.48],
  ],
  [
    [4.55, 7.18, 651.93],
    [2.59, 4.56, 298.65],
    [3.24, 0.84, 612.34],
    [-9.74, 2.34, 904.93],
    [3.43, 0.69, 714.2],
    [0.86, 2.56, 294.97],
    [8.77, 7.11, 792.04],
    [-8.24, 5.06, 782.74],
    [-9.46, 8.23, 695.84],
    [9.44, 2.64, 673.31],
    [-7.48, 7.21, 578.59],
    [-6.3, 7.34, 765.88],
    [-7.93, 5.82, 301.12],
  ],
  [
    [7.82, 9.6, 117.68],
    [-0.3, 9.65, 16.34],
    [1.92, 5.56, 202.83],
    [-2.78, 6.31, 434.58],
    [-8.78, 9.55, 421.5],
    [-1.27, 4.4, 963.34],
    [-9.94, 3.33, 751.68],
  ],
];
const cloud_scale = [
  [
    [0.55, 0.54, 2.08],
    [0.36, 1.17, 0.27],
    [0.43, 1.53, 0.81],
  ],
  [
    [0.86, 0.81, 1.01],
    [2.59, 0.97, 1.49],
    [0.33, 2.69, 2.8],
    [1.21, 0.43, 0.51],
    [2.98, 1.8, 0.37],
  ],
  [
    [0.83, 0.67, 2.42],
    [2.04, 1.83, 2.92],
    [0.2, 2.06, 2.86],
    [1.51, 2.21, 1.92],
    [2.31, 1.65, 0.58],
    [2.27, 0.63, 2.8],
  ],
  [
    [1.21, 2.3, 1.45],
    [2.86, 0.23, 2.32],
    [0.66, 0.59, 1.26],
    [0.51, 0.88, 0.17],
    [2.91, 0.03, 1.44],
    [2.14, 0.56, 2.54],
    [0.71, 1.65, 1.28],
    [1.2, 2.2, 1.61],
    [1.2, 2.32, 0.11],
    [2.93, 0.31, 1.67],
    [2.17, 2.38, 2.66],
    [2.62, 1.25, 0.72],
    [3, 2.33, 0.25],
  ],
  [
    [2.49, 2.72, 1.36],
    [0.67, 2.9, 2.54],
    [1.8, 2.8, 2.84],
    [1.88, 2.68, 0.35],
    [1.71, 2.73, 1.24],
    [1.34, 1.63, 2.79],
    [2.6, 1.74, 0.22],
  ],
];
const cloud_rot = [
  [0.34, 0.23, 0.48],
  [0.42, 0.24, 0.81, 0.68, 0.85],
  [0.55, 0.13, 0.89, 0.46, 0.18, 0.37],
  [0.75, 0.59, 0.58, 0.52, 0.61, 0.91, 0.61, 0.12, 0.63, 0.72, 0.28, 0.26, 0.74],
  [0.49, 0.92, 0.23, 0.72, 0.13, 0.62, 0.83],
];

function buildScene() {
  const scene = new THREE.Scene();
  return scene;
}

function loadModel(url, model_name) {
  const loader = new THREE.GLTFLoader();
  loader.load(url, function (gltf) {
    var model = gltf.scene;
    switch (model_name) {
      case "pillar":
        model.position.y = -8;
        break;
      case "door":
        model.position.set(-5.18, -7.83, 59.36);
        model.rotation.set(0, -0.126, 0);
        break;
      case "mark":
        mark.body = model;
        mark.body.visible = false;
        break;
    }

    model.traverse(function (child) {
      if (child.isMesh) {
        switch (model_name) {
          case "pillar":
            if (child.name == "top") {
              top_ring = child.clone();
              top_ring.material = new THREE.MeshBasicMaterial({
                color: 0x2266ff,
              });
              top_ring.layers.enable(1);
              top_ring.position.y -= 8;
              scene.add(top_ring);
            } else {
              child.material.color.set("rgb(0,150,230)");
              pillar = child;
            }
            child.castShadow = true;
            child.material.flatShading = true;
            break;
          case "door":
            child.receiveShadow = true;
            break;
          case "mark":
            if (child.name == "mark_ring") {
              mark.ring = child.clone();
              mark.ring.material = new THREE.MeshBasicMaterial({
                color: 0x2266ff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5,
              });
              mark.ring.layers.enable(1);
              scene.add(mark.ring);
            }
            break;
        } //end of switch
      } //end of if
    });
    scene.add(model);
  });
}

function buildRender({ width, height }) {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
  // renderer.setPixelRatio(isMobile() ? 0.8 : DPR);
  renderer.setPixelRatio(DPR);
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  return renderer;
}

function buildCamera({ width, height }) {
  let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
  camera.layers.enable(1);
  camera.position.set(-10, -6, 1000);
  camera.rotation.set(0.1, 0, 0);
  scene.add(camera);
  return camera;
}

function resizeCanvas() {
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  onWindowResize();
}

function onWindowResize() {
  const { width, height } = canvas;
  screenDimensions.width = width;
  screenDimensions.height = height;
  camera.aspect = width / height; // no need  for windows
  camera.updateProjectionMatrix();
  bloomComposer.setSize(width, height); // bloom
  finalComposer.setSize(width, height);
  renderer.setSize(width, height);
}

function bindEventListeners() {
  window.onresize = resizeCanvas;
  resizeCanvas();
}

function createSceneObjects() {
  buildLight();
  gmap.big = new THREE.TextureLoader().load("res/img/Ground_Dots.png");
  gmap.big.wrapS = THREE.RepeatWrapping;
  gmap.big.wrapT = THREE.RepeatWrapping;
  gmap.big.repeat.set(1500, 1500);

  gmap.small = new THREE.TextureLoader().load("res/img/Ground_Dots_small.png");
  gmap.small.wrapS = THREE.RepeatWrapping;
  gmap.small.wrapT = THREE.RepeatWrapping;
  gmap.small.repeat.set(1500, 1500);

  gmap.start = new THREE.TextureLoader().load("res/img/Ground_Dots_start.png");
  gmap.start.wrapS = THREE.RepeatWrapping;
  gmap.start.wrapT = THREE.RepeatWrapping;
  gmap.start.repeat.set(1500, 1500);

  ground = new THREE.Mesh(
    new THREE.CircleGeometry(4000, 30),
    new THREE.MeshPhongMaterial({
      map: gmap.start,
      transparent: true,
      opacity: 1,
      color: 0xf2f2f2,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -8;
  ground.receiveShadow = true;
  scene.add(ground);

  ground1 = new THREE.Mesh(
    new THREE.CircleGeometry(4000, 30),
    new THREE.MeshPhongMaterial({
      map: gmap.big,
      color: 0xf2f2f2,
    })
  );
  ground1.rotation.x = -Math.PI / 2;
  ground1.position.y = -8;
  ground1.receiveShadow = false;
  ground1.layers.enable(1);
  scene.add(ground1);
  ground1.visible = false;

  const renderScene = new THREE.RenderPass(scene, camera); //bloom
  const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight)
  );
  bloomPass.threshold = 0;
  bloomPass.strength = 1.2;
  bloomPass.radius = 0.5;
  bloomComposer = new THREE.EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  const finalPass = new THREE.ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture },
      },
      vertexShader: vertexShaderText,
      fragmentShader: fragmentShaderText,
      defines: {},
    }),
    "baseTexture"
  );
  finalPass.needsSwap = true;
  finalComposer = new THREE.EffectComposer(renderer);
  finalComposer.addPass(renderScene);
  finalComposer.addPass(finalPass);

  loadModel("res/model/Pillar.glb", "pillar");
  loadModel("res/model/Door.glb", "door");
  loadModel("res/model/mark.glb", "mark");

  scene.add(
    new THREE.Mesh(
      new THREE.SphereBufferGeometry(4000, 60, 40).scale(-1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(10,60,80)"),
        transparent: true,
        opacity: 0.8,
        map: new THREE.TextureLoader().load("res/img/sky.jpg"),
      })
    )
  );

  if (!isMobile()) {
    var cloud = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20, 1),
      new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: 0.1,
        map: new THREE.TextureLoader().load("res/img/cloudSml.png"),
      })
    );

    for (var i = 0; i < 5; ++i) {
      for (var j = 0; j < cloud_pos[i].length; ++j) {
        var cloudParticle = cloud.clone();
        cloudParticle.position.set(cloud_pos[i][j][0], cloud_pos[i][j][1], cloud_pos[i][j][2]);
        cloudParticle.scale.set(cloud_scale[i][j][0], cloud_scale[i][j][1], cloud_scale[i][j][2]);
        cloudParticle.rotation.set(0, 0, cloud_rot[i][j]);
        cloudParticle.material.opacity = cloud_rot[i][j] / 30;
        scene.add(cloudParticle);
      }
    }
  }
}

function buildLight() {
  var hemiLight = new THREE.HemisphereLight(0xffffff);
  hemiLight.intensity = 0.3;
  scene.add(hemiLight);

  light.white = new THREE.PointLight(0xffffff, 50, 100); // main white Pointlight
  light.white.position.set(-14.28, 10, -32.45);
  light.white.distance = 1000;
  light.white.shadow.camera.far = 1000;
  light.white.castShadow = true;
  scene.add(light.white);

  light.blue = new THREE.PointLight(0x2266ff, 60, 100); // main blue Pointlight
  light.blue.position.set(-14.28, 10, -32.45);
  light.blue.distance = 1000;
  light.blue.shadow.camera.far = 1000;
  light.blue.castShadow = true;
  scene.add(light.blue);

  light.sub = new THREE.PointLight(0xffffff, 30, 30); // for black side (belongs to main)
  light.sub.position.set(-7.167, -15.837, 15.2);
  light.sub.distance = 1000;
  light.sub.castShadow = true;
  scene.add(light.sub);

  THREE.RectAreaLightUniformsLib.init();
  light.door.up = new THREE.RectAreaLight(0xffffff, 1, 0.2, 0.1); // light the door
  light.door.up.intensity = 30;
  light.door.up.position.set(-5.19, -7.5, 59.36); //(-5.24, -7.5, 59.34)
  light.door.up.rotation.set(-0.993, -0.064, 0.238); //(-0.983, -0.064, 0.238);
  scene.add(light.door.up);

  light.door.mark = new THREE.PointLight(0x66bbff, 1, 0.08);
  scene.add(light.door.mark);

  light.door.down = new THREE.PointLight(0xffffff, 0.3, 10);
  light.door.down.position.set(-5.161, -8, 59.44);
  scene.add(light.door.down);

  light.mark.front = new THREE.PointLight(0xffffff, 5, 5);
  light.mark.front.position.set(-38.2, 201, 52);
  scene.add(light.mark.front);
}

createSceneObjects();
bindEventListeners();

function render() {
  if (isPortrait()) camera.zoom = 0.8;
  scene.traverse(darkenNonBloomed);
  bloomComposer.render();
  scene.traverse(restoreMaterial);
  finalComposer.render();
  TWEEN.update();
  requestAnimationFrame(render);
}

window.addEventListener("resize", () => {
  if (window.innerWidth / window.innerHeight < 2.3) {
    camera.zoom = 1;
  } else {
    camera.zoom = 2;
  }
  camera.updateProjectionMatrix();
});

function anim_start() {
  camera.position.set(-10, -6, 1000);
  camera.rotation.set(0.1, 0, 0);
  scene.add(camera);
  var _move = new TWEEN.Tween(camera.position).to({ x: -5.26, y: -7.8, z: 200 }, 3200).start();
  var _move1 = new TWEEN.Tween(camera.position)
    .to({ x: -5.26, y: -7.85, z: 59.9 }, 2500)
    .easing(TWEEN.Easing.Sinusoidal.Out)
    .onComplete(function () {
      anim1();
      ground.material.map = gmap.small;
    });
  // var _rot1 = new TWEEN.Tween(camera.rotation).to({ x: 0, y: -0.2, z: 0 }, 2500);
  var _rot1 = new TWEEN.Tween(camera.rotation).to({ x: 0, y: -0.15, z: 0 }, 2500);
  _move.chain(_move1, _rot1);
}

function anim1() {
  camera.position.set(-5.26, -7.85, 59.9);
  // camera.rotation.set(0, -0.2, 0);
  camera.rotation.set(0, -0.15, 0);

  let _pivot = new THREE.Object3D();
  scene.add(_pivot);
  _pivot.position.set(-5.3, -7.85, 59.8);
  _pivot.attach(camera);

  //reset door mark light position
  light.door.mark.position.set(-5.161, -7.81, 59.44);
  light.door.mark.rotation.set(0, -0.2, 0);

  var _increase = 0;

  var light_move = new TWEEN.Tween({ n: 0 })
    .to({ n: 10 }, 2500)
    .onUpdate((v) => {
      _increase = Math.pow(v.n, 2) / 1000;
      light.door.mark.position.x -= 0.00136;
      light.door.mark.position.y = -7.81 + _increase;
    })
    .delay(1000)
    .start();

  var _rot = new TWEEN.Tween({ n: 0 })
    .to({ n: 10 }, 1200)
    .easing(TWEEN.Easing.Sinusoidal.Out)
    .delay(1000)
    .start()

    .onUpdate(function (v) {
      _pivot.rotation.y -= 0.003;
      _pivot.position.x -= 0.002;
    })
    .onComplete(function () {
      scene.attach(camera);
    });

  //going backward
  var _move = new TWEEN.Tween(camera.position)
    .to({ x: -7.5, y: -7.8, z: 63.0 }, 1800)
    .easing(TWEEN.Easing.Cubic.In)
    .onComplete(() => {
      camera.rotation.set(-0.6990761322621899, -0.4948128070467265, -0.3692685754171754);
      ground.visible = false;
      ground1.visible = true;
    });
  _rot.chain(_move);

  //start going up
  // var rot_pos = { x: -1.1953756, y: -0.2607656863, z: -0.5793078735485787 };
  var rot_pos = { x: -1.1776, y: -0.2592, z: -0.5535 };
  var _rot2_started = false;

  var _rot2 = new TWEEN.Tween(rot_pos)
    .to({ x: -0.37, y: -0.65, z: -0.23 }, 3750)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .onUpdate(() => {
      camera.rotation.x = rot_pos.x;
      camera.rotation.y = rot_pos.y;
      camera.rotation.z = rot_pos.z;
    });

  var _pos = { x: -7.5, y: -7.8, z: 63 };
  var _move2 = new TWEEN.Tween(_pos)
    .to({ x: -73.17, y: 280.78, z: 138.22 }, 5000)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .onUpdate((pos) => {
      camera.position.set(pos.x, pos.y, pos.z);
      if (pos.y < 30) {
        // camera.lookAt(-5.28, -7.8, 58);
        camera.lookAt(-5.28, -7.8, 57.25);
      } else {
        if (!_rot2_started) {
          _rot2.start();
          _rot2_started = true;
        }
      }
    });
  _move.chain(_move2);

  var _rot3 = new TWEEN.Tween({ x: 1 })
    .to({ x: 100 }, 2500)
    .onStart(function () {
      _pivot.position.set(-10, 500, 50);
      _pivot.attach(camera);
      ground.material.map = gmap.big;
    })
    .onUpdate(function () {
      _pivot.rotation.y += 0.001;
      _pivot.position.z += 0.01;
    })
    .onComplete(function () {
      scene.attach(camera);
      scene.remove(_pivot);
    });
  _move2.chain(_rot3);

  var _move4 = new TWEEN.Tween(camera.position)
    .to({ x: -38, y: 200, z: 57 }, 2000)
    .easing(TWEEN.Easing.Quadratic.InOut);
  var _rot4 = new TWEEN.Tween(camera.rotation)
    .to({ x: 0, y: -0.37, z: 0 }, 2000)
    .easing(TWEEN.Easing.Quadratic.InOut);
  _rot3.chain(_move4, _rot4);
}

function anim_content() {
  camera_pos = 1;
  camera.position.set(-38, 200, 57);
  camera.rotation.set(0, -0.37, 0);

  var _move = new TWEEN.Tween(camera.position).to({ x: -10, z: 64 }, 800).start();
  var _rot = new TWEEN.Tween(camera.rotation).to({ y: 0.1 }, 800).start();

  var tilt = new TWEEN.Tween(camera.rotation)
    .to({ z: 0.1 }, 800)
    .delay(1200)
    .chain(new TWEEN.Tween(camera.rotation).to({ z: 0 }, 800));

  var _move1 = new TWEEN.Tween(camera.position).to({ z: -60 }, 2000);
  var _rot1 = new TWEEN.Tween(camera.rotation)
    .to({ y: Math.PI / 2 }, 800)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .delay(1200);
  _move.chain(_move1, _rot1, tilt);

  var _move2 = new TWEEN.Tween(camera.position)
    .to({ x: -50, z: -56 }, 2000)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  var _rot2 = new TWEEN.Tween(camera.rotation)
    .to({ y: 3.8 }, 2000)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .onComplete(() => {
      $("#pdfBtn").show();
    });
  _rot1.chain(_move2, _rot2);
}

function anim_content_back() {
  camera_pos = 0;
  camera.position.set(-50, 200, -56);
  camera.rotation.set(0, 3.8, 0);
  // $("#pdfBtn").hide();
  var _move = new TWEEN.Tween(camera.position)
    .to({ x: -15, z: -62 }, 1000)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .start();
  var _rot = new TWEEN.Tween(camera.rotation)
    .to({ y: 3.14 })
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .start();

  var _move1 = new TWEEN.Tween(camera.position).to({ z: 57 }, 1500);
  var _rot1 = new TWEEN.Tween(camera.rotation)
    .to({ y: -0.37 }, 1500)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  var _move2 = new TWEEN.Tween(camera.position)
    .to({ x: -38 }, 1000)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  _move.chain(_move1);
  _move1.chain(_rot1, _move2);
}

function anim_content_top() {
  camera.position.set(-50, 200, -56);
  camera.rotation.set(0, 3.8, 0);
  light.sub.intensity = 1;

  var _pivot = new THREE.Object3D();
  scene.add(_pivot);
  _pivot.name = "pivot for candidate";
  _pivot.position.set(0, 200, 0);
  _pivot.attach(camera);

  var _move = new TWEEN.Tween(_pivot.position)
    .to({ y: 300 }, 1000)
    .easing(TWEEN.Easing.Quadratic.In)
    .start()
    .onUpdate(function () {
      _pivot.rotation.y -= 0.035;
      camera.lookAt(0, 200, 0);
      camera.position.x -= 0.5;
      camera.position.z += 0.3;
    })
    .onComplete(() => {
      scene.attach(camera);
      scene.remove(_pivot);
      camera.position.set(74.9038718969706, 300, -47.863869200496424);
      camera.rotation.set(-2.0124558046620526, 0.5951486221973679, 2.2714175905316263);

      pillar.material.color.set("rgb(1,7,12)");

      if (isPortrait()) {
        var _move1 = new TWEEN.Tween(camera.position)
          .to({ x: -39.41, y: 572.79, z: 141.04 }, 1000)
          .start();
        var _rot1 = new TWEEN.Tween(camera.rotation)
          .to({ x: -1.34, y: -0.077, z: -0.316 }, 1000)
          .start()
          .onComplete(() => {
            topPosCorrection();
          });
      } else {
        var _move1 = new TWEEN.Tween(camera.position)
          .to({ x: -19.43, y: 428.5, z: 111.8 }, 1000)
          .start();
        var _rot1 = new TWEEN.Tween(camera.rotation)
          .to({ x: -1.2, y: -0.27, z: -0.6 }, 1000)
          .start()
          .onComplete(() => {
            topPosCorrection();
          });
      }
    });
}

function anim_content_top_back() {
  clearInterval(top_interval);

  if (isMobile() && isPortrait()) {
    camera.position.set(-39.41, 572.79, 141.04);
    camera.rotation.set(-1.34, -0.077, -0.316);
  } else {
    camera.position.set(-19.43, 428.5, 111.8);
    camera.rotation.set(-1.2, -0.27, -0.6);
  }
  var _move = new TWEEN.Tween(camera.position)
    .to(
      {
        x: 74.9038718969706,
        y: 300,
        z: -47.863869200496424,
      },
      1000
    )
    .start();
  var _rot1 = new TWEEN.Tween(camera.rotation)
    .to(
      {
        x: -2.0124558046620526,
        y: 0.5951486221973679,
        z: 2.2714175905316263,
      },
      1000
    )
    .start()
    .onComplete(() => {
      pillar.material.color.set("rgb(0,150,230)");
      var _pivot = new THREE.Object3D();
      _pivot.position.set(0, 300, 0);
      _pivot.rotation.set(0, -2.0299999999999985, 0);
      _pivot.name = "pivot";
      scene.add(_pivot);
      _pivot.attach(camera);
      var _move1 = new TWEEN.Tween(_pivot.position)
        .to({ y: 200 }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()
        .onUpdate(function () {
          _pivot.rotation.y += 0.035;
          camera.lookAt(0, 200, 0);
          camera.position.x += 0.5;
          camera.position.z -= 0.3;
        })
        .onComplete(() => {
          scene.attach(camera);
          scene.remove(_pivot);
          light.sub.intensity = 30;

          camera.position.set(-50, 200, -56);
          camera.rotation.set(0, 3.8, 0);
        });
    });
}

function anim_clients() {
  camera_pos = 2;
  camera.position.set(-38, 200, 57);
  camera.rotation.set(0, -0.37, 0);
  var _move = new TWEEN.Tween(camera.position).to({ x: -10, z: 64 }, 600).start();
  var _rot = new TWEEN.Tween(camera.rotation).to({ y: 0.1 }, 600).start();

  var tilt1 = new TWEEN.Tween(camera.rotation)
    .to({ z: -0.2 }, 500)
    .delay(500)
    .chain(new TWEEN.Tween(camera.rotation).to({ z: 0 }, 500));

  var _move1 = new TWEEN.Tween(camera.position).to({ z: 3.5 }, 1000);
  var _rot1 = new TWEEN.Tween(camera.rotation)
    .to({ y: -Math.PI / 2 - 0.05 }, 400)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .delay(600);
  _move.chain(_move1, _rot1, tilt1);

  var _move2 = new TWEEN.Tween(camera.position)
    .to({ x: 65 }, 1500)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  var _rot2 = new TWEEN.Tween(camera.rotation)
    .to({ y: -Math.PI }, 500)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .delay(1000);
  _move1.chain(_move2, _rot2);
  var _move3 = new TWEEN.Tween(camera.position)
    .to({ z: 30 }, 1000)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  var _rot3 = new TWEEN.Tween(camera.rotation)
    .to({ y: (-Math.PI * 3) / 2 - 0.25 }, 1000)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  _move2.chain(_move3, _rot3);
}

function anim_clients_back() {
  camera_pos = 0;
  camera.position.set(65, 200, 30);
  camera.rotation.set(0, (-Math.PI * 3) / 2 - 0.25, 0);
  var _move = new TWEEN.Tween(camera.position)
    .to({ z: 3.5 }, 1000)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .start();
  var _rot = new TWEEN.Tween(camera.rotation)
    .to({ y: -4.65 }, 800)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .start();

  var tilt1 = new TWEEN.Tween(camera.rotation)
    .to({ z: -0.1 }, 500)
    .delay(500)
    .chain(new TWEEN.Tween(camera.rotation).to({ z: 0 }, 500));

  var _move1 = new TWEEN.Tween(camera.position)
    .to({ x: -10 }, 1000)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  var _rot1 = new TWEEN.Tween(camera.rotation)
    .to({ y: -Math.PI - 0.1 }, 300)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  _rot1.delay(700);
  _move.chain(_move1, _rot1, tilt1);

  var _move2 = new TWEEN.Tween(camera.position)
    .to({ z: 70 }, 1500)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  var _rot2 = new TWEEN.Tween(camera.rotation)
    .to({ y: -Math.PI * 2 - 0.37 }, 1200)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .delay(1000);
  _move1.chain(_move2, _rot2);
  var _move3 = new TWEEN.Tween(camera.position)
    .to({ x: -38, z: 57 }, 300)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  _move2.chain(_move3);
}

function anim_clients_top() {
  camera.position.set(65, 200, 30);
  camera.rotation.set(0, (-Math.PI * 3) / 2 - 0.25, 0);
  light.sub.intensity = 1;

  var _pivot = new THREE.Object3D();
  _pivot.name = "pivot";
  scene.add(_pivot);
  _pivot.name = "pivot for candidate";
  _pivot.position.set(0, 200, 0);
  _pivot.attach(camera);

  var _move = new TWEEN.Tween(_pivot.position)
    .to({ y: 280 }, 600)
    .easing(TWEEN.Easing.Quadratic.In)
    .start()
    .onUpdate(function () {
      _pivot.rotation.y -= 0.01;
      camera.lookAt(0, 200, 0);
      camera.position.x += 0.2;
      camera.position.z += 0.2;
    })
    .onComplete(() => {
      pillar.material.color.set("rgb(1,7,12)");
      scene.attach(camera);
      scene.remove(_pivot);
      camera.position.set(53.97608266638738, 280, 61.04999999992905);
      camera.rotation.set(-0.9209955165556805, 0.4920807703372609, 0.5562579715269997);
      if (isMobile() && isPortrait()) {
        var _move1 = new TWEEN.Tween(camera.position)
          .to({ x: -39.41, y: 572.79, z: 141.04 }, 1000)
          .start();
        var _rot1 = new TWEEN.Tween(camera.rotation)
          .to({ x: -1.34, y: -0.077, z: -0.316 }, 1000)
          .start()
          .onComplete(() => {
            topPosCorrection();
          });
      } else {
        var _move1 = new TWEEN.Tween(camera.position)
          .to({ x: -19.43, y: 428.5, z: 111.8 }, 800)
          .start();
        var _rot1 = new TWEEN.Tween(camera.rotation)
          .to({ x: -1.2, y: -0.27, z: -0.6 }, 800)
          .start()
          .onComplete(() => {
            topPosCorrection();
          });
      }
    });
}

function anim_clients_top_back() {
  clearInterval(top_interval);

  if (isMobile() && isPortrait()) {
    camera.position.set(-39.41, 572.79, 141.04);
    camera.rotation.set(-1.34, -0.077, -0.316);
  } else {
    camera.position.set(-19.43, 428.5, 111.8);
    camera.rotation.set(-1.2, -0.27, -0.6);
  }

  var _move = new TWEEN.Tween(camera.position)
    .to(
      {
        x: 53.97608266638738,
        y: 280,
        z: 61.04999999992905,
      },
      800
    )
    .start();
  var _rot1 = new TWEEN.Tween(camera.rotation)
    .to(
      {
        x: -0.9209955165556805,
        y: 0.4920807703372609,
        z: 0.5562579715269997,
      },
      800
    )
    .start()
    .onComplete(() => {
      pillar.material.color.set("rgb(0,150,230)");
      var _pivot = new THREE.Object3D();
      _pivot.position.set(0, 280, 0);
      _pivot.rotation.set(0, -0.37000000000000016, 0);
      _pivot.name = "pivot";
      scene.add(_pivot);
      _pivot.attach(camera);
      var _move1 = new TWEEN.Tween(_pivot.position)
        .to({ y: 200 }, 600)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()
        .onUpdate(function () {
          _pivot.rotation.y += 0.01;
          camera.lookAt(0, 200, 0);
          camera.position.x -= 0.2;
          camera.position.z -= 0.2;
        })
        .onComplete(() => {
          scene.attach(camera);
          scene.remove(_pivot);
          light.sub.intensity = 30;
          camera.position.set(65, 200, 30);
          camera.rotation.set(0, (-Math.PI * 3) / 2 - 0.25, 0);
        });
    });
}

function anim_candidate() {
  camera_pos = 3;
  camera.position.set(-38, 200, 57);
  camera.rotation.set(0, -0.37, 0);
  var _move = new TWEEN.Tween(camera.position).to({ x: -10, z: 64 }, 500).start();
  var _rot = new TWEEN.Tween(camera.rotation).to({ y: 0.1 }, 500).start();

  var tilt1 = new TWEEN.Tween(camera.rotation)
    .to({ z: -0.2 }, 500)
    .delay(800)
    .chain(new TWEEN.Tween(camera.rotation).to({ z: 0 }, 500));

  var _move1 = new TWEEN.Tween(camera.position)
    .to({ z: -30 }, 1200)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  var _rot1 = new TWEEN.Tween(camera.rotation)
    .to({ y: -Math.PI / 2 - 0.08 }, 300)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .delay(900);
  _move.chain(_move1, _rot1, tilt1);

  var _move2 = new TWEEN.Tween(camera.position)
    .to({ x: 58 }, 1500)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  var _rot2 = new TWEEN.Tween(camera.rotation)
    .to({ y: 1 }, 500)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .delay(1000);
  _move1.chain(_move2, _rot2);

  var _move3 = new TWEEN.Tween(camera.position)
    .to({ z: -60 }, 800)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .onUpdate(function () {
      camera.position.x -= 0.3;
    });
  var _rot3 = new TWEEN.Tween(camera.rotation)
    .to({ y: 2.35 }, 800)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  _move2.chain(_move3, _rot3);
}

function anim_candidate_back() {
  camera_pos = 0;
  camera.position.set(45.8, 200, -60);
  camera.rotation.set(0, 2.35, 0);
  var _move = new TWEEN.Tween(camera.position)
    .to({ z: -30 }, 1000)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .start()
    .onUpdate(function () {
      camera.position.x += 0.2;
    });
  var _rot = new TWEEN.Tween(camera.rotation)
    .to({ y: 1.69 }, 800)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .start();

  var tilt1 = new TWEEN.Tween(camera.rotation)
    .to({ z: 0.2 }, 500)
    .delay(600)
    .chain(new TWEEN.Tween(camera.rotation).to({ z: 0 }, 500));

  var _move1 = new TWEEN.Tween(camera.position)
    .to({ x: -10 }, 1200)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  var _rot1 = new TWEEN.Tween(camera.rotation)
    .to({ y: 3.08 }, 300)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .delay(900);
  _move.chain(_move1, _rot1, tilt1);

  var _move2 = new TWEEN.Tween(camera.position)
    .to({ z: 60 }, 1500)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  _move1.chain(_move2);

  var _rot2 = new TWEEN.Tween(camera.rotation)
    .to({ y: -0.37 }, 1000)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  var _move_ = new TWEEN.Tween(camera.position)
    .to({ x: -38, z: 57 }, 600)
    .easing(TWEEN.Easing.Sinusoidal.InOut);
  _move2.chain(_rot2, _move_);
}

function anim_candidate_top() {
  camera.position.set(45.8, 200, -60);
  camera.rotation.set(0, 2.35, 0);
  light.sub.intensity = 1;
  // $("#pdfBtn").hide();

  var _pivot = new THREE.Object3D();
  _pivot.name = "pivot";
  scene.add(_pivot);
  _pivot.name = "pivot for candidate";
  _pivot.position.set(0, 200, 0);
  _pivot.attach(camera);

  var _move = new TWEEN.Tween(_pivot.position)
    .to({ y: 300 }, 1000)
    .easing(TWEEN.Easing.Quadratic.In)
    .start()
    .onUpdate(function () {
      _pivot.rotation.y -= 0.015;
      camera.lookAt(0, 200, 0);
      camera.position.x += 0.5;
      camera.position.z += 0.3;
    })
    .onComplete(() => {
      pillar.material.color.set("rgb(1,7,12)");
      scene.attach(camera);
      scene.remove(_pivot);
      camera.position.set(79.57688077817748, 300, 35.04425838301818);
      camera.rotation.set(-1.2388952252825272, 0.6445912708539492, 1.0500269045892787);
      if (isMobile() && isPortrait()) {
        var _move1 = new TWEEN.Tween(camera.position)
          .to({ x: -39.41, y: 572.79, z: 141.04 }, 1000)
          .start();
        var _rot1 = new TWEEN.Tween(camera.rotation)
          .to({ x: -1.34, y: -0.077, z: -0.316 }, 1000)
          .start()
          .onComplete(() => {
            topPosCorrection();
          });
      } else {
        var _move1 = new TWEEN.Tween(camera.position)
          .to({ x: -19.43, y: 428.5, z: 111.8 }, 800)
          .start();
        var _rot1 = new TWEEN.Tween(camera.rotation)
          .to({ x: -1.2, y: -0.27, z: -0.6 }, 800)
          .start()
          .onComplete(() => {
            topPosCorrection();
          });
      }
    });
}

function anim_candidate_top_back() {
  clearInterval(top_interval);

  if (isMobile() && isPortrait()) {
    camera.position.set(-39.41, 572.79, 141.04);
    camera.rotation.set(-1.34, -0.077, -0.316);
  } else {
    camera.position.set(-19.43, 428.5, 111.8);
    camera.rotation.set(-1.2, -0.27, -0.6);
  }

  var _move = new TWEEN.Tween(camera.position)
    .to(
      {
        x: 79.57688077817748,
        y: 300,
        z: 35.04425838301818,
      },
      1000
    )
    .start();
  var _rot1 = new TWEEN.Tween(camera.rotation)
    .to(
      {
        x: -1.2388952252825272,
        y: 0.6445912708539492,
        z: 1.0500269045892787,
      },
      1000
    )
    .start()
    .onComplete(() => {
      pillar.material.color.set("rgb(0,150,230)");
      var _pivot = new THREE.Object3D();
      _pivot.name = "pivot";
      _pivot.position.set(0, 300, 0);
      _pivot.rotation.set(0, -0.9150000000000007, 0);
      scene.add(_pivot);
      _pivot.attach(camera);
      var _move1 = new TWEEN.Tween(_pivot.position)
        .to({ y: 200 }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()
        .onUpdate(function () {
          _pivot.rotation.y += 0.015;
          camera.lookAt(0, 200, 0);
          camera.position.x -= 0.5;
          camera.position.z -= 0.3;
        })
        .onComplete(() => {
          scene.attach(camera);
          scene.remove(_pivot);
          light.sub.intensity = 30;
          camera.position.set(45.8, 200, -60);
          camera.rotation.set(0, 2.4, 0);
        });
    });
}

function anim_down() {
  if (isPortrait()) {
    camera.position.set(-17.499584230475314, 640.1, 187.500038711304);
    camera.rotation.set(-1.226319260222524, -0.11498077745995597, -0.3094938249958649);
  } else {
    camera.position.set(-19.43, 428.5, 111.8); // good
    camera.rotation.set(-1.2, -0.27, -0.6);
  }

  var _move = new TWEEN.Tween(camera.position)
    .to({ x: -38, y: 200, z: 57 }, 1200)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .start();

  var _rot = new TWEEN.Tween(camera.rotation)
    .to({ x: 0, y: -0.37, z: 0 }, 500)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .delay(700)
    .start();
}

function mark_forward() {
  if (mark.ring.parent !== mark) {
    mark.ring.position.copy(mark.body.position);
    mark.ring.position.x += 0.004;
    mark.ring.position.y += 0.03;
    mark.ring.rotation.y = -0.1;
    mark.ring.scale.set(1.04, 1.04, 1.04);
    mark.body.attach(mark.ring);
  }
  clearInterval(top_interval);
  var dest_scale = isMobile() ? 0.15 : 0.2;
  camera.position.set(-38, 200, 57);
  camera.rotation.set(0, -0.37, 0);
  mark.body.visible = true;
  if (isPortrait()) {
    mark.body.position.set(mark.pos.x + 3, mark.pos.y + 0.5, 50);
  } else {
    mark.body.position.set(mark.pos.x, mark.pos.y, 50);
  }

  mark.body.rotation.set(0, -0.37 - Math.PI, 0);
  mark.body.scale.set(0.01, 0.01, 0.01);

  var _move = new TWEEN.Tween(mark.body.position)
    .to(
      {
        x: -37 + (isPortrait() ? 1.55 : 0),
        y: 200 + (isPortrait() ? 1.2 : 1),
        z: 50,
      },
      1200
    )
    .easing(TWEEN.Easing.Sinusoidal.Out)
    .start();

  var _scale = new TWEEN.Tween(mark.body.scale)
    .to(
      {
        x: isPortrait() ? dest_scale : 0.2,
        y: isPortrait() ? dest_scale : 0.2,
        z: isPortrait() ? dest_scale : 0.2,
      },
      1200
    )
    .easing(TWEEN.Easing.Sinusoidal.Out)
    .start();

  var _rot = new TWEEN.Tween(mark.body.rotation)
    .to({ x: 0, y: -0.37, z: 0 }, 1200)
    .easing(TWEEN.Easing.Sinusoidal.Out)
    .start()
    .onComplete(() => {
      // start of light animation
      mark.ring.visible = true;
      mark_light_animation();
    });
}

function mark_backward() {
  clearInterval(mark_interval);
  camera.position.set(-38, 200, 57);
  camera.rotation.set(0, -0.37, 0);
  bloomComposer.passes[1].strength = 1.5;
  mark.body.visible = true;
  mark.ring.visible = false;
  var _move = new TWEEN.Tween(mark.body.position)
    .to(
      {
        x: mark.pos.x + (isPortrait() ? 3 : 0),
        y: mark.pos.y + (isPortrait() ? 0.5 : 0),
        z: 50,
      },
      1200
    )
    .easing(TWEEN.Easing.Sinusoidal.In)
    .start();

  var _scale = new TWEEN.Tween(mark.body.scale)
    .to({ x: 0.01, y: 0.01, z: 0.01 }, 1200)
    .easing(TWEEN.Easing.Sinusoidal.In)
    .start();
  var _rot = new TWEEN.Tween(mark.body.rotation)
    .to({ x: 0, y: -0.37 - Math.PI, z: 0 }, 1200)
    .easing(TWEEN.Easing.Sinusoidal.In)
    .start()
    .onComplete(() => {
      mark.body.visible = false;
      switch (camera_pos) {
        case 1:
          camera.position.set(-50, 200, -56);
          camera.rotation.set(0, 3.8, 0);
          break;
        case 2:
          camera.position.set(65, 200, 30);
          camera.rotation.set(0, (-Math.PI * 3) / 2 - 0.25, 0);
          break;
        case 3:
          camera.position.set(45.8, 200, -60);
          camera.rotation.set(0, 2.4, 0);
          break;
      }
    });
}

function mark_light_animation() {
  var strength = 0;
  var effect_direct = 1;
  mark_interval = setInterval(function () {
    if (isMobile()) markPosCorrection();
    strength += 0.1 * effect_direct;
    bloomComposer.passes[1].strength = strength;
    if (strength > 8) effect_direct = -1;
    if (strength < -5) effect_direct = 1;
  }, 20);
}

//mobile portait and landscape for mark
function markPosCorrection() {
  if (isMobile()) {
    light.mark.front.position.set(isPortrait() ? -36.4 : -38.2, 201.2, isPortrait() ? 53 : 52);
  }

  mark.body.position.set(-37 + (isPortrait() ? 1.55 : 0), 200 + (isPortrait() ? 1.2 : 1), 50);

  mark.body.scale.set(
    isPortrait() ? 0.15 : 0.2,
    isPortrait() ? 0.15 : 0.2,
    isPortrait() ? 0.15 : 0.2
  );
}

//mobile portait and landscape for top pos
function topPosCorrection() {
  top_interval = setInterval(function () {
    if (isPortrait()) {
      camera.position.set(-39.41, 572.79, 141.04);
      camera.rotation.set(-1.34, -0.077, -0.316);
    } else {
      camera.position.set(-19.43, 428.5, 111.8); // good
      camera.rotation.set(-1.2, -0.27, -0.6);
    }
  }, 50);
}

function darkenNonBloomed(obj) {
  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    materials[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial(obj) {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
}
