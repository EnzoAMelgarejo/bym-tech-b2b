// src/data/productsData.ts

interface Product {
    id: number;
    title: string;
    image: any; // Puedes usar un tipo más específico si tus imágenes tienen un tipo concreto
  }
  
  const ProductsData: Product[] = [
    {
      id: 1,
      title: 'Producto 1',
      image: require('../assets/images/lightexample.png'),
    },
    {
      id: 2,
      title: 'Producto 2',
      image: require('../assets/images/lightexample.png'),
    },
    {
      id: 3,
      title: 'Producto 3',
      image: require('../assets/images/lightexample.png'),
    },
    {
      id: 4,
      title: 'Producto 4',
      image: require('../assets/images/lightexample.png'),
    },
    {
      id: 5,
      title: 'Producto 5',
      image: require('../assets/images/lightexample.png'),
    },
    {
      id: 6,
      title: 'Producto 6',
      image: require('../assets/images/lightexample.png'),
    },
    {
      id: 7,
      title: 'Producto 7',
      image: require('../assets/images/lightexample.png'),
    },
    {
      id: 8,
      title: 'Producto 8',
      image: require('../assets/images/lightexample.png'),
    },
    {
      id: 9,
      title: 'Producto 9',
      image: require('../assets/images/lightexample.png'),
    },
    {
      id: 10,
      title: 'Producto 10',
      image: require('../assets/images/lightexample.png'),
    },
  ];
  
  export default ProductsData;