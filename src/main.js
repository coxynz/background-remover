/**
 * main.js — App entry point. Orchestrates upload → process → result flow.
 */

import './style.css';
import { initUpload } from './upload.js';
import { processImage } from './processor.js';
import { initPreview, showOriginalPreview, showResultPreview } from './preview.js';
import { downloadImage } from './download.js';

// ====== DOM References ======
const uploadSection = document.getElementById('upload-section');
const processingSection = document.getElementById('processing-section');
const resultSection = document.getElementById('result-section');

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');

const processingStatus = document.getElementById('processing-status');
const progressBar = document.getElementById('progress-bar');

const originalPreview = document.getElementById('original-preview');
const resultPreview = document.getElementById('result-preview');
const resultWrapper = document.getElementById('result-wrapper');

const downloadBtn = document.getElementById('download-btn');
const newImageBtn = document.getElementById('new-image-btn');

const errorToast = document.getElementById('error-toast');
const errorMessage = document.getElementById('error-message');
const errorClose = document.getElementById('error-close');

const bgToggles = document.querySelectorAll('.bg-toggle');
const customColorInput = document.getElementById('custom-color');
const customSwatch = document.getElementById('custom-swatch');

// ====== State ======
let currentFile = null;
let resultBlob = null;
let originalUrl = null;
let resultUrl = null;

// ====== Initialization ======
initUpload({
    dropZone,
    fileInput,
    onFile: handleFile,
    onError: showError,
});

initPreview({
    resultWrapper,
    toggleButtons: bgToggles,
    customColorInput,
    customSwatch,
});

downloadBtn.addEventListener('click', handleDownload);
newImageBtn.addEventListener('click', resetToUpload);
errorClose.addEventListener('click', hideError);

// ====== Flow Handlers ======

async function handleFile(file) {
    currentFile = file;

    // Clean up previous URLs
    cleanupUrls();

    // Show original preview
    showSection('processing');
    originalUrl = showOriginalPreview(file, originalPreview);

    // Update progress
    updateProgress(0, 'Loading AI model…');

    try {
        resultBlob = await processImage(file, handleProgress);

        // Show result
        resultUrl = showResultPreview(resultBlob, resultPreview);
        showSection('result');
    } catch (err) {
        console.error('Background removal failed:', err);
        showError('Background removal failed. Please try a different image.');
        showSection('upload');
    }
}

function handleProgress({ key, current, total }) {
    if (total === 0) return;
    const percent = Math.round((current / total) * 100);

    // Determine human-readable status from the progress key
    let statusText = 'Processing…';
    if (key && typeof key === 'string') {
        if (key.includes('fetch') || key.includes('download') || key.includes('load')) {
            statusText = 'Downloading AI model…';
        } else if (key.includes('compute') || key.includes('infer') || key.includes('process')) {
            statusText = 'Removing background…';
        } else {
            statusText = 'Processing…';
        }
    }

    updateProgress(percent, statusText);
}

function handleDownload() {
    if (!resultBlob || !currentFile) return;
    downloadImage(resultBlob, currentFile.name);
}

function resetToUpload() {
    cleanupUrls();
    currentFile = null;
    resultBlob = null;
    originalPreview.src = '';
    resultPreview.src = '';
    progressBar.style.width = '0%';

    // Reset background toggle to checkerboard
    bgToggles.forEach((b) => b.classList.remove('active'));
    bgToggles[0]?.classList.add('active');
    resultWrapper.classList.add('checkerboard');
    resultWrapper.style.backgroundColor = '';

    showSection('upload');
}

// ====== UI Helpers ======

function showSection(name) {
    uploadSection.classList.toggle('hidden', name !== 'upload');
    processingSection.classList.toggle('hidden', name !== 'processing');
    resultSection.classList.toggle('hidden', name !== 'result');

    // Re-trigger animation
    const active = document.querySelector(`.${name}-section`);
    if (active) {
        active.style.animation = 'none';
        active.offsetHeight; // trigger reflow
        active.style.animation = '';
    }
}

function updateProgress(percent, statusText) {
    progressBar.style.width = `${Math.min(percent, 100)}%`;
    if (statusText) {
        processingStatus.textContent = statusText;
    }
}

let errorTimeout = null;
function showError(message) {
    errorMessage.textContent = message;
    errorToast.classList.remove('hidden');
    // Force reflow for transition
    errorToast.offsetHeight;
    errorToast.classList.add('visible');

    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(hideError, 6000);
}

function hideError() {
    errorToast.classList.remove('visible');
    clearTimeout(errorTimeout);
    // Re-hide after transition
    setTimeout(() => {
        errorToast.classList.add('hidden');
    }, 400);
}

function cleanupUrls() {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    originalUrl = null;
    resultUrl = null;
}
