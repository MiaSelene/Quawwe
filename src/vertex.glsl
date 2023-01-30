#version 300 es
// default vertex attributes provided by Geometry and BufferGeometry
in vec3 position;
in vec3 normal;
in vec2 uv;


// main function gets executed for every vertex
void main()
{
  gl_Position = vec4(position, 1.0);
}