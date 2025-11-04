import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, Alert, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { environment } from '@/configuration/environment';
//import { useShoppingCartStore } from '../path/to/your/store'; // Ajusta la ruta
import { useLocalSearchParams } from 'expo-router';

const ProductDetailCard = () => {
    const [rating, setRating] = useState(0);
    const [itemVisits, setItemVisits] = useState(0);
    const [model, setModel] = useState(null);
    const [selection, setSelection] = useState(null);
    const [imgAccesible, setImageAccessible] = useState(null);
    // const [cartStore] = useShoppingCartStore();
    const [items, setItems] = useState([]);
    const [itemProd, setItemProd] = useState({});
    const [isFavorite, setIsFavorite] = useState(false);

    const [itemProdImg, setItemProdImg] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [waitProduct, setWaitProduct] = useState(false);
    const [number, setNumber] = useState(1);
    const [error, setError] = useState(false);
    const product = {
        name: "Led",
        normalPrice: "$20.00",
        discountPrice: "$15.00",
        visits: 240,
        description: "Descripción breve del producto.",
        features: ["Característica 1", "Característica 2", "Característica 3"],
        colors: ["#FFFFFF", "#FF9C2A", "#00C400", "#000000"],
        sizes: ["S", "M", "L", "XL", "XXL"],
    }
    const [textError, setTextError] = useState('');
    const [itemsRecommended, setItemsRecommended] = useState([]);
    const handleImage = () => {
        const img = !imgAccesible ? require('../../assets/images/Image-not-found.png') : { uri: itemProdImg[0] }
        console.log('entro', img)
        return img
    };
    // Get the id and code from the route parameters
    const { id, code } = useLocalSearchParams();
    useEffect(() => {

        const checkImageUrl = async () => {
            try {
                await Image.prefetch(itemProdImg[0]);
                setImageAccessible(true);
            } catch {
                setImageAccessible(false);
            }
        };
        const fetchData = async () => {
            await getProduct();
        };

        fetchData();
        checkImageUrl();
    }, [id, code]);
    const getInteractions = async (code) => {
        try {
            const data = await fetch(`${environment.SERVER_URL}/api/controller/productInteraction?one=false&code=${code}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setItemVisits(data[0]._count.clicks)
        } catch (err) {
            console.log("Error en la solicitud fetch productInteraction: ", err)
        }
    }

    const getProduct = async () => {
        setWaitProduct(true);
        try {
            const filter = await constructFilter(code, null);
            const response = await fetch(`${environment.SERVER_URL}/api/sync/product?one=false&field=code&order=asc&offset=0&rows=1&client=000001`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filter),
            });
            const data = await response.json();
            console.log(data, "<--datita")
            const product = data[0];
            setItemProd(product);

            // Handle images
            //@ts-ignore
            setItemProdImg([
                product.img1 || '../../assets/images/Image-not-found.png',
                product.img2 || '../../assets/images/Image-not-found.png',
                product.img3 || '../../assets/images/Image-not-found.png',
                product.img4 || '../../assets/images/Image-not-found.png',
                product.img5 || '../../assets/images/Image-not-found.png',
            ].filter(Boolean));
            //@ts-ignore
            console.log(data, "<--datita")
            setItems([{ title: 'Feature', text: product.feature || 'Feature not found' }]);
            await fetchRecommendedItems(product.filter1);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setWaitProduct(false);
        }
    };

    const fetchRecommendedItems = async (filter) => {
        try {
            const response = await fetch(`${environment.SERVER_URL}/api/sync/product?one=false&field=code&order=asc&offset=0&rows=5&client=000001`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(await constructFilter(itemProd.code, [filter])),
            });
            const data = await response.json();
            setItemsRecommended(data);
        } catch (error) {
            console.error('Error fetching recommended items:', error);
        }
    };

    const constructFilter = async (categ, filter2, filter3, filter4, filterbrand) => {
        var filter = {
            model: 'PRODUCT',
            filters: []
        }

        var filterRange = { code: 'price', type: 'BETWEEN', value: '', list: [this.range[0], this.range[1]] }
        filter.filters.push(filterRange);

        var filterSearch = { code: 'search', type: 'LIKE', value: this.globalState.notifications.search, list: [] }

        filter.filters.push(filterSearch);

        if (filterbrand !== null && filterbrand.length > 0) {
            var brand = { code: 'brand', type: 'LIST', value: '', list: [] }

            filterbrand.forEach(value => {
                brand.list.push(value.code);
            });

            filter.filters.push(brand);
        }

        if (categ !== null && categ.length > 0) {
            var filterCateg = { code: 'filter1', type: 'LIST', value: '', list: [] }

            categ.forEach(value => {
                filterCateg.list.push(value.code);
            });

            filter.filters.push(filterCateg);
        }

        if (filter2 !== null && filter2.length > 0) {
            var filterCateg = { code: 'filter2', type: 'LIST', value: '', list: [] }

            filter2.forEach(value => {
                filterCateg.list.push(value.code);
            });

            filter.filters.push(filterCateg);
        }

        if (filter3 !== null && filter3.length > 0) {
            var filterCateg = { code: 'filter3', type: 'LIST', value: '', list: [] }

            filter3.forEach(value => {
                filterCateg.list.push(value.code);
            });

            filter.filters.push(filterCateg);
        }

        if (filter4 !== null && filter4.length > 0) {
            var filterCateg = { code: 'filter4', type: 'LIST', value: '', list: [] }

            filter4.forEach(value => {
                filterCateg.list.push(value.code);
            });

            filter.filters.push(filterCateg);
        }

        return filter;
    }

    const saveProduct = async () => {
        if (number <= 0) {
            setError(true);
            setTextError("Para agregar el producto al carrito se deben seleccionar 1 o más unidades.");
            return;
        }

        try {
            const response = await fetch('/api/controller/order?one=false&type=SHOPPING_CART');
            const data = await response.json();

            if (data["_rawValue"].length > 0) {
                const firstItem = data["_rawValue"][0];
                await fetch('/api/controller/itemsOrder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        code: itemProd.code,
                        img: itemProd.img1,
                        name: itemProd.name,
                        quant: number.toString(),
                        price: itemProd.price.toString(),
                        total: (number * Number(itemProd.price)).toString(),
                        updatedAt: new Date().toISOString(),
                        Order: { connect: { id: firstItem.id } }
                    }),
                });
                cartStore.increment();
            } else {
                throw new Error("Error al obtener datos del carrito actual.");
            }
        } catch (error) {
            setError(true);
            setTextError(error.message || "Error al grabar los datos del carrito.");
        }
    };

    return (
        <View style={styles.productContainer}>
            <Image source={handleImage()} style={styles.productImage} />

            <View style={styles.details}>
                <Text style={styles.title}>{itemProd.name}</Text>

                <View style={styles.priceRow}>
                    <Text style={styles.normalPrice}>{itemProd.price}</Text>
                    <Text style={styles.discountPrice}>{/**/}</Text>
                    <View style={styles.ratingContainer}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Pressable key={index} onPress={() => setRating(index + 1)}>
                                <MaterialIcons
                                    name={index < rating ? "star" : "star-border"}
                                    size={18}
                                    color={index < rating ? "#FFD700" : "#ccc"}
                                />
                            </Pressable>
                        ))}
                    </View>
                    <Text style={[styles.visits, { marginLeft: 0 }]}>{itemVisits} visitas</Text>
                </View>


                <Text style={styles.description}>{itemProd.bio}</Text>

                <Text style={styles.sectionTitle}>Características:</Text>
                {product.features.map((feature, index) => (
                    <Text key={index} style={styles.featureItem}>• {feature}</Text>
                ))}

                <View style={styles.colorRow}>
                    {product.colors.map((color, index) => (
                        <Pressable
                            key={index}
                            onPress={() => setSelectedColor(color)}
                            style={[
                                styles.colorBox,
                                { backgroundColor: color },
                                selectedColor === color && styles.selectedColorBox
                            ]}
                        />
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Tamaños disponibles:</Text>
                <View style={styles.sizeRow}>
                    {product.sizes.map((size, index) => (
                        <Pressable
                            key={index}
                            onPress={() => setSelectedSize(size)}
                            style={[
                                styles.sizeBox,
                                selectedSize === size && styles.selectedSizeBox
                            ]}
                        >
                            <Text style={[styles.sizeText, selectedSize === size && styles.selectedSizeText]}>{size}</Text>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.interactionBox}>
                    <Pressable onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)} style={styles.quantityButton}>
                        <Text style={styles.quantityText}>-</Text>
                    </Pressable>
                    <Text style={styles.quantityDisplay}>{quantity}</Text>
                    <Pressable onPress={() => setQuantity(quantity + 1)} style={styles.quantityButton}>
                        <Text style={styles.quantityText}>+</Text>
                    </Pressable>
                    <Pressable style={styles.cartButton}>
                        <Text style={styles.cartButtonText}>Añadir</Text>
                    </Pressable>
                    <Pressable onPress={() => setIsFavorite(!isFavorite)} style={styles.heartButton}>
                        <FontAwesome
                            name={isFavorite ? "heart" : "heart-o"}
                            size={20}
                            color={isFavorite ? "#00C400" : "#00C400"}
                        />
                    </Pressable>
                </View>
            </View>
        </View>

    );
};

const styles = StyleSheet.create(
    {
        productContainer: {
            flexDirection: 'row',
            paddingVertical: 15,
            backgroundColor: "#fff",
            borderRadius: 8,
        },
        productImage: {
            width: 140,
            height: 140,
            resizeMode: 'contain',
            marginRight: 10,
        },
        details: {
            flex: 1,
            justifyContent: 'flex-start',
        },
        title: {
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 6,
        },
        priceRow: {
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 5,
            flexWrap: 'wrap',
        },
        normalPrice: {
            fontSize: 13,
            textDecorationLine: "line-through",
            color: "#666666",
            marginRight: 5,
        },
        discountPrice: {
            fontSize: 15,
            fontWeight: "bold",
            color: "#FF9C2A",
        },
        ratingContainer: {
            flexDirection: "row",
            marginLeft: 5,
        },
        visits: {
            marginLeft: 8,
            fontSize: 12,
            color: "#888",
        },
        description: {
            marginVertical: 8,
            fontSize: 13,
            color: "#333",
        },
        sectionTitle: {
            fontSize: 14,
            fontWeight: "bold",
            marginTop: 6,
            marginBottom: 3,
        },
        featureItem: {
            fontSize: 12,
            color: "#555",
        },
        colorRow: {
            flexDirection: "row",
            marginTop: 5,
        },
        colorBox: {
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 1,
            marginRight: 5,
        },
        selectedColorBox: {
            borderWidth: 2,
            borderColor: "#555",
        },
        sizeRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 5,
        },
        sizeBox: {
            width: 30,
            height: 30,
            borderWidth: 1,
            borderColor: '#EEEEEE',
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 5,
            margin: 3,
        },
        selectedSizeBox: {
            borderWidth: 1,
            borderColor: "#FAAD3D",
        },
        sizeText: {
            fontSize: 12,
            fontWeight: "bold",
            color: "#333",
        },
        selectedSizeText: {
            color: "#FAAD3D",
            fontWeight: "bold",
        },
        interactionBox: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            flexWrap: 'wrap',
        },
        quantityButton: {
            width: 24,
            height: 24,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F6F6F6",
            borderRadius: 5,
            marginHorizontal: 3,
        },
        quantityText: {
            fontSize: 14,
            fontWeight: "bold",
        },
        quantityDisplay: {
            fontSize: 14,
            fontWeight: "bold",
            marginHorizontal: 3,
        },
        cartButton: {
            backgroundColor: "#00C400",
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 5,
            marginLeft: 8,
        },
        cartButtonText: {
            color: "#fff",
            fontWeight: "bold",
        },
        heartButton: {
            marginLeft: 10,
        },
    }
)

export default ProductDetailCard;
