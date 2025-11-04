// components/CommentIcon.tsx
import React, { useState } from "react";
import { Text, StyleSheet, View, Pressable, Modal, FlatList, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { environment } from "@/configuration/environment";

interface CommentIconProps {
  content: string;
  postId: number;
}

const CommentIcon: React.FC<CommentIconProps> = ({ content, postId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState<Array<{ content: string; author: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle modal open and fetch comments
  const handlePress = async () => {
    const baseUrl = `${environment.SERVER_URL}/api/controller/comments`;
    const params = new URLSearchParams({
      one: "false",
      blogId: postId.toString(), // Adding the blogId parameter for filtering
    });
    const url = `${baseUrl}?${params.toString()}`;

    setModalVisible(true); // Open modal
    setLoading(true);
    setError(null);

    try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error:", errorData);
          throw new Error("Failed to fetch comments");
        }
      
        const data = await response.json();
        if (!data || data.length === 0) {
          setError("No hay comentarios disponibles.");
        } else {
          setComments(data);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Error al cargar los comentarios.");
      }
    }
      

  return (
    <View>
      <Pressable onPress={handlePress}>
        <Text style={styles.comments}>
          <FontAwesome name="comments" size={14} color="#888" /> {comments.length}
        </Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close icon in the top right corner */}
            <Pressable style={styles.closeIcon} onPress={() => setModalVisible(false)}>
              <FontAwesome name="angle-right" size={25} color="#d3d3d3" />
            </Pressable>

            {loading ? (
              <Text>Cargando comentarios...</Text>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <FlatList
                data={comments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.comment}>
                    <Text style={styles.commentContent}>{item.content}</Text>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  comments: {
    fontSize: 12,
    color: "#888",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    marginVertical: 10,
    color: "#555",
  },
  errorText: {
    color: "#ff0000",
    textAlign: "center",
    marginTop: 20,
  },
  comment: {
    marginBottom: 10,
  },
  author: {
    fontWeight: "bold",
    color: "#333",
  },
  commentContent: {
    color: "#555",
  },
});

export default CommentIcon;
