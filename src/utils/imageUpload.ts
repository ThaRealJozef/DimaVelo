const resizeImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          0.8 // Quality (0.0 - 1.0)
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const uploadImageToImgBB = async (file: File): Promise<string> => {
  console.error('DEBUG: uploadImageToImgBB called for file:', file.name, 'Size:', file.size, 'Type:', file.type);
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_IMGBB_API_KEY is missing in environment variables');
  }

  try {
    // Resize image before upload
    console.error('DEBUG: Resizing image...');
    const resizedBlob = await resizeImage(file);
    console.error('DEBUG: Image resized. New size:', resizedBlob.size);

    const formData = new FormData();
    formData.append('image', resizedBlob, file.name);

    console.error('DEBUG: Starting fetch to ImgBB...');

    // Add 30s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.error('DEBUG: Fetch completed, status:', response.status);

    const data = await response.json();
    console.error('DEBUG: ImgBB response data:', data);

    if (data.success) {
      return data.data.url;
    }

    throw new Error(data.error?.message || 'Failed to upload image');
  } catch (error) {
    console.error('DEBUG: Image upload error:', error);
    throw error;
  }
};