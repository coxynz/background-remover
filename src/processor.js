/**
 * processor.js — Wraps @imgly/background-removal for background removal inference.
 */

import { removeBackground } from '@imgly/background-removal';

/**
 * Process an image file to remove its background.
 * @param {Blob} imageBlob - The input image as a Blob
 * @param {(progress: { key: string, current: number, total: number }) => void} onProgress - Progress callback
 * @returns {Promise<Blob>} - The result image as a PNG Blob with transparency
 */
export async function processImage(imageBlob, onProgress) {
    const resultBlob = await removeBackground(imageBlob, {
        progress: (key, current, total) => {
            if (onProgress) {
                onProgress({ key, current, total });
            }
        },
    });

    return resultBlob;
}
