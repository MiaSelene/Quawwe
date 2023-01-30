#version 300 es

// defines the precision
precision highp float;

uniform sampler2D graph;
uniform sampler2D drawing;

// we have access to the same uniforms as in the vertex shader
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

out vec4 fragColor;
in vec3 poshition;
in vec3 mormal;
// main function gets executed for every pixel
void main()
{
  float pi = 355.0 / 113.0;
  vec3 incidence = normalize( poshition - cameraPosition);
  vec3 normpos = incidence - 2.0 * (dot(incidence,mormal)) * mormal;
  float u = atan(-normpos[0], -normpos[2])/pi/2.0 + 0.5;
  float v = asin(normpos[1])/pi + 0.5;
  vec2 uwU = vec2(u, v);
  //this colors all fragments (pixels) in the same color (RGBA)
 fragColor = texture(drawing, uwU) + texture(graph, uwU);
  
  //fragColor = vec4(texture[int(uwU[0])][int(uwU[2])], 1.0) ;
}
