import fragment from './shader/fragment.glsl';
import vertex from './shader/vertex.glsl';

global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  animate: true,
  duration: 10,
  attributes: { antialias: true },
  context: "webgl",
};

const sketch = ({ context }) => {

  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  renderer.setClearColor("#000", 1);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -1);
  camera.lookAt(new THREE.Vector3());

  const controls = new THREE.OrbitControls(camera, context.canvas);

  const scene = new THREE.Scene();

  const numberOfShapes = 1000;
  const shape = new THREE.Shape();
  shape.moveTo( 0., 0.2)
  for (let i = 0; i <= numberOfShapes; i++) {
    const theta = 2 * Math.PI * i / numberOfShapes;
    const radius = 0.2 + 0.2 * Math.sin(2 * theta)**2;
    const x = radius * Math.sin(theta);
    const y = radius * Math.cos(theta);
    shape.lineTo(x, y)
  }

	const extrudeSettings = {
		steps: 150,
		depth: 40,
		bevelEnabled: false,
	};

	const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

  const material = new THREE.ShaderMaterial({
		side: THREE.DoubleSide,
		uniforms: {
			time: {type: 'f', value: 0},
			playhead: {type: 'f', value: 0},
		},
		fragmentShader: fragment,
		vertexShader: vertex,
    // wireframe: true,
	});

  const mesh = new THREE.Mesh(geometry, material);
	mesh.position.z = -1;
  scene.add(mesh);

  return {

    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },

    render({ time, playhead }) {
      mesh.position.z = -1 - playhead * 6;
      mesh.material.uniforms.playhead.value = playhead;
      controls.update();
      renderer.render(scene, camera);
    },

    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
