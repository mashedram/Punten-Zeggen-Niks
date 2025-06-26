import { TeamColors } from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from 'react-native';
import { RoleItemList } from './RoleItemList';
import { RoleCards } from '@/constants/RoleCards';
import Svg, { Circle } from 'react-native-svg';
import { defaultDeckSize } from '@/constants/RoleCardDeck';
import CardCountBar from './CardCountBar';
import { PowerCards } from '@/constants/powercard/PowerCards';

interface GameRuleOverlayContentProps {
  onClose: () => void;
}

export const GameRuleOverlayContent = ({
  onClose,
}: GameRuleOverlayContentProps) => {
  const [page, setPage] = useState(0);
  const maxPages = rulePages.length - 1;

  return (
    <Modal style={styles.container} transparent>
      <View style={styles.primaryContainer}>
        <View style={styles.titleContainer}>
          <View style={styles.innerTitleContainer}>
            <Text style={styles.title}>Spelregels</Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.contentContainer}>
            <View style={styles.contentPageContainer}>
              <View style={styles.primaryPageContainer}>{rulePages[page]}</View>
            </View>
          </View>
          <View style={styles.contentNavigation}>
            <View style={styles.navigationContainer}>
              <View style={styles.navigationLeftContainer}>
                <TouchableOpacity
                  style={
                    page <= 0
                      ? styles.navigationButtonGray
                      : styles.navigationButtonGreen
                  }
                  onPress={() => {
                    if (page <= 0) {
                      setPage(0);
                    } else {
                      setPage(page - 1);
                    }
                  }}
                  disabled={page <= 0}>
                  <Text style={styles.navigationText}>Vorige</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.navigationRightContainer}>
                <TouchableOpacity
                  style={
                    page >= maxPages
                      ? styles.navigationButtonGray
                      : styles.navigationButtonGreen
                  }
                  onPress={() => {
                    if (page >= maxPages) {
                      setPage(maxPages);
                    } else {
                      setPage(page + 1);
                    }
                  }}
                  disabled={page >= maxPages}>
                  <Text style={styles.navigationText}>Volgende</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bottomCard}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => onClose()}>
            <Text style={styles.buttonText}>Sluiten</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export const GameRuleOverlay = () => {
  const [isOpen, setOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return <GameRuleOverlayContent onClose={() => setOpen(false)} />;
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(92, 163, 194, 1)',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryContainer: {
    width: '100%',
    height: '90%',
    backgroundColor: 'rgba(92, 163, 194, 1)',
  },
  titleContainer: {
    width: '100%',
    height: '8%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerTitleContainer: {
    height: '100%',
    width: '98%',
    backgroundColor: 'rgba(71, 72, 73, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    height: '90%',
    width: '100%',
    marginTop: 10,
  },
  contentContainer: {
    width: '100%',
    height: '90%',
  },
  contentPageContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  primaryPageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  pageContent: {
    width: '100%',
    height: '100%',
  },
  pageTitelContainer: {
    width: '100%',
    height: '7%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  pageTitleText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
  },
  pageContentContainer: {
    width: '100%',
    height: '93%',
  },
  pageContentText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  CaptainEllipse: {
    position: 'absolute',
    borderRadius: 10,
  },
  CaptainText: {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    left: 5,
    top: 3,
  },
  CaptainIcon: {
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Inter',
    fontSize: 45,
    fontWeight: '700',
    zIndex: -1,
  },
  contentNavigation: {
    bottom: 0,
    width: '100%',
    height: '10%',
    padding: 5,
  },
  navigationContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 12,
  },
  navigationLeftContainer: {
    display: 'flex',
    height: '100%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationRightContainer: {
    display: 'flex',
    height: '100%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationButtonGreen: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(112, 194, 92, 1)',
  },
  navigationButtonGray: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(71, 72, 73, 1)',
  },
  navigationText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    height: '100%',
  },
  bottomCard: {
    width: '100%',
    height: '20%',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 6,
  },
  button: {
    position: 'relative',
    flexShrink: 0,
    height: '40%',
    width: '100%',
    paddingTop: 4,
    paddingBottom: 3,
    backgroundColor: 'rgba(112, 194, 92, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 10,
    paddingHorizontal: 59,
    borderRadius: 12,
    marginVertical: 10,
  },
  buttonText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 20,
    fontWeight: 700,
  },
});

const roleListImgSize = 48;

const rulePages = [
  <View style={styles.pageContent}>
    <View style={styles.pageTitelContainer}>
      <Text style={styles.pageTitleText}>Welkom</Text>
    </View>
    <ScrollView style={styles.pageContentContainer}>
      <View style={{ width: '100%', height: '100%' }}>
        <Text style={styles.pageContentText}>Welkom bij Flagged Victory!</Text>
        <Text style={styles.pageContentText}>
          Voordat je de lobby in komt volgt er hier nog een uitleg over het spel
          dat je gaat spelen.
        </Text>
        <Text style={styles.pageContentText}>
          Dit is een digitale versie van Levend stratego, zo dadelijk wordt de
          lobby in 2 teams verdeeld.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
          }}>
          <View style={{ display: 'flex', width: '45%', alignItems: 'center' }}>
            <Text
              style={[styles.pageContentText, { color: TeamColors.red.color }]}>
              Team Rood
            </Text>
          </View>
          <View style={{ display: 'flex', width: '10%', alignItems: 'center' }}>
            <Text style={styles.pageContentText}>en</Text>
          </View>
          <View style={{ display: 'flex', width: '45%', alignItems: 'center' }}>
            <Text
              style={[
                styles.pageContentText,
                { color: TeamColors.blue.color },
              ]}>
              Team Blauw
            </Text>
          </View>
        </View>
        <Text style={styles.pageContentText}>
          Bij elk team wordt er een teamleider aangewezen. Dit is te zien aan
          het volgende icoontje: <FontAwesome5 name="medal" size={20} />
        </Text>
        <Text style={styles.pageContentText}>
          In de lobby is deze te zien naast je naam en tijdens het spel is dit
          te zien bovenaan je scherm.
        </Text>
        <Text style={styles.pageContentText}>
          Als er: <FontAwesome5 name="crown" size={20} /> , naast je naam staat
          in de lobby dan ben je de host. Als jij de host bent kan je op een
          naam van een speler klikken. Wanneer deze speler gekozen wordt krijgt
          hij dan de prioriteit om een teamleider te zijn. Je kan er meer dan 2
          kiezen, maar dan kiest het spel er nog steeds twee. Het spel kiest dan
          welke van de geselecteerde spelers een teamleider wordt.
        </Text>
      </View>
    </ScrollView>
  </View>,
  <View style={styles.pageContent}>
    <View style={styles.pageTitelContainer}>
      <Text style={styles.pageTitleText}>Hoe start je het spel?</Text>
    </View>
    <ScrollView style={styles.pageContentContainer}>
      <Text style={styles.pageContentText}>
        Als alle spelers die mee willen doen in de lobby zijn gekomen door
        middel van het invoeren van de lobby code of het scannen van de qr-code
        kan de host het spel beginnen door op de 'start' knop te drukken.
      </Text>
      <Text style={styles.pageContentText}>
        Zodra het spel is begonnen moeten beide teamleiders een speler aanwijzen
        die de rol: Vlag krijgt. De teamleiders kunnen dit doen door op het{' '}
        <FontAwesome5 name="medal" size={20} /> icoon te drukken. Er wordt dan
        een menu geopend waarin de teamleider een speler kan kiezen en die de
        vlag krijgt, dit kan door op de vlag knop te drukken binnen dit menu.
      </Text>
      <Text style={styles.pageContentText}>
        Als er binnen een team een vlag is aangewezen, kan de rest van het team
        een rol ontvangen. Als iedereen een rol heeft ontvangen kan het spel
        beginnen.
      </Text>
    </ScrollView>
  </View>,
  <View style={styles.pageContent}>
    <View style={styles.pageTitelContainer}>
      <Text style={styles.pageTitleText}>Welke rollen zijn er</Text>
    </View>
    <ScrollView style={styles.pageContentContainer}>
      <Text style={styles.pageContentText}>
        Dit is een lijst van alle rollen
      </Text>
      {Object.values(RoleCards).map((roleCard, idx) => (
        <RoleItemList
          key={roleCard.id ?? idx}
          roleCard={roleCard}
          size={roleListImgSize}
          textStyle={styles.pageContentText}
        />
      ))}
    </ScrollView>
  </View>,
  <View style={styles.pageContent}>
    <View style={styles.pageTitelContainer}>
      <Text style={styles.pageTitleText}>Hoe speel je het spel?</Text>
    </View>
    <ScrollView style={styles.pageContentContainer}>
      <Text style={styles.pageContentText}>
        Het spel eindigt zodra je de vlag van de tegenstander hebt gevonden en
        hebt aangevallen.
      </Text>
      <Text style={styles.pageContentText}>
        Je valt een speler aan door deze persoon aan te tikken. De persoon die
        iemand aan heeft getikt is de aanvaller en de persoon die aangetikt is,
        is de verdediger.
      </Text>
      <Text style={styles.pageContentText}>
        De aanvaller scant de qr-code van de verdediger of voert de aanvalscode
        van de verdediger in en drukt op de knop 'aanvallen'.
      </Text>
      <Text style={styles.pageContentText}>
        Je kan op je rol afbeelding drukken om de qr-code te weergeven die de
        aanvaller moet scannen.
      </Text>
      <Text style={styles.pageContentText}>
        De speler met een hogere rol in de lijst wint het gevecht, met een
        aantal uitzonderingen.
      </Text>
      <Text style={styles.pageContentText}>
        Als je verliest of gelijk speelt verlies je jouw rol en moet je een
        nieuwe halen bij de teamleider.
      </Text>
    </ScrollView>
  </View>,
  <View style={styles.pageContent}>
    <View style={styles.pageTitelContainer}>
      <Text style={styles.pageTitleText}>Uitzonderingen</Text>
    </View>
    <ScrollView style={styles.pageContentContainer}>
      <Text style={styles.pageContentText}>
        Als de bom wordt aangevallen, explodeert de bom. De aanvallende speler
        en de speler met de bom verliezen beide hun rol.
      </Text>
      <Text style={styles.pageContentText}>
        Als de bom wordt aangevallen door een mineur, verliest de bom.
      </Text>
      <Text style={styles.pageContentText}>
        Als de maarschalk wordt aangevallen door een spion, verliest de
        maarschalk.
      </Text>
    </ScrollView>
  </View>,
  <View style={styles.pageContent}>
    <View style={styles.pageTitelContainer}>
      <Text style={styles.pageTitleText}>Teamleider rol</Text>
    </View>
    <ScrollView style={styles.pageContentContainer}>
      <Text style={styles.pageContentText}>
        Als een speler een rol verliest, moet deze speler terug naar de
        teamleider om een nieuwe rol te ontvangen.
      </Text>
      <Text style={styles.pageContentText}>
        De teamleider kan een nieuwe rol aan een speler geven door op de
        teamleider icoon te drukken: <FontAwesome5 name="medal" size={20} />.
      </Text>
      <Text style={styles.pageContentText}>
        De teamleider kan dan een speler kiezen uit de lijst van spelers en deze
        een rol geven door op de rol te drukken die de teamleider wilt
        aanwijzen.
      </Text>
      <Text style={styles.pageContentText}>
        Je kan als teamleider zien hoeveel spelers er een nieuwe rol nodig
        hebben door het nummer in het rode bolletje.
      </Text>
      <View style={{ marginLeft: 60, marginTop: 20 }}>
        <View>
          <Svg
            style={styles.CaptainEllipse}
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none">
            <Circle cx={10} cy={10} r={10} fill="#FF2424" />
          </Svg>
          <Text style={styles.CaptainText}>{3}</Text>
        </View>
        <FontAwesome5 name="medal" size={40} style={styles.CaptainIcon} />
      </View>
      <Text style={styles.pageContentText}>
        In dit voorbeeld zijn er 3 spelers die een rol nog moeten ontvangen.
      </Text>
      <Text style={styles.pageContentText}>
        De nummers onder de rollen geven aan hoeveel kaarten er nog over zijn
        van die rol. Als het op 0 staat, kan je die rol niet meer uitdelen.
      </Text>
    </ScrollView>
  </View>,
  <View style={styles.pageContent}>
    <View style={styles.pageTitelContainer}>
      <Text style={styles.pageTitleText}>Team voortgang</Text>
    </View>
    <ScrollView style={styles.pageContentContainer}>
      <Text style={styles.pageContentText}>
        Elk team begint met een deck van {defaultDeckSize} rollen. Als een team
        een rolkaart verliest, wordt het uit het deck gehaald en kan deze niet
        meer worden gebruikt in het spel.
      </Text>
      <Text style={styles.pageContentText}>
        Bovenaan het scherm kan je zien hoeveel kaarten beide teams nog in hun
        deck hebben zitten.
      </Text>
      <CardCountBar blueCardCount={43} redCardCount={23} />
      <Text style={styles.pageContentText}>
        In dit voorbeeld heeft team blauw 43 kaarten over en team rood 23
        kaarten over.
      </Text>
      <Text style={styles.pageContentText}>
        Als er geen kaarten meer in het deck zitten kunnen spelers geen rollen
        meer ontvangen en doen deze spelers niet meer mee met het spel.
      </Text>
      <Text style={styles.pageContentText}>
        Het spel is pas afgelopen als de vlag is aangevallen.
      </Text>
    </ScrollView>
  </View>,
  <View style={styles.pageContent}>
    <View style={styles.pageTitelContainer}>
      <Text style={styles.pageTitleText}>De Vlag rol</Text>
    </View>
    <ScrollView style={styles.pageContentContainer}>
      <Text style={styles.pageContentText}>
        Als vlag heb je een extra taak, voor elke rol die je team verslaat krijg
        je die rol zijn waarde, in punten. Als er een bom wordt verslagen krijg
        je 1 punt en als een maarschalk wordt verslagen krijg je 10 punten. Je
        kan in het overzicht van rollen zien hoeveel een rol waard is.
      </Text>
      <Text style={styles.pageContentText}>
        Deze punten kun je spenderen in de Power-up shop. Deze power-ups kan je
        dan geven aan spelers in je team.
      </Text>
    </ScrollView>
  </View>,
  <View style={styles.pageContent}>
    <View style={styles.pageTitelContainer}>
      <Text style={styles.pageTitleText}>Power-ups</Text>
    </View>
    <ScrollView style={styles.pageContentContainer}>
      <Text style={styles.pageContentText}>
        Als je niet de vlag bent kan je onderaan je scherm het power-up menu
        openen. In dit menu kan je zien hoeveel power-ups je hebt en kun je ze
        activeren.
      </Text>
      <Text style={styles.pageContentText}>
        Power-ups die te maken hebben met aanvallen of verdedigen moeten worden
        geactiveerd voordat je het gevecht begint.
      </Text>
      <Text style={styles.pageContentText}>
        De volgende power-ups zitten in het spel:
      </Text>
      <View
        style={{
          width: '100%',
          marginTop: 5,
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderColor: 'gray',
        }}>
        {Object.values(PowerCards).map((card, idx: number) => (
          <View key={idx} style={{ flexDirection: 'row' }}>
            <View style={{ display: 'flex', width: '30%' }}>
              <Text style={[styles.pageContentText, { fontWeight: 'bold' }]}>
                {(card as { name: string }).name}:
              </Text>
              <Text style={[styles.pageContentText, { marginTop: 2 }]}>
                prijs: {(card as { cost: number }).cost}
              </Text>
            </View>
            <View style={{ display: 'flex', marginLeft: 5, width: '70%' }}>
              <Text style={styles.pageContentText}>
                {(card as { description: string }).description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  </View>,
];
