const getBaseUrl = () => {
  // In production, use the actual domain
  // In development, use localhost
  return process.env.BASE_URL || "http://localhost:5000";
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If imagePath is already a full URL (from Cloudinary, etc.), return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Otherwise, prepend the base URL
  return `${getBaseUrl()}${imagePath}`;
};

module.exports = {
  getBaseUrl,
  getImageUrl,
};
