import { resizeAspectRatio, setupText, readShaderFile } from "../util/util.js";

// Get the canvas and WebGL 2 context
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');

if (!gl) {
    console.error('WebGl 2 is not supported by your browser.');
}

// Set initial canvas size
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Resize viewport while maintaining aspect ratio
resizeAspectRatio(gl, canvas, 1);

// Initialize WebGL settings
gl.viewport(0, 0, canvas.width, canvas.height);

// Set clear color to black
gl.clearColor(0, 0, 0, 1.0);

// Load shader files
const vertexShaderSource = await readShaderFile('vertexShader.glsl');
const fragmentShaderSourceRed = await readShaderFile('fragmentShader.glsl');

// Function to compile shader
function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader
}

// Function to create shader program
function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER); 
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program:', gl.getProgramInfoLog(promgram));
        gl.deleteProgram(program);
        return null;
    }
    return program
}

// Create shader programs
const program1 = createProgram(gl, vertexShaderSource, fragmentShaderSourceRed);

// Check if shader programs were created successfully
if (!program1) {
    console.error('Failed to create shader programs.');
}

// Rectangle vertices
const vertices = new Float32Array([
    -0.1, -0.1, 0.0,  // Bottom left
     0.1, -0.1, 0.0,  // Bottom right
     0.1,  0.1, 0.0,  // Top right
    -0.1,  0.1, 0.0   // Top left
]);

// Indices for FILL mode (triangles)
const fillIndices = new Uint16Array([
    0, 1, 2,  // First triangle
    2, 3, 0   // Second triangle
]);

// Create Vertex Array Object
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

// Create vertex buffer
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Link vertex data
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

// Create element buffer for FILL
const fillIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fillIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, fillIndices, gl.STATIC_DRAW);

// Move rectangle's position by users keyboard input
let offsetX = 0;
let offsetY = 0;
const step = 0.01;

const uOffsetLoc = gl.getUniformLocation(program1, 'uOffset');
gl.useProgram(program1);
gl.uniform2f(uOffsetLoc, offsetX, offsetY);

// Add event listener function
window.addEventListener('keydown', (event) => {
    if (event.key === "ArrowUp") {
        offsetY += step;
    } else if (event.key === "ArrowDown") {
        offsetY -= step;
    } else if (event.key === "ArrowLeft") {
        offsetX -= step;
    } else if (event.key === "ArrowRight") {
        offsetX += step;
    }

    // update offset
    gl.uniform2f(uOffsetLoc, offsetX, offsetY);

    render();
});

// Render loop
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Fill the two triangles using shader program1 (red)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

setupText(canvas, "Use arrow keys to move the rectangle", 1, 8);

// Start rendering
render();
