import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importa tus traducciones
import en from './locales/en.json';
import es from './locales/es.json';

// Configuración de i18next
i18n
  .use(initReactI18next) // Integración con React
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en', // Idioma por defecto
    lng: 'en', // Idioma inicial
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    interpolation: {
      escapeValue: false, // React ya maneja el escape
    },
  });

// Guardar el idioma en AsyncStorage cuando se cambie
i18n.on('languageChanged', (lng) => {
  AsyncStorage.setItem('language', lng).catch((err) =>
    console.error('Error al guardar el idioma:', err)
  );
});

// Recuperar el idioma desde AsyncStorage al inicio
AsyncStorage.getItem('language')
  .then((lng) => {
    if (lng) i18n.changeLanguage(lng);
  })
  .catch((err) => console.error('Error al recuperar el idioma:', err));

  i18n.init({
    debug: true,
    // Otras configuraciones
  });

export default i18n;
