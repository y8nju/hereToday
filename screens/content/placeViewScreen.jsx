import { useContext, useEffect, useState } from "react";
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useForegroundPermissions } from "expo-location";
import { Ionicons } from '@expo/vector-icons';


import { placeFavorite } from "../../util/places";

import { AppContext } from "../../context/appContext";
import CustomText from "../../Components/customText";
import HeaderRightButton from "../../Components/headerRightButton";

const windowWidth = Dimensions.get('window').width;

export default function PlaceViewScreen({navigation, route}) {
	
	const {name, placeItem, range, favorite} = route.params.data;
	const [modalVisible, setModalVisible] = useState(false);
	const [favChk, setFavChk] = useState(false)
	const [favoriteArr, setFavoriteArr] = useState(favorite);
	
	const ctx = useContext(AppContext);
	const {idToken} = ctx.auth;

	useEffect(() => {
		console.log('route.params.data', route.params.data);
		if(placeItem.writer === ctx.auth.email){
			navigation.setOptions({
				headerRight: () => <HeaderRightButton onPress={updateHandle}>수정</HeaderRightButton>
			})
		}
		console.log('favoriteArr', favoriteArr, typeof favoriteArr);
		if(typeof favoriteArr == 'object') {
			if(favoriteArr.includes(ctx.auth.email)) {
				setFavChk(true)
			}else {
				setFavChk(false)
			}
		}
	}, [])
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
	const favoriteHandle =async () => {
		const email = ctx.auth.email;
		if(favChk) {
			setFavChk(false);
			const reFavArr = favoriteArr.filter((one) => one !== email);
			const recv = await placeFavorite(reFavArr, name, idToken);
			setFavoriteArr(reFavArr);
		}else {
			setFavChk(true);
			if(typeof favoriteArr == 'string') {
				try {
					const recv = await placeFavorite([email], name, idToken);
					setFavoriteArr([email]);
					console.log(recv);
				}catch(e) {
					console.log(e)
				}
			} else {
				const reFavArr = [...favoriteArr, email];
				const recv = await placeFavorite(reFavArr, name, idToken);
				setFavoriteArr(reFavArr);
			}
		}
	}
	
	return(<View style={{flex:1, backgroundColor: '#fff'}}>
		<View style={styles.imageArea}>
			<Image source={{uri: placeItem.imgURI}} resizeMode="cover" style={{flex: 1}}/>
				<Pressable style={styles.address} onPress={placeLocation}>
					<Ionicons name="md-location" size={18} color="#eee" />
					<CustomText style={{fontSize: 16, color: "#eee", marginLeft: 2}} weight={300}>{placeItem.location.address}</CustomText>
				</Pressable>
		</View>
		<View style={{flex: 1, paddingHorizontal: 20}}>
			<View>
				<View style={styles.titleArea}>
					<View style={[styles.rowEnd, {alignItems: 'center', }]}>
						<CustomText	tomText style={{fontSize: 20}} weight={600}>{placeItem.title}</CustomText>
						{range && <CustomText style={styles.range}>{range.toFixed(2)}Km</CustomText>}
					</View>
				<View style={[styles.rowEnd, {alignItems: 'flex-end'}]}>
					<CustomText style={{fontSize: 14, color: "#777"}} weight={600}>{placeItem.writer}</CustomText>
					<CustomText style={{fontSize: 12, color: "#777"}}>{placeItem.createdAt.slice(0, 10)}</CustomText>
				</View>
				</View>
			</View>
			<ScrollView style={{flex: 1, paddingVertical: 18}}>
				<CustomText style={{fontSize: 18, lineHeight: 30}}>{placeItem.info}</CustomText>
			</ScrollView>
			<View style={styles.footerArea}>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<CustomText style={{fontSize: 12, color: "#777"}}> {favoriteArr.length == 0 ? '' : '관심 ' + favoriteArr.length}</CustomText>
					<View style={{borderLeftColor: '#ddd', borderLeftWidth: 1, marginLeft: 18, paddingHorizontal: 8}}>
						<View style={{overflow: 'hidden', borderRadius: 12, width: 26, height: 26 }}>
							<Pressable android_ripple={{color: "#00000010"}} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={favoriteHandle}>
								<Ionicons name={favChk ? 'heart' : 'heart-outline'} size={20} color={favChk ? "#ff5d5d" : '#777'} style={{marginBottom: -2}}/>
							</Pressable>
						</View>
					</View>
				</View>
			</View>
		</View>
		
		<Modal animationType="slide" transparent={true} visible={modalVisible}
			onRequestClose={() => setModalVisible(!modalVisible)}>
			<View style={styles.modalArea}>
				<Pressable style={styles.touchArea} onPress={() => setModalVisible(!modalVisible)}></Pressable>
				<View style={styles.modalContent}>
					<View style={{flex: 1, alignItems: 'center', position: 'relative'}}>
					{placeItem ? <>
						<MapView style={{width: '100%', height:'100%'}} initialRegion={init} >
							<Marker coordinate={placeItem.location.coordination} />
						</MapView>
						{range &&  <CustomText style={styles.rangeBig}>
							내 위치와의 거리: {range.toFixed(2)}Km
						</CustomText>}
						</> : <LoadingOverlay />}
					</View>
				</View>
			</View>
		</Modal>
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
	footerArea: {
		flexDirection: 'row', 
		justifyContent: 'flex-end', 
		marginTop: 4,
		borderTopColor: '#ddd',
		borderTopWidth: 1,
		paddingVertical: 16,
	},
	rowEnd: {
		flexDirection: 'row', 
		justifyContent: 'space-between', 
		marginTop: 10
	},
	range: {
		fontSize: 12,
		backgroundColor: '#ffbf00',
		paddingVertical: 2,
		paddingHorizontal: 4,
		borderRadius: 4,
		color: '#fff',
	},
	rangeBig: {
		fontSize: 18,
		backgroundColor: '#ffbf00',
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 8,
		color: '#fff',
		position: 'absolute',
		top: 34,
		right: 30,
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