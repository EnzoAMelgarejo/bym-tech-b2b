import React from 'react';
import { View, StyleSheet } from 'react-native';
import FooterSection from './footerComponents/footerSection';
import Newsletter from './footerComponents/newsLetter';
import SocialIcons from './footerComponents/socialIcons';
import { useTranslation } from 'react-i18next';

// Secciones del footer
const sections = [
  {
    titleKey: 'Contacto',
    items: [{ labelKey: 'Información', path: '/contact/informacion' }],
  },
  {
    titleKey: 'Catálogo',
    items: [
      { labelKey: 'Dónde comprar', path: '/findUs' },
      { labelKey: 'Formularios', path: '/forms' },
      { labelKey: 'Garantía', path: '/garanty' },
      { labelKey: 'Blog', path: '/blog' },
    ],
  },
  {
    titleKey: 'Nosotros',
    items: [
      { labelKey: 'Nuestra Historia', path: '/nosotros/historia' },
      { labelKey: 'Trabaja con nosotros', path: '/nosotros/trabaja' },
    ],
  },
];

// Componente principal del footer
const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.footerContainer}>
      <View style={styles.row}>
        {sections.map((section, index) => (
          <FooterSection
            key={index}
            title={t(section.titleKey)} // Traducción del título
            items={section.items.map((item) => ({
              label: t(item.labelKey), // Traducción de las etiquetas
              path: item.path,
            }))}
          />
        ))}
      </View>
      <View style={styles.row}>
        <SocialIcons />
        <Newsletter />
      </View>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    bottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

export default Footer;
