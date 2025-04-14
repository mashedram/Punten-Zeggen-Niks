import React, {useState} from 'react'; 
import {Button, Text, View, ScrollView, StyleSheet} from 'react-native';

export function SpelersLijst() {
    
  return (
      <View style={styles.container}>
        <Text style={styles.title}>Spelers:</Text>
  
        <ScrollView style={styles.scrollBox}>
          {[...Array(8)].map((_, i) => (
            <Text key={i} style={styles.item}>naam {i + 1}</Text>
          ))}
        </ScrollView>
  
        <Text style={styles.footer}></Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      justifyContent: 'center',
    },
    title: {
      fontSize: 20,
      marginBottom: 10,
    },
    scrollBox: {
      height: 200, // 👈 This sets the visible height of the ScrollView
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
    },
    item: {
      paddingVertical: 8,
      fontSize: 17,
    },
    footer: {
      marginTop: 20,
      fontSize: 16,
    },
  });