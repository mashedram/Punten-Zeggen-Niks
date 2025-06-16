import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';

const infoSlides = [
  {
    titel: 'Hoe speel je het spel:',
    tekst: `• Je valt aan door de cijfer- of qr code van een tegenstander te scannen/in te voeren. 
    \n\
 • Je wint zodra je de vlag van het andere team (blauw/rood) verovert.`,
    subtitel: 'Teamleider',
    subtekst:
      'Als teamleider kies je welke rol je aan welk teamlid geeft, breng je teamleden terug in het spel en zie je het beschikbaar aantal kaarten van een rol.',
  },
  {
    titel: 'Algemene spelregels:',
    tekst: `• De pot bestaat uit rolkaarten 1 t/m 10 (minus 2) + de bom en de vlag.
    \n\
 • Als spelers elkaar aanvallen, wint de speler met de hoogste rang.
 \n\
 • Als je wordt aangetikt moet je verdedigen met je rolkaart.
 
 • Als je wordt verslagen, haal je een nieuwe rolkaart bij je teamleider.
 \n\
 • Als teamleider geef je een verslagen teamlid een nieuwe kaart door op het 🎖 icoon te drukken. `,
  },
  {
    titel: 'Specifieke rol spelregels:',
    tekst: `• De rolkaarten "Bom" en "Vlag" kunnen geen aanval initiëren.
    \n\
 • De Bom kan alleen door de Mineur (3) worden verslagen.
 \n\
 • De Spion (1) verslaat de Maarschalk (10), maar alleen als de Spion de aanval initieert.
 \n\
 • Als spelers met dezelfde rang elkaar aanvallen verliezen ze allebei.`,
  },
];

export const SpelregelI = () => {
  const [showInfo, setShowInfo] = React.useState(false);
  const [infoSlide, setInfoSlide] = React.useState(0);
  return (
    <View style={styles.SpelregelIContainer}>
      <Pressable onPress={() => setShowInfo(prev => !prev)}>
        <View style={styles.infoButton}>
          <Text style={styles.InfoButtonStyling}>i</Text>
        </View>
      </Pressable>
      {showInfo && (
        <View style={styles.SpelregelView}>
          <Text style={styles.TitelStyling}>{infoSlides[infoSlide].titel}</Text>
          <Text style={styles.TekstStyling}>{infoSlides[infoSlide].tekst}</Text>
          {infoSlide === 0 && (
            <>
              <Text style={styles.Subtitel}>{infoSlides[0].subtitel}</Text>
              <Text style={styles.Subtekst}>{infoSlides[0].subtekst}</Text>
            </>
          )}
          <View style={styles.ButtonContainer}>
            <View style={styles.PijlContainerStyling}>
              {infoSlide > 0 && (
                <Pressable onPress={() => setInfoSlide(infoSlide - 1)}>
                  <Text style={styles.PijlStyling}>{'←'}</Text>
                </Pressable>
              )}
              {infoSlide < infoSlides.length - 1 && (
                <Pressable onPress={() => setInfoSlide(infoSlide + 1)}>
                  <Text style={styles.PijlStyling}>{'→'}</Text>
                </Pressable>
              )}
            </View>
            <Pressable
              onPress={() => setShowInfo(false)}
              style={{ marginTop: 8 }}>
              <Text style={styles.SluitStyling}>Sluiten</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1976d2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  SpelregelinfoI: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -150 }],
    width: '72%',
    height: '30%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  SpelregelView: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    alignItems: 'center',
    zIndex: 20,
    width: 300,
    height: 460,
  },

  SpelregelIContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  InfoButtonStyling: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
  },
  SluitStyling: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  PijlStyling: {
    fontSize: 38,
    marginHorizontal: 16,
    fontWeight: 'bold',
  },
  ButtonContainer: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 30,
  },
  PijlContainerStyling: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    bottom: 10,
    flexDirection: 'row',
    marginTop: 8,
  },
  TekstStyling: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '600',
  },
  TitelStyling: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  Subtitel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
  },
  Subtekst: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
});
