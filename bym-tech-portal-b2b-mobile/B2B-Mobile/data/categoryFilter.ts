// src/data/filterCategoriesData.ts

interface FilterCategory {
    id: number;
    name: string;
    elements: string[];
  }
  
  const filterCategoriesData: FilterCategory[] = [
    { id: 1, name: 'Categorias', elements: ['Celulares', 'Laptops', 'Cámaras'] },
    { id: 2, name: 'Marca', elements: ['Led (323)', 'Metal (54)', 'Plastico (127)', 'lampara (17)', 'lampara (35)'] },
    { id: 3, name: 'Color', elements: ['Beige (171) ', 'Blanco (65)', 'Negro (105)', 'Azul (90)', 'Rojo (125)'] },
    { id: 4, name: 'Diseño', elements: ['Traditional (68)', 'Modern/ Contemporary (96)', 'Transitional (111)', 'Mid-Century (64)', 'Farmhouse / Cottage (4)'] },
    { id: 5, name: 'Precio', elements: ['Under $200 (11)', '$200-$500 (71)', '$500-$100 (148)', '$1000-$1500 (57)', '$1500-$2000 (25)', '$2000-$2500 (5)', '$3000 and up (2)'] },
    // Agrega más categorías y elementos según necesites
  ];
  
  export default filterCategoriesData;
  