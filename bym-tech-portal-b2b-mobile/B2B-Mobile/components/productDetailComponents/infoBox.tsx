import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export const InfoBox = () => {


    // Nueva lógica para la oferta por tiempo limitado
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hora en segundos
    const [stock, setStock] = useState(100);
    
    useEffect(() => {
    const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    
    return(
        <View style={styles.infoBox}>
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Disponibilidad:</Text>
            <Text style={[styles.infoValue, stock > 0 ? styles.inStock : styles.outOfStock]}>
                {stock > 0 ? "InStock" : "No"}
            </Text>
        </View>
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>SKU:</Text>
            <Text style={styles.infoValue}>14235</Text>
        </View>
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Categoría:</Text>
            <Text style={styles.infoValue}>Iluminación</Text>
        </View>
        <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, {color:'#00C400', textDecorationLine:'underline'}]}>Preguntanos</Text>
        </View>
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Compartir en:</Text>
            <View style={styles.socialIconsRow}>
                <FontAwesome name="facebook" size={20} color="#3b5998" />
                <FontAwesome name="twitter" size={20} color="#1da1f2" />
                <FontAwesome name="instagram" size={20} color="#c32aa3" />
            </View>
        </View>
        <View style={styles.offerRow}>
            <Text style={styles.offerText}>Oferta por tiempo limitado!</Text>
            <Text style={styles.infoLabel}>Esta oferta vence en: {formatTime(timeLeft)}</Text>
        </View>
        <View style={styles.stockContainer}>
            <Text style={styles.stockText}>Cantidad: {stock}/100</Text>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(stock / 100) * 100}%` }]} />
            </View>
        </View>
    </View>
    )
}

const styles = StyleSheet.create(
    {
        infoBox: {
            marginTop: 20,
            padding: 15,
            borderRadius: 8,
            backgroundColor: "#f8f8f8",
        },
        infoRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
        },
        infoLabel: {
            fontSize: 13,
            color: "#555",
        },
        infoValue: {
            fontSize: 13,
        },
        inStock: {
            color: "#00C400",
        },
        outOfStock: {
            color: "red",
        },
        socialIconsRow: {
            flexDirection: "row",
            gap: 5,
        },
        offerRow: {
            marginVertical: 10,
        },
        offerText: {
            color: "#00C400",
            fontWeight: "bold",
        },
        stockContainer: {
            marginTop: 10,
        },
        stockText: {
            fontSize: 13,
        },
        progressBar: {
            height: 8,
            backgroundColor: "#ddd",
            borderRadius: 5,
            marginTop: 5,
        },
        progressFill: {
            height: "100%",
            backgroundColor: "#FEB53E",
            borderRadius: 5,
        },
    }
)