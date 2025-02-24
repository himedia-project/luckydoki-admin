import React, { useEffect, useState } from 'react';
import { getImageUrl } from '../../api/imageApi';

const DEFAULT_USER_IMAGE = '/images/default-user.png';
const DEFAULT_SHOP_IMAGE = '/images/default-shop.png';
const DEFAULT_PRODUCT_IMAGE = '/images/default-product.png';

const ImageLoader = ({
  imagePath,
  alt = '이미지',
  className = '',
  sx = {},
  type = 'user', // 'user' | 'shop' | 'product'
}) => {
  const getDefaultImage = () => {
    switch (type) {
      case 'shop':
        return DEFAULT_SHOP_IMAGE;
      case 'product':
        return DEFAULT_PRODUCT_IMAGE;
      default:
        return DEFAULT_USER_IMAGE;
    }
  };

  const [imageSrc, setImageSrc] = useState(getDefaultImage());

  useEffect(() => {
    if (imagePath) {
      getImageUrl(imagePath)
        .then((url) => setImageSrc(url))
        .catch(() => setImageSrc(getDefaultImage()));
    }
  }, [imagePath, type]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={{
        ...sx,
      }}
    />
  );
};

export default ImageLoader;
