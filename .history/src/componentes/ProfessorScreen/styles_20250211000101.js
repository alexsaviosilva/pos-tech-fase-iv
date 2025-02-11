import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
  },
  iconButton: {
    marginRight: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  postItem: {
    marginBottom: 15,
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor: "transparent",
  },
  selectedPost: {
    backgroundColor: "#e0e0e0",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    paddingTop: 5,
    paddingBottom: 5,
  },
  postActions: {
    flexDirection: "row",
    marginTop: 10,
  },
  actionButton: {
    marginRight: 10,
  },
  editText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  deleteText: {
    color: "#ff0000",
    fontWeight: "bold",
  },
  noPostsText: {
    textAlign: "center",
    marginTop: 20,
  },
});
