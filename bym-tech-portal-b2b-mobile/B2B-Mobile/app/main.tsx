import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Image, FlatList } from 'react-native';
import ProductList from '@/components/productList';
import B2bOnlyClickButton from '@/components/b2bOnlyClickButton';
import { MaterialIcons } from '@expo/vector-icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import ProductsData from '../data/productData';
import Footer from '../components/footer';
import { environment } from '@/configuration/environment';
import { GlobalProvider } from './context/GlobalContext';
import Carousel from 'react-native-snap-carousel';
import B2bOnlyClick from '@/components/b2bOnlyClick';
import { B2bCarousel } from './b2bCarousel';
import B2bImagesProm from './b2bImagesProm';
//
const Main = () => {


    return (
            <ScrollView style={styles.container}>
                <View style={styles.imageContainer01}>
                    <B2bCarousel />
                </View>

                {/* Productos normales */}
                <View style={styles.section}>
                </View>

                {/* Categorías destacadas */}
                <View>
                    <B2bOnlyClickButton />
                </View>

                    <B2bImagesProm />

                {/* Productos seleccionados para vos */}
                <View style={styles.section}>
                    <B2bOnlyClick  />
                </View>

                <Footer />
            </ScrollView>
    );
};

const styles = StyleSheet.create({
    categoryImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        resizeMode: 'contain',
    },
    container: {
        marginTop: 100,
    },
    section: {
        paddingVertical: 20,
    },
    sectionTitle: {
        marginVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#00C400',
    },
    sectionTitleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap', // Permite que las tarjetas se muevan a la siguiente línea si es necesario
    },
    categoriesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    categoryCard: {
        width: 100,
        height: 100,
        backgroundColor: '#f0f0f0',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    // Estilos del botón de secciones
    button: {
        marginLeft: 10,
        backgroundColor: '#00C400',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 25,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
    },
    // Iconos en Categorías destacadas
    iconButton: {
        backgroundColor: '#2e2e2e',
        padding: 10,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    imageContainer01: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer02: {
        width: '100%',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
        position: 'relative',
    },
    home01: {
        width: '100%',
        height: '100%',
        marginBottom: 30,
    },
    home02: {
        width: '100%',
        height: '70%',
    }
});





//
async function getCategories() {
    const baseUrl = `${environment.SERVER_URL}/api/controller/category`;
    const params = new URLSearchParams({
        one: 'false',
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

export default Main;