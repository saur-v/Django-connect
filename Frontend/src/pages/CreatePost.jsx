import { useState, useCallback } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { FiUpload, FiLoader } from 'react-icons/fi';

export default function CreatePost() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setShowCrop(true);
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const generateCroppedImage = async () => {
    try {
      const cropped = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(cropped);
      setShowCrop(false);
    } catch (err) {
      console.error(err);
      setError('Failed to crop image.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!croppedImage) {
      setError('Please crop the image first.');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', croppedImage);

    setUploading(true);
    setError('');

    try {
      await axios.post('/posts/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to upload post. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📸 Share a New Moment</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block cursor-pointer">
          <div className="border-dashed border-2 border-gray-300 p-4 text-center rounded">
            <FiUpload className="mx-auto text-2xl text-blue-500" />
            <p className="text-sm mt-2">Click to choose image</p>
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>

        {showCrop && (
          <div className="relative w-full h-64 bg-black my-4">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <button
              type="button"
              onClick={generateCroppedImage}
              className="absolute bottom-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              ✅ Crop Image
            </button>
          </div>
        )}

        {croppedImage && (
          <img
            src={URL.createObjectURL(croppedImage)}
            alt="Cropped Preview"
            className="w-full h-48 object-cover rounded shadow"
          />
        )}

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border border-gray-300 rounded p-3 resize-none text-sm"
          rows="3"
        />

        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-2 rounded text-white text-sm font-medium flex justify-center items-center gap-2 ${
            uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? <><FiLoader className="animate-spin" /> Uploading...</> : '🚀 Post'}
        </button>
      </form>
    </div>
  );
}
