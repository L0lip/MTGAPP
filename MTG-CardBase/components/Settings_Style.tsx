import { StyleSheet } from 'react-native';

export const Settingsstyles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 39.4,
      },
      settingsContainer: {
        marginTop: 40,
        paddingHorizontal: 20,
        paddingVertical: 30,
        alignItems: 'center',
        flex: 1,
      },
      settingsCard: {
        backgroundColor: 'rgba(155, 155, 155, 0.3)',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5, 
      },
      selectorLabel: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
      },
      buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
      },
      button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
        marginHorizontal: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
      },
      selectedButton: {
        borderColor: '#007AFF',
        backgroundColor: 'rgba(0, 122, 255, 0.3)', 
      },
      buttonText: {
        fontSize: 16,
      },
});
    