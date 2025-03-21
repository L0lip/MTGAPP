import React, { useState, useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';

interface CardImageProps {
  uri: string;
  width?: number;
}

function CardImage({ uri, width = 100 }: CardImageProps) {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [validImage, setValidImage] = useState(true);

  useEffect(() => {
    if (uri) {
      Image.getSize(
        uri,
        (width, height) => {
          setAspectRatio(width / height);
          setValidImage(true);
        },
        () => {
          console.error(`Invalid image URL: ${uri}`);
          setValidImage(false);
        }
      );
    } else {
      setValidImage(false);
    }
  }, [uri]);

  return (
    <Image
      source={{ uri: validImage ? uri : "https://via.placeholder.com/150" }} // Fallback image
      style={[styles.image, { width, aspectRatio }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
  },
});

export default CardImage;