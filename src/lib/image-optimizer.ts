/**
 * Utility to optimize / compress image files on client-side before uploading.
 * Handles high-resolution camera photos (e.g. 6MB - 20MB) by resizing large dimensions
 * to max 2400px and re-encoding at high quality (0.85), reducing payload to ~400KB - 800KB
 * without perceptible quality loss.
 */

export async function optimizeImageFile(
  file: File,
  maxDimension = 2400,
  quality = 0.85
): Promise<File> {
  if (typeof window === 'undefined') return file;
  if (!file || !(file instanceof File)) return file;
  if (!file.type.startsWith('image/')) return file;

  // Skip SVGs and GIFs to preserve animation/vectors
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  // If already under 400KB, no need to touch
  if (file.size <= 400 * 1024) {
    return file;
  }

  try {
    let sourceWidth = 0;
    let sourceHeight = 0;
    let drawable: ImageBitmap | HTMLImageElement;

    if (typeof createImageBitmap === 'function') {
      const bitmap = await createImageBitmap(file);
      sourceWidth = bitmap.width;
      sourceHeight = bitmap.height;
      drawable = bitmap;
    } else {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new window.Image();
        const url = URL.createObjectURL(file);
        image.onload = () => {
          URL.revokeObjectURL(url);
          resolve(image);
        };
        image.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject(e);
        };
        image.src = url;
      });
      sourceWidth = img.naturalWidth || img.width;
      sourceHeight = img.naturalHeight || img.height;
      drawable = img;
    }

    let targetWidth = sourceWidth;
    let targetHeight = sourceHeight;

    // Scale down dimensions if exceeding maxDimension
    if (targetWidth > maxDimension || targetHeight > maxDimension) {
      if (targetWidth > targetHeight) {
        targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
        targetWidth = maxDimension;
      } else {
        targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
        targetHeight = maxDimension;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      if ('close' in drawable && typeof (drawable as any).close === 'function') {
        (drawable as any).close();
      }
      return file;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(drawable, 0, 0, targetWidth, targetHeight);

    if ('close' in drawable && typeof (drawable as any).close === 'function') {
      (drawable as any).close();
    }

    const outputType = 'image/jpeg';
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, outputType, quality);
    });

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const newFileName = `${baseName}.jpg`;

    return new File([blob], newFileName, {
      type: outputType,
      lastModified: Date.now(),
    });
  } catch (err) {
    console.warn('Image optimization skipped due to error:', err);
    return file;
  }
}

export async function optimizeImageFiles(
  files: File[],
  maxDimension = 2400,
  quality = 0.85
): Promise<File[]> {
  return Promise.all(files.map((f) => optimizeImageFile(f, maxDimension, quality)));
}
