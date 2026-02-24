/**
 * upload.js — Drag-and-drop and file input handling with validation.
 */

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

/**
 * Initialize the upload zone with drag-and-drop and click-to-browse.
 * @param {object} opts
 * @param {HTMLElement} opts.dropZone - The drop zone element
 * @param {HTMLInputElement} opts.fileInput - The hidden file input
 * @param {(file: File) => void} opts.onFile - Callback when a valid file is selected
 * @param {(message: string) => void} opts.onError - Callback for validation errors
 */
export function initUpload({ dropZone, fileInput, onFile, onError }) {
    // Click to browse
    dropZone.addEventListener('click', () => fileInput.click());

    // File input change
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) handleFile(file, onFile, onError);
        fileInput.value = ''; // reset so same file can be re-selected
    });

    // Drag events
    dropZone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Only remove if leaving the drop zone itself (not a child)
        if (!dropZone.contains(e.relatedTarget)) {
            dropZone.classList.remove('drag-over');
        }
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
        const file = e.dataTransfer?.files[0];
        if (file) handleFile(file, onFile, onError);
    });

    // Prevent default browser behavior for dragging files onto the page
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());
}

/**
 * Validate and pass the file to the callback.
 */
function handleFile(file, onFile, onError) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
        onError(`Unsupported format "${file.type || file.name.split('.').pop()}". Please use PNG, JPG, WebP, or GIF.`);
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        onError(`File is too large (${sizeMB} MB). Maximum size is 25 MB.`);
        return;
    }

    onFile(file);
}
