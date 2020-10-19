import React, {  useState } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';

import mapMarkerImg from '../../src/images/map-marker.png';
import api from '../services/api';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function OrphanagesMap(){
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const navigation = useNavigation();

  useFocusEffect(() => {
    api.get('orphanages').then(response => {
      setOrphanages(response.data);
    });
  });

  function handleNavigateToCreateOrphanage() {
    navigation.navigate('SelectMapPosition');
  }

  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate('OrphanageDetails', { id });
  }

    return (
    <View style={styles.container}>
      <MapView 
      provider={PROVIDER_GOOGLE}
  
      initialRegion={{
        latitude: -19.9892681,
        longitude: -43.9591377,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      }}
      style={styles.map} 
       >

      {orphanages.map(orphanages => {
        return(
          <Marker
          key={orphanages.id}
          icon={mapMarkerImg}
          calloutAnchor={{ x: 2.7, y: 0.8 }}
          coordinate={{
            latitude: orphanages.latitude,
            longitude: orphanages.longitude,
          }}
         >

            <Callout tooltip={true} onPress={ () => handleNavigateToOrphanageDetails(orphanages.id)}>
            <View style={styles.calloutContainer}>
                <Text style={styles.calloutText}>Lar das meninas</Text>
            </View>
            </Callout>
         </Marker>
        )
      })}
       </MapView>

       <View style={styles.footer}>
            <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>

            <RectButton style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphanage} >
              <Feather name="plus" size={20} color="#fff" />
            </RectButton>
       </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
    },
  
    map:{
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  
    calloutContainer: {
      width: 160,
      height: 46,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 16,
      justifyContent: 'center',
      elevation: 3,
    },
  
    calloutText: {
      color: '#0089A5',
      fontSize: 14,
      fontFamily: 'Nunito_700Bold',
    },
  
    footer: {
      position: 'absolute',
      left: 24,
      right: 24,
      bottom: 32,
  
      backgroundColor: '#FFF',
      borderRadius: 20,
      height: 56,
      paddingLeft: 24,
  
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  
      elevation: 3,
    },
  
    footerText: {
      fontFamily: 'Nunito_700Bold',
      color: '#8fa7b3',
    },
  
    createOrphanageButton: {
      width: 56,
      height: 56,
      backgroundColor: '#15C3D6',
      borderRadius: 20,
  
      justifyContent: 'center',
      alignItems: 'center'
    },
  });
  