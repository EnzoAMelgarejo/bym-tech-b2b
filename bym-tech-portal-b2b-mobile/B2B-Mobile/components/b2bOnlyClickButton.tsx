import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Image, FlatList } from 'react-native';
import ProductList from './productList';
import { MaterialIcons } from '@expo/vector-icons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useRoute } from '@react-navigation/native';

import ProductsData from '../data/productData';
import Footer from './footer';
import { environment } from '@/configuration/environment';


export const b2bOnlyClickButton: React.FC = () => {
    const [categories, setCategories] = useState([]); // Define el estado para las categorías
    const [b2bOnlyClick, setOnlyClick] = useState([])
    useEffect(() => {
        // Llama a getCategories y actualiza el estado cuando los datos estén listos
        const fetchCategories = async () => {
            const data = await getCategories();
            setCategories(data);
        };
        const fetchOnlyClick = async () => {
            const data = await getOnlyClick();
            setOnlyClick(data)
        }
        fetchOnlyClick();
        fetchCategories();
    }, []); // El array vacío asegura que solo se ejecute una vez al montar el componente
    if (b2bOnlyClick.length) {
        return (
            <View style={styles.section}>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonText} numberOfLines={1} ellipsizeMode="tail">Categorias</Text>
                    <SimpleLineIcons name="options" size={24} color="white" />
                </Pressable>
                <View style={styles.categoriesRow}>
                    <FlatList
                        data={categories}
                        renderItem={({ item }) => (
                            <View key={item.id} style={styles.categoryCard}>
                                <Image source={{ uri: item.img }} style={styles.categoryImage} />
                                <Text>{item.name}</Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true} // Cambia entre horizontal o vertical
                        nestedScrollEnabled // Habilita el scroll anidado dentro de ScrollView
                    />

                </View>
            </View>)
    }
}

const styles = StyleSheet.create({
    categoryImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        resizeMode: 'cover'
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

async function getOnlyClick() {
    const baseUrl = `${environment.SERVER_URL}/api/controller/promotion`;
    const params = new URLSearchParams({
        one: 'false',
        type: 'ONLY_CLICK_GROUP_1',
        orderField: 'order',
        orderDir: 'asc'
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

export default b2bOnlyClickButton