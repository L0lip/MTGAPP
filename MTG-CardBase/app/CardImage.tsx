import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";

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

  if (!validImage) {
    return (
      <View >
        <ThemedText>No Image</ThemedText>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[styles.image, { width, aspectRatio }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
  },
  noImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  noImageText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CardImage;
