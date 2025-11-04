// Navbar.tsx
import React, { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, Image, Text } from 'react-native';
import Constants from 'expo-constants';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Menu } from './menu';
import { useUser } from './userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { environment } from '@/configuration/environment';

export default function Navbar() {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const router = useRouter();
  const [user, setUserData] = useState({}); // Obtener el nombre y rol del usuario
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Recuperar el token almacenado en AsyncStorage
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          await setToken(storedToken);  // Guarda el token en el estado
        }
      } catch (error) {
        console.error('Error al obtener el token', error);
      }
    };

    const getUser = async () => {
      const baseUrl = `${environment.SERVER_URL}/api/controller/users`;
      const params = new URLSearchParams({
        orderField: 'id',
        orderDir: 'asc',
        one: 'true'
      });

      const url = `${baseUrl}?${params.toString()}`;
      console.log(token)
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }

        const data = await response.json();
        setUserData(data)

      } catch (error) {
        console.error('Hubo un problema con la solicitud fetch:', error.message, error);
      }

    };

    getUser()
    fetchToken();
  }, []);



  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  const handlePress = (section: string) => {
    setActiveSection(section);
    router.push(section);
  };

  const getUserRoleLabel = () => {
    switch (role) {
      case 'cliente':
        return 'Cliente';
      case 'vendedor':
        return 'Vendedor';
      case 'vendedorRepresentante':
        return 'Vendedor (Representante)';
      default:
        return '';
    }
  };

  return (
    <View style={styles.navbar}>
      <Link href="/" asChild>
        <Pressable>
          <Image source={require('../assets/images/Logo.png')} style={styles.logo} />
        </Pressable>
      </Link>

      <View style={styles.rightSection}>
        <Link href="/myAccount" asChild>
          <Pressable style={styles.userIcon}>
            <FontAwesome name="user-circle" size={30} color="#00c400" />
            <View>
              <Text style={styles.textStyle}>{user.name}</Text>
              <Text style={styles.roleStyle}>{user.role}</Text>
            </View>
          </Pressable>
        </Link>

        <Link href="/cart" asChild>
          <Pressable>
            <Image source={require('../assets/images/cart.png')} style={styles.icon} />
          </Pressable>
        </Link>

        <Pressable onPress={toggleMenu}>
          <FontAwesome name="bars" size={30} color="#00c400" />
        </Pressable>
      </View>

      <Menu menuVisible={menuVisible} activeSection={activeSection} handlePress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: Constants.statusBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    shadowColor: '#000',
    position: 'absolute',
    zIndex: 1,
  },
  logo: {
    width: 150,
    height: 60,
    resizeMode: 'contain',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  userIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  textStyle: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  roleStyle: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
});


