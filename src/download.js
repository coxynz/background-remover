/**
 * download.js — Trigger download of the processed image.
 */

/**
 * Download a Blob as a PNG file.
 * @param {Blob} blob - The image blob to download
 * @param {string} originalFilename - Original filename (used to derive the output name)
 */
export function downloadImage(blob, originalFilename) {
    const baseName = originalFilename.replace(/\.[^/.]+$/, ''); // strip extension
    const filename = `${baseName}_no_bg.png`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }, 100);
}
