import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropUtils';
import { useEffect } from 'react';
import { APIGetMediaSettings } from '../../../../API/APIMedia';
import { useContext } from 'react';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { APILogError } from '../../../../API/APISystem';

export default function ImageCropper({ imageUrl, filename, onSave, setEditFile }) {
  const { loginPassword } = useContext(APIConnectorContext);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspect, setAspect] = useState(undefined);
  const [settings, setSettings] = useState([]);
  const [selectedSetting, setSelectedSetting] = useState('image');
  const [mainImgWidth, setMainImgWidth] = useState(0);
  const [mainImgHeight, setMainImgHeight] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(imageUrl);

  const [lastChangeSource, setLastChangeSource] = useState(null);

  const aspectPresets = [
    { label: 'Square', value: 1, width: 800, height: 800 },
    { label: '16:9', value: 16 / 9, width: 1920, height: 1080 },
    { label: '4:3', value: 4 / 3, width: 1600, height: 1200 },
  ];

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  useEffect(() => {
    if (!selectedImageUrl) return;

    const img = new Image();
    img.src = selectedImageUrl;
    img.onload = () => {
      const ratio = img.width / img.height;
      setMainImgWidth(img.width);
      setMainImgHeight(img.height);
      setAspect(ratio);
    };
  }, [selectedImageUrl]);

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(
        selectedImageUrl,
        filename,
        croppedAreaPixels,
        rotation,
      );

      onSave?.(croppedImage, selectedSetting);
    } catch (err) {
      await APILogError(err.stack || String(err));
      console.error('Crop error:', err);
    }
  };

  const fetchData = async () => {
    const data = await APIGetMediaSettings(loginPassword);
    if (data.status == 200) {
      const tmpSettings = JSON.parse(data.data.getMediaSettings.settings);
      tmpSettings.unshift({
        title: 'Image',
        slug: 'image',
        width: mainImgWidth,
        height: mainImgHeight,
      });
      const tmpUrls = [];

      const dotIndex = imageUrl.lastIndexOf('.');
      const baseName = dotIndex !== -1 ? imageUrl.slice(0, dotIndex) : imageUrl;
      const extension = dotIndex !== -1 ? imageUrl.slice(dotIndex) : '';

      tmpSettings.map((setting) => {
        let url = baseName;
        if (setting.slug !== 'image') {
          url += '-' + setting.slug;
        }
        url += setting.slug == 'image' ? extension : '.webp';
        tmpUrls.push({
          setting: setting.slug,
          url: url,
          width: parseInt(setting.width),
          height: parseInt(setting.height),
        });
      });
      setImageUrls(tmpUrls);
      setSettings(tmpSettings);
    }
  };

  useEffect(() => {
    if (aspect != undefined) {
      fetchData();
    }
  }, [aspect]);

  useEffect(() => {
    if (lastChangeSource === 'select') {
      const selected = imageUrls.find((item) => item.setting === selectedSetting);
      if (selected?.url) {
        setSelectedImageUrl(selected.url);
      }
    }
  }, [selectedSetting, imageUrls, lastChangeSource]);

  if (!imageUrl) return <p>No image provided</p>;

  return (
    <div className="p-4 space-y-4">
      <select
        name="imageSetting"
        value={selectedSetting}
        onChange={(e) => {
          setLastChangeSource('select');
          setSelectedSetting(e.target.value);
        }}
        className="bg-gray-100 border-gray-300 border px-4 py-2 divide-y divide-gray-100 rounded shadow"
      >
        <option value="">Please select a file</option>
        {settings.map((setting, idx) => (
          <option key={idx} value={setting.slug}>
            {setting.title}
          </option>
        ))}
      </select>

      <div className="relative w-full h-[400px] bg-gray-800 rounded overflow-hidden">
        <Cropper
          image={selectedImageUrl}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect} // undefined lets them resize freely
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          cropShape="rect" // keep it rectangular
          showGrid={true}
        />
      </div>
      <p>
        Please note that cropping/spinning the image will change the original image, you will not be
        able to undo this action.
      </p>
      <div className="flex gap-2 mb-4">
        {aspectPresets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setLastChangeSource('aspect');
              setAspect(preset.value);
            }}
            className={`px-3 py-1 rounded ${
              aspect === preset.value ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="pb-6">
        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Zoom <span className="text-gray-500">({zoom.toFixed(2)})</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
          />
          <span className="text-sm text-gray-500 absolute start-0 -bottom-6">0.5</span>
          <span className="text-sm text-gray-500 absolute start-1/4 -translate-x-1/2 -bottom-6">
            1.125
          </span>
          <span className="text-sm text-gray-500 absolute start-1/2 -translate-x-1/2 -bottom-6">
            1.75
          </span>
          <span className="text-sm text-gray-500 absolute start-3/4 -translate-x-1/2 -bottom-6">
            2.375
          </span>
          <span className="text-sm text-gray-500 absolute end-0 -bottom-6">3</span>
        </div>
      </div>
      <div className="pb-6">
        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Rotation <span className="text-gray-500">({rotation}°)</span>
          </label>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
          />
          <span className="text-sm text-gray-500 absolute start-0 -bottom-6">0</span>
          <span className="text-sm text-gray-500 absolute start-1/4 -translate-x-1/2 -bottom-6">
            90
          </span>
          <span className="text-sm text-gray-500 absolute start-1/2 -translate-x-1/2 -bottom-6">
            180
          </span>
          <span className="text-sm text-gray-500 absolute start-3/4 -translate-x-1/2 -bottom-6">
            270
          </span>
          <span className="text-sm text-gray-500 absolute end-0 -bottom-6">360</span>
        </div>
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Cropped Image
      </button>
      <button
        onClick={() => setEditFile(false)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
      >
        Cancel
      </button>
    </div>
  );
}
