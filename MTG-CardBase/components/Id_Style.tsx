import { StyleSheet } from 'react-native';

export const IDstyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
      },
      content: {
        alignItems: "center",
      },
      loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      errorText: {
        fontSize: 18,
        color: "red",
      },
      cardImage: {
        width: 300,
        height: 300,
        marginBottom: 20,
      },
      textContainer: {
        alignItems: "center",
        paddingHorizontal: 20,
      },
      cardName: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 5,
      },
      manaCost: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 5,
      },
      typeLine: {
        fontSize: 16,
        color: "#ccc",
        marginVertical: 5,
      },
      oracleText: {
        fontSize: 16,
        textAlign: "center",
        marginVertical: 10,
      },
});