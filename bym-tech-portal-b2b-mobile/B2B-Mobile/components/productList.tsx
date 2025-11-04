// ProductList.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Pressable, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router'; // Importa usePathname
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import ProductCard from './productCard';
import B2bOnlyClick from './b2bOnlyClick';
import { environment } from '@/configuration/environment';

interface Props {
  title?: string;
  products?: { title: string; image: any }[]; // Cambia según tu estructura
  b2bOnlyClick: Array<object>;
}

export const ProductList: React.FC<Props> = ({ title, products, b2bOnlyClick }) => {
  const pathname = usePathname();  // Usa usePathname en lugar de useRoute
  const isProductsPage = pathname === '../components/products';  // Compara la ruta actual
  const [itemsOnlyDetail, setOnlyClickDetail] = useState([]); // Define el estado para las categorías

  useEffect(() => {
    const fetchOnlyClickDetail = async (item: any) => {
      const data = await getOnlyClickDetails(item);
      setOnlyClickDetail(data);
    };
    fetchOnlyClickDetail(b2bOnlyClick);
  }, []);

  return (
    <View>
      {title &&
        <View>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>{title}</Text>
            <SimpleLineIcons name="options" size={24} color="white" />
          </Pressable>
        </View>}

      <FlatList
        data={itemsOnlyDetail}
        renderItem={({ item }) => (
          <ProductCard
            title={item.name}
            image={item.img1}
            product={item}
            key={item.code}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal={!isProductsPage} // Cambia entre horizontal o vertical
        numColumns={isProductsPage ? 2 : 1} // Muestra 2 columnas si es la página de productos, 1 en otras rutas
        nestedScrollEnabled // Habilita el scroll anidado dentro de ScrollView
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

async function getOnlyClickDetails(item: any) {
  const filterOnlyClick = JSON.parse(item.filterJson);
  const field = filterOnlyClick.field || 'code';
  const order = filterOnlyClick.order || 'asc';
  const baseUrl = `${environment.SERVER_URL}/api/sync/product`;
  const params = new URLSearchParams({
    one: 'false',
    field: field,
    order: order,
    offset: '0',
    rows: item.size,
    client: '000001',  // Asegúrate de que el cliente esté configurado correctamente
  });
  
  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: filterOnlyClick,
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Hubo un problema con la solicitud fetch:', error.message);
    return [];
  }
}

export default ProductList;
