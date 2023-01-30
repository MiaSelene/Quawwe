// external dependencies
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// local from us provided utilities
import * as utils from './lib/utils';
import RenderWidget from './lib/rendererWidget';
import { Application, createWindow } from './lib/window';

// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';
import ImageWidget from './imageWidget';



import uvVertexShader from './basic.v.glsl?raw';
import uvFragmentShader from './basic.f.glsl?raw';

import SphericalVertexShader from './spherical.v.glsl?raw';
import SphericalFragmentShader from './spherical.f.glsl?raw';

import SphericalFixVertexShader from './fixed.v.glsl?raw';
import SphericalFixFragmentShader from './fixed.f.glsl?raw';

import EnvironemntReflectionVertexShader from './environment.v.glsl?raw';
import EnvironemntReflectionFragmentShader from './environment.f.glsl?raw';


var ImgWid : ImageWidget;
var object : THREE.Mesh;
var textureUsed : string;
var texture : THREE.Texture;
var currVertexShader = uvVertexShader;
var currFragmentShader = uvFragmentShader;
var scene : THREE.Scene;
var environment = false;

// taken and modified from https://threejs.org/docs/#api/en/textures/DataArrayTexture
function generateRGBConstTexture(r : number, g : number, b : number){
  const width = 512;
  const height = 512;
  const depth = 100;

  const size = width * height;
  const data = new Uint8Array( 4 * size * depth );

  for ( let i = 0; i < depth; i ++ ) {

    for ( let j = 0; j < size; j ++ ) {

      const stride = ( i * size + j ) * 4;

      data[ stride ] = r;
      data[ stride + 1 ] = g;
      data[ stride + 2 ] = b;
      data[ stride + 3 ] = 255;

    }
  }
  return new THREE.DataArrayTexture( data, width, height, depth );
}



function setTexture(Ingrid : ImageWidget, value : string){
  var path = "src/textures/earth.jpg";
  switch (value){
    case  "Earth":
      path = ("src/textures/earth.jpg");
      break;
    case "Colors":
      path = ("src/textures/colors.jpg");
      break;
    case "Disturb":
      path = ("src/textures/disturb.jpg");
      break;
    case "Checker":
      path = ("src/textures/checker.jpg");
      break;
    case "Terracotta":
      path = ("src/textures/terracotta.jpg");
      break;
    case "Plastic":
      path = ("src/textures/plastic.jpg");
      break;
    case "Wood":
      path = ("src/textures/wood_ceiling.jpg");
      break;
    case "Lava":
      path = ("src/textures/lava.jpg");
      break;
    case "Rock":
      path = ("src/textures/rock.jpg");
      break;
    case "Environment":
      path = ("src/textures/indoor.jpg");
      break;
    case "Light":
      path = ("src/textures/indoor.jpg");
      break;
  }
  if (!(object instanceof THREE.Mesh)){return;}
  if (value != textureUsed || value=="Light"){
    texture = new THREE.TextureLoader().load(path);
    textureUsed = value;
  }else if (value == "Light"){
    texture = generateRGBConstTexture(255,245,182);
  }
  const canvas = new THREE.CanvasTexture(ImgWid.DrawingCanvas);
  var newMaterial = new THREE.RawShaderMaterial( {
    uniforms: {
      graph: {value: texture}, 
      drawing: {value: canvas}
    },
    vertexShader: currVertexShader,
    fragmentShader: currFragmentShader
   });
  object.material = newMaterial;
  Ingrid.setImage(path);
  if(environment){
    scene.background = texture;
    scene.background.mapping = THREE.EquirectangularReflectionMapping;
  }
}

// https://threejs.org/docs/#api/en/core/BufferGeometry
function createQuad(){
  const geometry = new THREE.BufferGeometry();
  // create a simple square shape. We duplicate the top left and bottom right
  // vertices because each vertex needs to appear once per triangle.
  const vertices = new Float32Array( [
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,

    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0, -1.0,  1.0
  ] );

// creating uv as truncated the z dimension out of vertices then apply -1 -> 0 filter
  const uv = new Float32Array( [
    0.0, 0.0, 
    1.0, 0.0,  
    1.0,  1.0,  

    1.0,  1.0,  
    0.0,  1.0,  
    0.0, 0.0, 
  ] );
  // itemSize = 3 because there are 3 values (components) per vertex
  geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  geometry.setAttribute( 'uv', new THREE.BufferAttribute( uv, 2 ) );
  return geometry
}


function setGeometry(object : THREE.Object3D, value : String){
  if (!(object instanceof THREE.Mesh)){return;}
  switch (value){
    case  "Knot":
      object.geometry = helper.createKnot();
      break;
    case  "Sphere":
      object.geometry = helper.createSphere();
      break;
    case  "Box":
      object.geometry = helper.createBox();
      break;
    case  "Bunny":
      object.geometry = helper.createBunny();
      break;
    case  "Quad":
      object.geometry = createQuad();
      break;
  }
}


function setShader(value: string){
  console.log(value);
  if (!(object instanceof THREE.Mesh)){return;}
  switch (value){
    case  "Spherical":
      currVertexShader = SphericalVertexShader;
      currFragmentShader = SphericalFragmentShader;
      setTexture(ImgWid, textureUsed)
      break;
    case "UV attribute":
      currVertexShader = uvVertexShader;
      currFragmentShader = uvFragmentShader;
      setTexture(ImgWid, textureUsed)
      break;
    case "Spherical (fixed)":
      currVertexShader = SphericalFixVertexShader;
      currFragmentShader = SphericalFixFragmentShader;
      setTexture(ImgWid, textureUsed)
      break;
    case "Environment Mapping":
      currVertexShader = EnvironemntReflectionVertexShader;
      currFragmentShader = EnvironemntReflectionFragmentShader;
      setTexture(ImgWid, textureUsed)
      break;
  }
}



function callback(changed: utils.KeyValuePair<helper.Settings>) {
  switch (changed.key) {
    case "geometry":
      setGeometry(object, changed.value)
      break;
    case "texture":
      setTexture(ImgWid, changed.value);
      break;
    case "shader":
      setShader(changed.value);
      break;
    case "environment":
      environment = changed.value;
      if (environment){
        scene.background = texture;
        scene.background.mapping = THREE.EquirectangularReflectionMapping;
      }else{
        scene.background = new THREE.Color(0);
      }
      break;
    case "normalmap":

      break;
    default:
      break;
  }
}


function clearCanvas(){
  ImgWid.clearDrawing();
}
function main(){
  let root = Application("Texturing");
  root.setLayout([["texture", "renderer"]]);
  root.setLayoutColumns(["50%", "50%"]);
  root.setLayoutRows(["100%"]);
  // ---------------------------------------------------------------------------
  // create Settings and create GUI settings
  let settings = new helper.Settings();
  // @ts-ignore
  let gui = helper.createGUI(settings);
  // adds the callback that gets called on settings change
  settings.addCallback(callback);
  // ---------------------------------------------------------------------------
  let textureDiv = createWindow("texture");
  root.appendChild(textureDiv);

  // the image widget. Change the image with setImage
  // you can enable drawing with enableDrawing
  // and it triggers the event "updated" while drawing
  ImgWid = new ImageWidget(textureDiv);
  textureUsed = "";
  ImgWid.enableDrawing();
  // @ts-ignore
  ImgWid.DrawingCanvas.addEventListener("updated", (event) => {
    setTexture(ImgWid, textureUsed);
  });
  // ---------------------------------------------------------------------------
  // create RenderDiv
	let rendererDiv = createWindow("renderer");
  root.appendChild(rendererDiv);

  // create renderer
  let renderer = new THREE.WebGLRenderer({
      antialias: true,  // to enable anti-alias and get smoother output
  });

  // create scene
  scene = new THREE.Scene();

  // create camera
  let camera = new THREE.PerspectiveCamera();
  helper.setupCamera(camera, scene);
 
  // create controls
  let controls = new OrbitControls(camera, rendererDiv);
  helper.setupControls(controls);
  // @ts-ignore
  /*controls.addEventListener("change", (event) => {
    console.log("d");
    setTexture(ImgWid, textureUsed);
  });*/
  THREE.EquirectangularReflectionMapping
  object = new THREE.Mesh( createQuad(), new THREE.MeshBasicMaterial());
  setTexture(ImgWid, "Earth")
  scene.add(object);

  let wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
  wid.animate();

  
  settings.pen = clearCanvas;
  
}


// call main entrypoint
main();
