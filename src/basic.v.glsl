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

uniform float delta;

// default vertex attributes provided by Geometry and BufferGeometry
in vec3 position;
in vec3 normal;
in vec2 uv;

out vec2 uwU;
// main function gets executed for every vertex
void main()
{
  uwU = uv;
  if(position[1]< -0.5) {
     gl_Position = vec4(position[0], position[ 1], position[ 2], 1.0)
     +vec4(-0.5, 0, 0.0, 0.0)*delta*(-position[1])
     +vec4(0, -0.5, 0.0, 0.0)*(delta+0.5)*(-position[1])
     +vec4(0, 0, 0.5, 0)*(delta+0.25)*(-position[1]);
  }
  else {
     gl_Position = vec4(position[ 0], position[ 1], position[ 2], 1.0);
  }
  //gl_Position = vec4(position[ 0], position[ 1], position[ 2], 1.0)+vec4(-0.5, 0, 0.0, 0.0)*delta;
  gl_Position = (projectionMatrix * modelViewMatrix) * gl_Position;
}
