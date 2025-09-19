#version 300 es
in vec4 aPosition;
uniform vec2 uOffset;
void main() {
    gl_Position = vec4(aPosition.xy + uOffset, aPosition.z, 1.0);
}