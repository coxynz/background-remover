/**
 * preview.js — Renders result images and handles background toggle controls.
 */

/**
 * Initialize the preview background toggles.
 * @param {object} opts
 * @param {HTMLElement} opts.resultWrapper - The wrapper div around the result image
 * @param {NodeListOf<HTMLElement>} opts.toggleButtons - All bg-toggle buttons
 * @param {HTMLInputElement} opts.customColorInput - The custom color picker input
 * @param {HTMLElement} opts.customSwatch - The custom color swatch element
 */
export function initPreview({ resultWrapper, toggleButtons, customColorInput, customSwatch }) {
    toggleButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            // Update active state
            toggleButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const bg = btn.dataset.bg;
            applyBackground(resultWrapper, bg, customColorInput.value);
        });
    });

    // Custom color picker
    customColorInput.addEventListener('input', (e) => {
        const color = e.target.value;
        customSwatch.style.background = color;
        // If custom is active, update immediately
        const customBtn = [...toggleButtons].find((b) => b.dataset.bg === 'custom');
        if (customBtn?.classList.contains('active')) {
            applyBackground(resultWrapper, 'custom', color);
        }
    });
}

/**
 * Apply a background style to the result wrapper.
 */
function applyBackground(wrapper, type, customColor) {
    // Reset
    wrapper.classList.remove('checkerboard');
    wrapper.style.backgroundColor = '';

    switch (type) {
        case 'checkerboard':
            wrapper.classList.add('checkerboard');
            break;
        case 'white':
            wrapper.style.backgroundColor = '#ffffff';
            break;
        case 'black':
            wrapper.style.backgroundColor = '#000000';
            break;
        case 'custom':
            wrapper.style.backgroundColor = customColor || '#22c55e';
            break;
    }
}

/**
 * Display the original image preview.
 * @param {File} file
 * @param {HTMLImageElement} imgElement
 * @returns {string} Object URL (caller should revoke when done)
 */
export function showOriginalPreview(file, imgElement) {
    const url = URL.createObjectURL(file);
    imgElement.src = url;
    return url;
}

/**
 * Display the result image preview.
 * @param {Blob} resultBlob
 * @param {HTMLImageElement} imgElement
 * @returns {string} Object URL (caller should revoke when done)
 */
export function showResultPreview(resultBlob, imgElement) {
    const url = URL.createObjectURL(resultBlob);
    imgElement.src = url;
    return url;
}
