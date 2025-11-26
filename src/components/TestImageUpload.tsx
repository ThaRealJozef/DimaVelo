import { useState } from 'react';
import { uploadImageToImgBB } from '@/utils/imageUpload';

const TestImageUpload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setIsUploading(true);
    setError(null);
    
    try {
      const url = await uploadImageToImgBB(image);
      setImageUrl(url);
      console.log('Image uploaded successfully:', url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Test Image Upload</h2>
      
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!image || isUploading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {imageUrl && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Uploaded Image:</h3>
          <img 
            src={imageUrl} 
            alt="Uploaded preview" 
            className="max-w-full h-auto rounded-md border"
          />
          <div className="mt-2 p-2 bg-gray-50 rounded-md overflow-x-auto">
            <code className="text-sm break-all">{imageUrl}</code>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <p className="text-yellow-700">
          <strong>Note:</strong> This is a test component. After verifying the upload works, 
          you can integrate this functionality into your product form.
        </p>
      </div>
    </div>
  );
};

export default TestImageUpload;