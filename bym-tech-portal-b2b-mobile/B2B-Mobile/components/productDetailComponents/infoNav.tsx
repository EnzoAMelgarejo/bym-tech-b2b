import React, {useState, useRef} from "react";
import { View, Text, ScrollView, StyleSheet, Animated, Pressable } from "react-native";
import { Dimensions } from "react-native";

// Obtener el ancho de la pantalla
const screenWidth = Dimensions.get('window').width;


export const InfoNav = () => {

    const [activeSection, setActiveSection] = useState(0);
    const scrollViewRef = useRef(null);
 
    // Controla el movimiento del indicador
    const animatedIndicator = new Animated.Value(0);
 
    // Función para actualizar el scroll y el indicador
    const handleNavPress = (index) => {
        setActiveSection(index);
        scrollViewRef.current.scrollTo({ x: index * screenWidth, animated: true }); // Ajusta el valor del scroll según el tamaño de la pantalla
 
        // Animación del indicador
        Animated.timing(animatedIndicator, {
            toValue: index,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };
 

    return (
        <View>

        <View style={styles.infoNav}>
            {["Descripción", "Información adicional", "Reseñas"].map((item, index) => (
                <Pressable
                    key={index}
                    style={styles.infoNavItem}
                    onPress={() => handleNavPress(index)}
                >
                    <Text style={[styles.infoNavText, activeSection === index && styles.activeNavText]}>
                        {item}
                    </Text>
                </Pressable>
            ))}
        </View>

        {/* Indicador de la sección activa */}
        <View style={styles.indicatorContainer}>
            <View
                style={[
                    styles.indicator,
                    {
                        left: `${activeSection * 33}%`, // Posiciona la flecha según la sección activa
                    },
                ]}
            />
        </View>

        {/* Secciones de contenido */}
        <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth); // Calcula la sección actual
                setActiveSection(index);
            }}
        >
            <View style={styles.section}>
                <Text>Contenido de la Descripción del Producto...</Text>
            </View>
            <View style={styles.section}>
                <Text>Contenido de Información Adicional...</Text>
            </View>
            <View style={styles.section}>
                <Text>Contenido de Reseñas del Producto...</Text>
            </View>
        </ScrollView>
   
        </View>
    )
}

const styles = StyleSheet.create(
    {
        infoNav: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#ddd",
            marginTop: 80,
        },
        infoNavItem: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
        },
        infoNavText: {
            fontSize: 16,
            fontWeight: "bold",
            color: "#555",
        },
        activeNavText: {
            color: "#00C400",  // Color naranja para la sección activa
        },
        indicatorContainer: {
            height: 3,
            flexDirection: 'row',
            justifyContent: 'space-around',
        },
        indicator: {
            width: 0,
            height: 0,
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderTopWidth: 10,
            borderStyle: 'solid',
            backgroundColor: 'transparent',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: '#00C400',
            position: 'absolute',
            bottom: -10,
        },
        section: {
            padding: 15,
        },
    }
)