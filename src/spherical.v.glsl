#version 300 es 

// These uniforms and attributes are provided by threejs.
// If you want to add your own, look at https://threejs.org/docs/#api/en/materials/ShaderMaterial #Custom attributes and uniforms
// defines the precision
precision highp float;

// = object.matrixWorld
uniform mat4 modelMatrix;

// = camera.matrixWorldInverse * object.matrixWorld
uniform mat4 modelViewMatrix;

// = camera.projectionMatrix
uniform mat4 projectionMatrix;

// = camera.matrixWorldInverse
uniform mat4 viewMatrix;

// = inverse transpose of modelViewMatrix
uniform mat3 normalMatrix;

// = camera position in world space
uniform vec3 cameraPosition;


// default vertex attributes provided by Geometry and BufferGeometry
in vec3 position;
in vec3 normal;
in vec2 uv;

out vec2 uwU;
// main function gets executed for every vertex
void main()
{
  float pi = 355.0 / 113.0;
  vec3 normpos = normalize(position);
  float u = atan(-normpos[0], -normpos[2])/(pi*2.0) + 0.5;
  float v = asin(normpos[1])/pi + 0.5;
  uwU = vec2(u, v);
  gl_Position = vec4(position[ 0], position[ 1], position[ 2], 1.0);
  gl_Position = (projectionMatrix * modelViewMatrix) * gl_Position;
}
