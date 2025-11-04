import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { environment } from '@/configuration/environment';
import filterCategoriesData from '../data/categoryFilter';

const FiltersMenu = () => {


  return (

    <ScrollView style={styles.menu} nestedScrollEnabled={true} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{'Marca'}</Text>
        {brandFilter.map((element) => {
          const key = element.id;
          return (
            <View key={key} style={styles.elementItem}>
              {/* Agregar las CheckBox PENDIENTE*/}
              <Pressable onPress={() => setSelectedBrand(prevItems => [...prevItems, element])}>
                <Text style={styles.elementText}>{element.description}</Text>
              </Pressable>
            </View>
          );
        })}
        <View style={styles.separator} />
        <Text style={styles.categoryTitle}>{'Categoria'}</Text>
        {filter1.map((element) => {
          const key = element.id;
          return (
            <View key={key} style={styles.elementItem}>
              {/* Agregar las CheckBox PENDIENTE*/}
              <Pressable onPress={() => setSelected(prevItems => [...prevItems, element])}>
                <Text style={styles.elementText}>{element.description}</Text>
              </Pressable>
            </View>
          );
        })}
        <View style={styles.separator} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 2,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    marginVertical: 10, // Espaciado vertical
  },
  menu: {
    padding: 10,
    position: 'absolute',
    zIndex: 10,
    backgroundColor: '#ffff',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#707070',
    left: 120,
    top: 45,
    maxHeight: 400,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  elementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  elementText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default FiltersMenu;
