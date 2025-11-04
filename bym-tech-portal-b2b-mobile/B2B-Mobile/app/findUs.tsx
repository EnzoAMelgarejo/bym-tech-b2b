import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Footer from "../components/footer";

export default function FindUs() {
    return (
        <View style={styles.container}>
            <Text>Donde Comprar</Text>

            <Footer />

        </View>
    )
}

const styles = StyleSheet.create(
    {
        container: {
            marginVertical: 150,
            padding: 10,
        }
    }
)