import { StyleSheet } from 'react-native';

export const Collectionstyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
      },
      collectionName: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
      },
      noCardsText: {
        textAlign: "center",
        fontSize: 16,
        marginTop: 20,
      },
      errorText: {
        color: "red",
        textAlign: "center",
        fontSize: 18,
      },
});