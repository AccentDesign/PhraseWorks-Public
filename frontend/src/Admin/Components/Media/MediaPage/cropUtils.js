export const getCroppedImg = (imageSrc, filename, pixelCrop, rotation = 0) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const safeArea = Math.max(image.width, image.height) * 2;

      canvas.width = safeArea;
      canvas.height = safeArea;

      ctx.translate(safeArea / 2, safeArea / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-safeArea / 2, -safeArea / 2);

      ctx.drawImage(image, (safeArea - image.width) / 2, (safeArea - image.height) / 2);

      const cropX = safeArea / 2 - image.width / 2 + pixelCrop.x;
      const cropY = safeArea / 2 - image.height / 2 + pixelCrop.y;

      const croppedImageData = ctx.getImageData(cropX, cropY, pixelCrop.width, pixelCrop.height);

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.putImageData(croppedImageData, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          const file = new File([blob], filename, { type: 'image/webp' });
          resolve(file);
        },
        'image/webp',
        0.9,
      );
    };

    image.onerror = (err) => reject(err);
  });
};
