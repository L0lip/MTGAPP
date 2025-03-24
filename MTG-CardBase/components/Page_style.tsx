import { StyleSheet, Dimensions } from 'react-native';

export const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop : '10%',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    padding: 12,
    paddingLeft: 40,
    paddingRight: 70,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#000000',
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    top: 12,
    zIndex: 1,
  },
  clearSearchButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
  
  },
  cardGrid: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: 'transparent',
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  backgroundImageStyle: {
    opacity: 0.6,
    backgroundattachment: 'fixed',
    backgroundposition: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundattachment: 'fixed',
    backgroundposition: 'center',
  },
  cardDetails: {
    padding: 16,
    gap: 8,
  },
  cardImage: {
    width: 300,
    height: 300,
    position : 'relative',
    top : '10%',
  },
  collectionButton: {
    paddingVertical: 6,  // Smaller vertical padding
    paddingHorizontal: 12,  // Smaller horizontal padding
    backgroundColor: "#444",  // Background color
    borderRadius: 5,  // Rounded corners
    alignItems: "center",
    marginVertical: 5,  // Margin for spacing
    width: "auto",  // Allow width to adjust based on content
  },
  collectionButtonText: {
    color: "white",  // Text color for contrast
    fontSize: 14,  // Smaller text size
  },
  addButton: {
    width: '100%',  // Make the button take the full width of the card
    paddingVertical: 8,  // Vertical padding to make it slightly taller
    backgroundColor: "#007bff",  // Button background color
    borderRadius: 5,  // Rounded corners
    alignItems: "center",
    marginTop: 8,  // Small margin to add spacing between button and card text
    borderColor: "#0056b3",  // Border color for the button
    borderWidth: 1,  // Border width
  },
  addButtonText: {
    color: "white",  // White text to contrast against the blue
    fontSize: 14,  // Font size for the button text
    fontWeight: 'bold',  // Bold text to make it stand out
  },
  removeButton: {
    width: '100%',  // Button takes full width of the card
    paddingVertical: 8,  // Padding for the button
    backgroundColor: "#ff4d4d",  // Bright red color
    borderRadius: 5,  // Rounded corners for the button
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 8,  // Space between button and card text
    borderWidth: 1,  // Border around the button
    borderColor: "#cc0000",  // Darker border color for visual contrast
    elevation: 2,  // Add slight shadow for a lifted effect
  },
  removeButtonText: {
    color: "white",  // White text to contrast against the red
    fontSize: 14,  // Font size for the button text
    fontWeight: 'bold',  // Bold text to make it stand out
  },
  clearButton: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearFilterButton: {
    position: 'absolute',
    right: 10,
    padding: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  filterContainer: {
    position: 'relative',
  },
});