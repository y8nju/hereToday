import { useContext, useEffect, useState } from "react";
import { Dimensions, Image, Modal, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

import defaultStyle from '../styleSheet/index';

import { AppContext } from "../../context/appContext";
import CustomText from "../../Components/customText";
import HeaderRightButton from "../../Components/headerRightButton";
import { getCurrentPositionAsync, useForegroundPermissions } from "expo-location";
import MapView, { Marker } from "react-native-maps";

const windowWidth = Dimensions.get('window').width;

export default function PlaceViewScreen({navigation, route}) {
	
	const {name, placeItem} = route.params.data;
	const [modalVisible, setModalVisible] = useState(false);
	
	const ctx = useContext(AppContext);
	console.log(route.params.data)
	console.log(placeItem.location.coordination)

	useEffect(() => {
		if(placeItem.writer === ctx.auth.email){
			navigation.setOptions({
				headerRight: () => <HeaderRightButton onPress={updateHandle}>수정</HeaderRightButton>
			})
		}
	})
	const init ={
		latitude: placeItem.location.coordination.latitude,
		longitude: placeItem.location.coordination.longitude,
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
	const placeLocation = async() => {
		setModalVisible(true);
		verifyPermition();
	}
	const updateHandle = () => {
		// navigation.navigate('TalkUpdate', {data: data});
	}
	
	return(<View style={{flex:1, backgroundColor: '#fff'}}>
		<View style={styles.imageArea}>
			<Image source={{uri: placeItem.imgURI}} resizeMode="cover" style={{flex: 1}}/>
				<Pressable style={styles.address} onPress={placeLocation}>
					<Ionicons name="md-location" size={18} color="#eee" />
					<CustomText style={{fontSize: 16, color: "#eee", marginLeft: 2}} weight={300}>{placeItem.location.address}</CustomText>
				</Pressable>
		</View>
		<Modal animationType="fade" transparent={true} visible={modalVisible}
			onRequestClose={() => setModalVisible(!modalVisible)}>
			<View style={styles.modalArea}>
				<Pressable style={styles.touchArea} onPress={() => setModalVisible(!modalVisible)}></Pressable>
				<View style={styles.modalContent}>
					<View style={{flex: 1, alignItems: 'center', position: 'relative'}}>
					{placeItem ? <>
						<MapView style={{width: '100%', height:'100%'}} initialRegion={init} >
							<Marker coordinate={placeItem.location.coordination} />
						</MapView>
						</> : <LoadingOverlay />}
					</View>
				</View>
			</View>
		</Modal>
		{/* <View style={{paddingHorizontal: 20}}>
			<View style={styles.titleArea}>
				<CustomText style={{fontSize: 16}} weight={600}>{data.title}</CustomText>
				<View style={{flexDirection: 'row', alignItems:'flex-end', marginTop:6}}>
					<CustomText style={{fontSize: 14, color: "#777"}}>{data.writer}</CustomText>
					<CustomText style={{fontSize: 12, color: "#777", marginLeft: 6}}>{data.createdAt.slice(0, 10)}</CustomText>
				</View>
			</View>
		</View>
		<View style={{paddingHorizontal: 20, paddingVertical: 18}}>
			<CustomText style={{fontSize: 18, lineHeight: 30}}>{data.content}</CustomText>
		</View> */}
	</View>)
}
const styles = StyleSheet.create({
	imageArea: {
		width: windowWidth,
		height: windowWidth,
		backgroundColor: '#f1f1f1'
	},
	titleArea: {
		paddingVertical: 18,
		borderBottomColor: '#ddd',
		borderBottomWidth: 1
	},
	address: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		position: 'absolute',
		bottom: 10,
		left: 8,
		backgroundColor: '#00000050',
		paddingTop: 2,
		paddingBottom: 4,
		paddingLeft: 4,
		paddingRight: 8,
		borderRadius: 10
	},
	modalArea: {
		flexDirection:'row', 
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
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
	}
})