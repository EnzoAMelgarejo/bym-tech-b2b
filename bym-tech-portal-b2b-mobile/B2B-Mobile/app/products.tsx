import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Image, Pressable, Text, } from 'react-native';
import ProductCard from '../components/productCard';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import FilterMenu from '@/components/filterMenu';
import ProductsData from '../data/productData';
import Footer from '../components/footer';
import { environment } from '@/configuration/environment';


const Products = () => {
  const [itemProdImg, setItemProdImg] = useState([]);

  const [showFilters, setShowFilters] = useState(false);
  const [waitProduct, setWaitProduct] = useState(false);
  const [itemProd, setItemProd] = useState([])
  const [features, setItemsFeatures] = useState(null)
  const [itemsRecommended, setItemsRecommended] = useState([])
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: boolean }>({});
  const [brandFilter, setBrandFilter] = useState([]);
  const [range, setRange] = useState([0, 999999])
  //
  const [filter1, setFilter1] = useState([]);
  const [filter2, setFilter2] = useState([]);
  const [filter3, setFilter3] = useState([]);
  const [filter4, setFilter4] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selected2, setSelected2] = useState([]);
  const [selected3, setSelected3] = useState([]);
  const [selected4, setSelected4] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);


  const handleCheckboxChange = (category: string, element: string) => {
    const key = `${category}-${element}`;
    setSelectedFilters({
      ...selectedFilters,
      [key]: !selectedFilters[key],  // Alterna entre seleccionado y no seleccionado
    });
  };

  const fetchBrandFilter = async () => {
    try {
      const data = await fetch(`${environment.SERVER_URL}/api/sync/brand?one=false&field=code&order=asc&offset=0&rows=100`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setBrandFilter(await data.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const refreshSubFilter = async () => {
    try {
      const data = await fetch(`${environment.SERVER_URL}/api/sync/filter1?one=false&field=code&order=asc&offset=0&rows=100`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setFilter1(await data.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const refreshSubFilter2 = async () => {
    const filter = {
      model: 'PRODUCT',
      filters: []
    }

    var filterCateg = { code: 'father', type: 'LIST', value: '', list: [] }

    selected.forEach(value => {
      filterCateg.list.push(value.code);
    });

    if (selected.length > 0) {
      filter.filters.push(filterCateg);
    }

    try {
      const data = await fetch(`${environment.SERVER_URL}/api/sync/filter2?one=false&field=code&order=asc&offset=0&rows=100`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filter)
      });
      setFilter2(await data.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  //@ts-ignore
  const constructFilter = (categ, filter2, filter3, filter4, filterbrand) => {
    var filter = {
      model: 'PRODUCT',
      filters: []
    }

    var filterRange = { code: 'price', type: 'BETWEEN', value: '', list: [range[0], range[1]] }
    filter.filters.push(filterRange);

    var filterSearch = { code: 'search', type: 'LIKE', value: '', list: [] }

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
  };

  const getProduct = async () => {
    setWaitProduct(true);
    try {
      const filter = await constructFilter(selected, selected2, selected3, selected4, selectedBrand);
      const response = await fetch(`${environment.SERVER_URL}/api/sync/product?one=false&field=code&order=asc&offset=0&rows=1&client=000001`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filter),
      });
      const data = await response.json();
      setItemProd(data);
      // Handle images
      //@ts-ignore
      //@ts-ignore
      console.log(data, "<--datita")
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



  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    fetchBrandFilter()
    refreshSubFilter()
    refreshSubFilter2()
    getProduct()
  })


  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.imageContainer01}>
        <Image source={require('../assets/images/Home01.png')} style={styles.home01} resizeMode='cover' />
      </View>

      <View style={styles.buttonContainer}>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Productos</Text>
          <SimpleLineIcons name="options" size={20} color="white" />
        </Pressable>

        {/* Botón de Relevancia */}
        <Pressable style={[styles.button, { backgroundColor: '#FF9C2A' }]}>
          <Text style={styles.buttonText}>Relevancia</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="white" />
        </Pressable>

        {/* Botón de Filtros */}
        <Pressable style={[styles.button, { backgroundColor: '#FF9C2A' }]} onPress={toggleFilters}>
          <Text style={styles.buttonText}>Filtros</Text>
          <Ionicons name="options-sharp" size={20} color="white" />
        </Pressable>

        {showFilters && (
          <FilterMenu />
        )}

      </View>


      <View style={styles.grid}>
        {itemProd.map((item) => (
          <View key={item.code} style={styles.column}>
            <ProductCard
              title={item.name}
              image={item.img1 || require('../assets/images/Image-not-found.png')}
              product={item}
              key={item.code}
            />
          </View>
        ))}
      </View>

      <Footer />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 100,
    paddingBottom: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Para que las tarjetas se ajusten automáticamente a varias líneas
    justifyContent: 'space-between', // Espacio uniforme entre columnas
  },
  column: {
    flexBasis: '48%', // Cada tarjeta ocupará el 48% del ancho para hacer dos columnas
    marginBottom: 15, // Espacio entre filas
  },
  imageContainer01: {
    width: '100%', // Ahora el contenedor ocupa todo el ancho de la pantalla
    height: 250, // Puedes ajustar esta altura
    justifyContent: 'center',
    alignItems: 'center',
  },
  home01: {
    width: '100%',
    height: '100%', // Altura para la primera imagen
    marginBottom: 30,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 10,
  },
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
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },

});

export default Products;

