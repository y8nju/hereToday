import { useEffect, useState } from "react";
import { Alert, Button, Image, Modal, Pressable, StyleSheet, View } from "react-native";
import { getCurrentPositionAsync, useForegroundPermissions } from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import { createStaticMapUri, getAdresses } from "../util/maps";

import CustomText from "./customText";
import LoadingOverlay from "./loadingOverlay";

export default function LocationPicker({onPicked, initCoords, plceImageLocation}) {
	// console.log('plceImageLocation', plceImageLocation)
	const [modalVisible, setModalVisible] = useState(false);
	const [mapUri, setMapUri] = useState(null);
	const [address, setAddress] = useState(null);
	const [lat, setLat] = useState();
	const [lng, setLng] = useState();
	const [coordinate, setCoordinate] = useState(null);
	useEffect(() => {
		if(initCoords) {
			// console.log('init', initCoords)
			!async function() {
				const temp = createStaticMapUri(initCoords.latitude, initCoords.longitude);
				const addr = await getAdresses(initCoords.latitude, initCoords.longitude);
				setAddress(addr);
				setMapUri(temp);
				onPicked({ coordination: {latitude: initCoords.latitude, longitude:  initCoords.longitude}, address: addr  });
			}();
		}
	}, [initCoords?.latitude, initCoords?.longitude])
	useEffect(()=> {
		if(plceImageLocation) {
			if(plceImageLocation.latitude !== undefined && plceImageLocation.latitude !== null) {
				Alert.alert('오늘여기', '사진의 위치 정보를 이용하여, 지도를 추가할까요?', [
					{ text: '취소' },
					{ text: '확인', 
						onPress: () => {
							setModalVisible(true);
							verifyPermition();
							setLat(plceImageLocation.latitude);
							setLng(plceImageLocation.longitude);
							setCoordinate(plceImageLocation);
							
							!async function() {
								const temp = createStaticMapUri(plceImageLocation.latitude, plceImageLocation.longitude);
								const addr = await getAdresses(plceImageLocation.latitude, plceImageLocation.longitude);
								setAddress(addr);
								setMapUri(temp);
								onPicked({ coordination: {latitude: plceImageLocation.latitude, longitude:  plceImageLocation.longitude}, address: addr  });
							}();
						}
					}
				])
			}
		}
	}, [plceImageLocation]);
	const init ={
		latitude: lat,
		longitude: lng,
		latitudeDelta: 0.01922,
		longitudeDelta: 0.01421,
	}
	
	const [locationPermission, requsetLocationPermission] = useForegroundPermissions();
	const verifyPermition = async() => {
		if(locationPermission.status !== 'granted') {
			const permission = await requsetLocationPermission();
			if(!permission.granted) {
				return flase;
			}
			return true;
		}
	}
	const takeFromLocation = async () => {
		verifyPermition();
		console.log(locationPermission);
		const result = await getCurrentPositionAsync();
		// console.log(result);
		const temp = createStaticMapUri(result.coords.latitude, result.coords.longitude);
		const addr = await getAdresses(result.coords.latitude, result.coords.longitude);
		setAddress(addr);
		setMapUri(temp);
		onPicked({ coordination: {latitude: result.coords.latitude, longitude:  result.coords.longitude}, address: addr  });
	}
	const moveToChooseLocation = async() => {
		setModalVisible(true);
		verifyPermition();
		const result = await getCurrentPositionAsync();
		// console.log(result)
		setLat(result.coords.latitude);
		setLng(result.coords.longitude);
	}
	const confirm = (lattiude, longitude) => {
		if(!coordinate) {
			console.log(lattiude, longitude)
		} else {
			setModalVisible(false);
		}
	}
	const mapPressHandle = async({nativeEvent}) => {
		// console.log(nativeEvent)
		setCoordinate(nativeEvent.coordinate);
		setLat(nativeEvent.coordinate.latitude);
		setLng(nativeEvent.coordinate.longitude);
		const addr = await getAdresses(nativeEvent.coordinate.latitude, nativeEvent.coordinate.longitude);
		setAddress(addr);
		onPicked({ coordination: {latitude: nativeEvent.coordinate.latitude, longitude:  nativeEvent.coordinate.longitude}, address: addr  });
	}
	return(<View style={{marginTop: 20}}>
		<View style={styles.contentArea}>
			<Pressable style={{flex:1}} onPress={moveToChooseLocation}>
				{mapUri ? <View style={{flex: 1, position: 'relative'}}>
					<Image source={{uri: mapUri}} style={{flex: 1}} resizeMode={'cover'}/>
					<View style={styles.address}>
						<Ionicons name="md-location-outline" size={18} color="#000" />
						<CustomText style={{fontSize: 16}}>{address}</CustomText>
					</View>
				</View> :		
					<View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
						<Foundation name="map" size={30} color="#777" /><CustomText style={{marginTop: 8, color: '#777'}} weight={600}>NO MAP AVAILABLE</CustomText>
					</View>
				}
				<View style={[styles.buttonWrap, {position: 'absolute', bottom: 8, right: 8, borderColor:'#ccc', borderWidth:1, backgroundColor: '#fff'}]}>
					<Pressable android_ripple={{color: "#00000008"}} style={{padding: 8}} onPress={takeFromLocation}>
						{({ pressed }) => (<>
							<MaterialIcons name="my-location" size={24} color={pressed ? "#000" : '#777' } />
						</>)}
					</Pressable>
				</View>
			</Pressable>
		</View>
		<Modal animationType="slide" transparent={true} visible={modalVisible}
			onRequestClose={() => setModalVisible(!modalVisible)}>
			<View style={styles.modalArea}>
				<Pressable style={styles.touchArea} onPress={() => setModalVisible(!modalVisible)}></Pressable>
				<View style={styles.modalContent}>
					<View style={{flex: 1, alignItems: 'center', position: 'relative'}}>
					{lng ? <>
						<MapView style={{width: '100%', height:'100%'}} initialRegion={init} onPress={mapPressHandle } >
							{coordinate && <Marker coordinate={coordinate} />}
						</MapView>
						<View style={{width: '84%', position: 'absolute', bottom: 40, }}>
							<Button title="확인" color="#ffbf00" onPress={ () => confirm(lng, lat) }/>
						</View>
						</> : <LoadingOverlay />}
					</View>
				</View>
			</View>
		</Modal>
	</View>)
}

const styles = StyleSheet.create({
	contentArea: {
		height: 220,
		backgroundColor: '#f1f1f1',
		borderRadius: 8,
		overflow: 'hidden'
	},
	modalArea: {
		flexDirection:'row', 
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
	touchArea: {
		width:'100%', 
		height: '100%', 
		position: 'absolute', 
		backgroundColor: '#00000075'
	},
	modalContent: {
		marginTop: 'auto',
		width: '100%',
		height: '80%',
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
		backgroundColor: '#fff',
		overflow: 'hidden'
	},
	address: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		position: 'absolute',
		bottom: 4,
		left: 4,
		backgroundColor: '#fff',
		paddingVertical: 2,
		paddingHorizontal: 4,
		borderRadius: 4
	}
})