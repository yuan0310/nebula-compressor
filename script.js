/* =========================================
   Nebula Compressor v3.0
   Premium Image Optimization Logic
   ========================================= */

// Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const processingState = document.getElementById('processing-state');
const resultArea = document.getElementById('result-area');

// Previews & Stats
const originalPreview = document.getElementById('original-preview');
const compressedPreview = document.getElementById('compressed-preview');
const originalSizeParams = document.getElementById('original-size');
const originalDimsParams = document.getElementById('original-dims');
const compressedSizeParams = document.getElementById('compressed-size');
const compressedDimsParams = document.getElementById('compressed-dims');

// Actions
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');

// Constants
const MAX_SIZE_MB = 1;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

let currentCompressedBlob = null;
let currentExtension = 'jpg';

/* =========================================
   Event Listeners (Drag & Drop + Input)
   ========================================= */

// Drag Effects
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

document.addEventListener('dragleave', (e) => {
    if (e.clientX === 0 && e.clientY === 0) dropZone.classList.remove('drag-over');
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
});

// Click to Upload
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) processFile(e.target.files[0]);
});

// Global Paste
document.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
            e.preventDefault();
            processFile(item.getAsFile());
            break;
        }
    }
});

// Actions
resetBtn.addEventListener('click', resetUI);

/* =========================================
   Core Processing Logic
   ========================================= */

async function processFile(file) {
    if (!file.type.match('image.*')) {
        alert('Please select a valid image (PNG or JPG).');
        return;
    }

    // UI Transition: Upload -> Processing
    dropZone.classList.add('hidden');
    resultArea.classList.add('hidden');
    processingState.classList.remove('hidden');

    try {
        // 1. Analyze Original
        const originalUrl = URL.createObjectURL(file);
        const originalImg = await loadImage(originalUrl);

        // Update Original Stats
        originalPreview.src = originalUrl;
        originalSizeParams.textContent = formatBytes(file.size);
        originalDimsParams.textContent = `${originalImg.width} × ${originalImg.height} px`;

        // 2. Compress (Smart Engine)
        currentCompressedBlob = await smartCompress(originalImg, file.type, file.size, file);
        currentExtension = currentCompressedBlob.type === 'image/png' ? 'png' : 'jpg';

        // 3. Update Result Stats
        const compressedUrl = URL.createObjectURL(currentCompressedBlob);
        const compressedImg = await loadImage(compressedUrl);

        compressedPreview.src = compressedUrl;
        compressedSizeParams.textContent = formatBytes(currentCompressedBlob.size);
        compressedDimsParams.textContent = `${compressedImg.width} × ${compressedImg.height} px`;

        // 4. Setup Download
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.href = compressedUrl;
            const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
            link.download = `${originalName}_optimized.${currentExtension}`;
            link.click();
        };

        // UI Transition: Processing -> Result
        // Small artificial delay to show off the animation (feels more premium)
        setTimeout(() => {
            processingState.classList.add('hidden');
            resultArea.classList.remove('hidden');
        }, 600);

    } catch (error) {
        console.error("Compression Error:", error);
        alert("An error occurred. Please try another image.");
        resetUI();
    }
}

function resetUI() {
    resultArea.classList.add('hidden');
    processingState.classList.add('hidden');
    dropZone.classList.remove('hidden');
    fileInput.value = '';
    currentCompressedBlob = null;
}

/* =========================================
   Compression Engine
   ========================================= */

async function smartCompress(img, type, originalSize, originalFile) {
    // 0. Pass-through Check
    if (originalSize < MAX_SIZE_BYTES) {
        console.log("Image under 1MB. Returning original.");
        return originalFile;
    }

    const width = img.width;
    const height = img.height;

    // Helper: Render to Blob
    const getBlob = (mime, q, w, h) => new Promise(resolve => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const ctx = tempCanvas.getContext('2d');

        // Handle transparency for JPEG
        if (mime === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, w, h);
        } else {
            ctx.clearRect(0, 0, w, h);
        }

        ctx.drawImage(img, 0, 0, w, h);
        tempCanvas.toBlob(resolve, mime, q);
    });

    // Strategy 1: Smart PNG Scaling (Preserve Transparency)
    if (type === 'image/png') {
        let minScale = 0.5;
        let maxScale = 0.99;
        let bestPNGBlob = null;

        // Binary search for max dimensions that fit
        for (let i = 0; i < 6; i++) {
            let mid = (minScale + maxScale) / 2;
            let w = Math.floor(width * mid);
            let h = Math.floor(height * mid);
            let blob = await getBlob('image/png', null, w, h);

            if (blob.size < MAX_SIZE_BYTES) {
                bestPNGBlob = blob;
                minScale = mid;
            } else {
                maxScale = mid;
            }
        }

        if (bestPNGBlob) return bestPNGBlob;
    }

    // Strategy 2: High-Quality JPEG Binary Search
    // First, convert to JPEG at 100% to see if just format change is enough
    let fullBlob = await getBlob('image/jpeg', 1.0, width, height);
    if (fullBlob.size < MAX_SIZE_BYTES) return fullBlob;

    let minQ = 0.5;
    let maxQ = 1.0;
    let bestJPGBlob = null;

    for (let i = 0; i < 7; i++) {
        let midQ = (minQ + maxQ) / 2;
        let blob = await getBlob('image/jpeg', midQ, width, height);

        if (blob.size <= MAX_SIZE_BYTES * 0.99) { // Target 990KB
            bestJPGBlob = blob;
            minQ = midQ;
        } else {
            maxQ = midQ;
        }
    }

    if (bestJPGBlob) return bestJPGBlob;

    // Strategy 3: Aggressive Resizing (Fallback)
    // If quality reduction isn't enough, we must reduce dimensions
    let scale = 0.9;
    while (scale > 0.1) {
        let w = Math.floor(width * scale);
        let h = Math.floor(height * scale);
        let blob = await getBlob('image/jpeg', 0.8, w, h);
        if (blob.size < MAX_SIZE_BYTES) return blob;
        scale -= 0.1;
    }

    // Last Resort (Tiny Thumbnail)
    return await getBlob('image/jpeg', 0.5, Math.floor(width * 0.5), Math.floor(height * 0.5));
}

/* =========================================
   Utilities
   ========================================= */

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
