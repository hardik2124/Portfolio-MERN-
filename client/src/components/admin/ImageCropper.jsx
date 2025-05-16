import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { XMarkIcon } from '@heroicons/react/24/outline';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size to match the final desired size (circle)
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Create a circular crop by creating a circular clipping path
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.arc(
    pixelCrop.width / 2, 
    pixelCrop.height / 2, 
    Math.min(pixelCrop.width, pixelCrop.height) / 2, 
    0, 
    2 * Math.PI
  );
  ctx.fill();

  // As base64
  return canvas.toDataURL('image/png');
};

const ImageCropper = ({ image, onCropComplete, onCropCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error('Error creating cropped image:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-white dark:bg-secondary-800 rounded-lg w-full max-w-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
            Crop Profile Image
          </h3>
          <button
            onClick={onCropCancel}
            className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="relative h-64 overflow-hidden rounded-lg">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
          />
        </div>
        
        <div className="mt-4">
          <label 
            htmlFor="zoom-slider" 
            className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1"
          >
            Zoom
          </label>
          <input
            id="zoom-slider"
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer dark:bg-secondary-700"
          />
        </div>
        
        <div className="mt-6 flex space-x-3 justify-end">
          <button
            type="button"
            onClick={onCropCancel}
            className="px-4 py-2 bg-secondary-200 text-secondary-800 rounded-md hover:bg-secondary-300 dark:bg-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCropConfirm}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper; 