import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Text, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const sections = [
  { title: 'Productos', path: '/products', translationKey: 'Productos' },
  { title: 'Dónde comprar', path: '/findUs', translationKey: 'Donde Comprar' },
  { title: 'Garantía', path: '/garanty', translationKey: 'Garantía' },
  { title: 'Formularios', path: '/forms', translationKey: 'Formularios' },
];

interface MenuProps {
  menuVisible: boolean;
  activeSection: string | null;
  handlePress: (path: string) => void;
}

export const Menu: React.FC<MenuProps> = ({ menuVisible, activeSection, handlePress }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { t, i18n } = useTranslation();

  const handleChangeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang); // Cambia el idioma con i18next
      setModalVisible(false); // Cierra el modal después de cambiar el idioma
      console.log(`Idioma cambiado a: ${lang}`);
    } catch (error) {
      console.error('Error al cambiar el idioma:', error);
    }
  };

  return menuVisible ? (
    <View style={styles.menu}>
      {sections.map(({ path, translationKey }) => (
        <Pressable key={path} onPress={() => handlePress(path)} style={styles.menuItem}>
          <View style={activeSection === path ? styles.activeUnderline : styles.inactive}>
            <Text style={[styles.text, activeSection === path ? styles.activeText : styles.inactiveText]}>
              {t(translationKey)}
            </Text>
          </View>
        </Pressable>
      ))}

      {/* Opción de Idioma */}
      <Pressable onPress={() => setModalVisible(true)} style={styles.menuItem}>
        <View style={styles.languageOption}>
          <Ionicons name="settings-outline" size={16} color="gray" />
          <Text style={styles.text}>{t('Idioma')}</Text>
        </View>
      </Pressable>

      {/* Modal de Idiomas */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('Seleccionar idioma')}</Text>
            <Pressable onPress={() => handleChangeLanguage('en')} style={styles.languageButton}>
              <Text style={styles.languageText}>English</Text>
            </Pressable>
            <Pressable onPress={() => handleChangeLanguage('es')} style={styles.languageButton}>
              <Text style={styles.languageText}>Español</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>{t('Cerrar')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  menu: {
    top: 80,
    right: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
  },
  menuItem: {
    paddingVertical: 10,
  },
  activeUnderline: {
    borderBottomWidth: 3,
    borderBottomColor: '#ff9c2a',
    borderRadius: 5,
    paddingBottom: 5,
  },
  inactive: {
    paddingBottom: 5,
  },
  text: {
    color: 'black',
    marginLeft: 8,
  },
  activeText: {
    color: '#ff9c2a',
  },
  inactiveText: {
    color: 'gray',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ff9c2a',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Menu;
