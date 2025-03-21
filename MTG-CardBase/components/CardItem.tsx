// CardItem.tsx
import React from "react";
import { Pressable } from "react-native";
import { useRouter } from "expo-router"; // or useNavigation from React Navigation if you're using that
import CardImage from "@/app/CardImage";
import { ThemedText } from "@/components/ThemedText";
import { HomeStyles } from "@/components/Page_style";

interface Card {
  id: string;
  name: string;
  image_uris?: {
    small: string;
  };
}

interface CardItemProps {
  card: Card;
}

export default function CardItem({ card }: CardItemProps) {
  const router = useRouter();

  return (
    <Pressable
      style={HomeStyles.card}
      onPress={() =>
        router.push({ pathname: "/CardDetails", params: { card: JSON.stringify(card) } })
      }
    >
      <CardImage
        uri={card.image_uris?.small || "https://via.placeholder.com/100"}
        width={100}
      />
      <ThemedText style={HomeStyles.cardText}>{card.name}</ThemedText>
    </Pressable>
  );
}
