// Add resize handler (keeping the aspect ratio)
export function resizeAspectRatio(gl, canvas, ratio=null) {
    window.addEventListener('resize', () => {
        // Calculate new canvas dimensions while maintaining aspect ratio
        const originalWidth = canvas.width;
        const originalHeight = canvas.height;
        let aspectRatio = originalWidth / originalHeight;
        if (ratio !== null) {
            aspectRatio = ratio;
        }
        let newWidth = window.innerWidth;
        let newHeight = window.innerHeight;

        if (newWidth / newHeight > aspectRatio) {
            newWidth = newHeight * aspectRatio;
        } else {
            newHeight = newWidth / aspectRatio;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    });
}

// print text 
export function setupText(canvas, initialText, line = 1, fontSize=14) {

    // 기존 텍스트 오버레이가 있다면 제거
    if (line == 1) {
        const existingOverlay = document.getElementById('textOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
    }

    // 새로운 텍스트 오버레이 생성
    const overlay = document.createElement('div');
    overlay.id = 'textOverlay';
    overlay.style.position = 'fixed';
    overlay.style.left = canvas.offsetLeft + 10 + 'px';
    overlay.style.top = canvas.offsetTop + (20 * (line - 1) + 10) + 'px';
    overlay.style.color = 'white';
    overlay.style.fontFamily = 'monospace';
    overlay.style.fontSize = fontSize + 'px';
    overlay.style.zIndex = '100';
    overlay.textContent = `${initialText}`;

    // 캔버스의 부모 요소에 오버레이 추가
    canvas.parentElement.appendChild(overlay);
    return overlay;
}

// Function to read shader files
export async function readShaderFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        return `${content}`;
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}