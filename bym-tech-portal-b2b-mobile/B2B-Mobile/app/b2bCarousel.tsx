import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { environment } from '@/configuration/environment';
import Carousel from 'react-native-reanimated-carousel';

export const B2bCarousel = () => {
    const [itemsCarousel, setCarousel] = useState([]);
    const { width: screenWidth } = Dimensions.get('window');

    useEffect(() => {
        const getItems = async () => {
            const data = await getCarousel();
            setCarousel(data);
        };
        getItems();
    }, []);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.imageContainer} key={item.id}>
                <Image
                    source={{ uri: item.imgMobile }}
                    style={styles.image}
                />
            </View>
        );
    };

    if (!itemsCarousel.length) {
        return <Text>Cargando...</Text>;
    } else {
        return (
            <Carousel
                data={itemsCarousel}
                renderItem={renderItem}
                width={screenWidth}              // Configura el ancho al tamaño de la pantalla
                height={250}                     // Configura la altura que quieras para el carrusel
                loop                             // Habilita el loop para desplazamiento continuo
                autoPlay                         // Activa la reproducción automática
                autoPlayInterval={3000}          // Intervalo de reproducción automática en ms
                scrollAnimationDuration={1000}   // Duración de la animación en ms
            />
        );
    }
};

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: 250,
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

export default B2bCarousel;

async function getCarousel() {
    const baseUrl = `${environment.SERVER_URL}/api/controller/carousel`;
    const params = new URLSearchParams({
        one: 'false',
        orderField: 'order',
        orderDir: 'asc',
    });

    const url = `${baseUrl}?${params.toString()}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Hubo un problema con la solicitud fetch:', error.message, error);
        return [];
    }
}
