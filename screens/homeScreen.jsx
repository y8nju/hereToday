import { useContext, useEffect, useState } from "react";
import { FlatList, Keyboard, Modal, Pressable, RefreshControl, StyleSheet, ToastAndroid, TouchableWithoutFeedback, View } from "react-native";
import { CommonActions, useIsFocused, useNavigation } from "@react-navigation/native";
import { getCurrentPositionAsync, useForegroundPermissions } from "expo-location";
import { Ionicons } from '@expo/vector-icons';

import { placeList } from "../util/places";

import { AppContext } from "../context/appContext";
import LoadingOverlay from "../Components/loadingOverlay";
import NotLogin from "../Components/notLogin";
import PlaceItem from "../Components/placeItem";
import HeaderRightButton from "../Components/headerRightButton";
import CustomText from "../Components/customText";

export default function HomeScreen({route}) {
	const [loaded, setLoaded] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [type, setType] = useState(true);
	const [places, setPlaces] = useState([]);
	const [allPlace, setAllPlace] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const [location, setLocation] =useState( null);
	const [isPermission, setIsPermission] = useState();
	const navigation = useNavigation(AppContext);
	const ctx = useContext(AppContext);
	const [locationPermission, requsetLocationPermission] = useForegroundPermissions();

	/* navigation 이 가지고 있는 hook으로, 해당 화면에 focus된 상태인지 아닌지 확인해 볼 수 있다 */
	const focused = useIsFocused();

	useEffect(() => {
		navigation.setOptions({
			headerRight: ()=> <HeaderRightButton onPress={()=>setModalVisible(true)}>
				{type ? '2Km' : '전체'} <Ionicons name="chevron-down" size={12} color="black" />
				</HeaderRightButton>
		});
		// console.log(location)
	});
	useEffect(()=> {
		// setRefresh(true);
		// console.log('route.params :', route.params)
		if(route.params) {
			switch(route.params.status) {
				case 'login':
					ToastAndroid.show("어서오세요", ToastAndroid.LONG);
					return navigation.dispatch(CommonActions.setParams({ status: '' }));
				case 'logout':
					ToastAndroid.show("다음에 또 만나요", ToastAndroid.LONG);
					return navigation.dispatch(CommonActions.setParams({ status: '' }));
				case 'signup':
					ToastAndroid.show("만나서 반가워요", ToastAndroid.LONG);
					return navigation.dispatch(CommonActions.setParams({ status: '' }));
				case 'create':
					ToastAndroid.show("여기를 공유했어요", ToastAndroid.SHORT);
					return navigation.dispatch(CommonActions.setParams({ status: '' }));
				case 'update':
					ToastAndroid.show("여기를 수정했어요", ToastAndroid.SHORT);
					return navigation.dispatch(CommonActions.setParams({ status: '' }));
				case 'deleted':
					ToastAndroid.show("여기를 지웠어요", ToastAndroid.SHORT);
					return navigation.dispatch(CommonActions.setParams({ status: '' }));
			}
		}
		// setRefresh(false);
	}, [route, focused]);
	useEffect(()=>{
		// 권한 여부 확인해서, 권한이 없다면 권한 얻기
		setLoaded(true);
		if(locationPermission) {
			verifyPermition();
			// console.log('locationPermission : ', locationPermission);
		}
	},[locationPermission]);
	useEffect(()=> {
		setIsPermission(Date.now());
	}, [focused]);
	useEffect(()=>{
		if(!location) {
			myLocation();
		}
	},[isPermission]);
	useEffect(()=> {
		setLoaded(true);
		// 위치 받아서 location이 등록 됐으면 게시물 가져오기
		if(location && ctx.auth) {
			getPlaceArr();
		}
		setLoaded(false);
	}, [location, focused]);
	useEffect(()=> {
		setLoaded(true);
		onRead(places);
		setLoaded(false);
		// console.log(places)
	},[allPlace]);

	const verifyPermition = async() => {
		// 위치 정보 권한 얻기
		if(locationPermission.status !== 'granted') {
			const permission = await requsetLocationPermission();
			if(!permission.granted) {
				return flase;
			}
			return true;
		}
	}
	const myLocation = async () => {
		// 내 위치 확인하기
		const result = await getCurrentPositionAsync();
		setLocation({lat: result.coords.latitude, lng: result.coords.longitude})
	}
	const getPlaceArr = async() => {
		let idToken = ctx.auth?.idToken;
		if(idToken) {
			const result = await placeList(idToken);
			// console.log(result);
			const placeArr = Object.keys(result).map((name) => { return {name, ...result[name]}});
			placeArr.sort((a, b) => a.createdAt - b.createdAt).reverse();
			setAllPlace(ctx.addRangeFieldAndSort(placeArr, location?.lat, location?.lng));
		}
	}
	const onRead = () => {
		const arr = allPlace.filter(one => {
			return one.range < 2
		})
		setPlaces(arr);
	}
	const onAddItemHandle = ()=> {
		navigation.navigate('PlaceAdd');
	}
	const selType = (typed) => {
		switch(typed) {
			case '2km':
				setModalVisible(false);
				return setType(true);
			case 'all':
				setModalVisible(false);
				return setType(false);
		}
	}
	if(!ctx.auth) {
		return (<NotLogin />)
	}
	return ( <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={{flex: 1, backgroundColor: '#fff', position: 'relative'}}>
			{loaded ? <LoadingOverlay />: <View style={{flex:1}}>	
				<FlatList style={{flex: 1}} data={type ? places : allPlace}  
					keyExtractor={({name})=> name}
					refreshControl={
						<RefreshControl
							refreshing={ refresh }
							onRefresh={()=> {
								setRefresh(true)
								setTimeout(()=> {
									onRead();
									setRefresh(false);
								}, 2000);
							}}
							colors={["#ffbf00"]}
						/>
					}
					renderItem={(one)=> <PlaceItem data={one} />}
					/>
			</View>}
			{ctx.auth && <View style={styles.addBtn}>
				<Pressable android_ripple={{color: '#fff'}} onPress={onAddItemHandle}
					style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Ionicons name="add" size={32} color="#fff" />
				</Pressable>
			</View>}
			<Modal animationType="fade" transparent={true} visible={modalVisible}
				onRequestClose={() => setModalVisible(!modalVisible)}>
				<View style={styles.modalArea}>
					<Pressable style={styles.touchArea} onPress={() => setModalVisible(!modalVisible)}></Pressable>
					<View style={styles.buttonArea}>
						<View style={styles.buttonWrap}>
							<Pressable android_ripple={{color: "#00000008"}} style={styles.button} onPress={() => selType('2km')}>
								{({ pressed }) => (<CustomText style={[{fontSize: 16, textAlign: 'right'}, pressed && {color: '#ffbf00'}]}> 2Km</CustomText>)}
							</Pressable>
						</View>
						<View style={styles.buttonWrap}>
							<Pressable android_ripple={{color: "#00000008"}} style={styles.button} onPress={() => selType('all')}>
								{({ pressed }) => (<CustomText style={[{fontSize: 16, textAlign: 'right'}, pressed && {color: '#ffbf00'}]}> 전체</CustomText>)}
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	</TouchableWithoutFeedback> );
}
const styles = StyleSheet.create({
	addBtn: {
		position:'absolute', 
		width: 44,
		height:44,
		bottom: 12, 
		right: 12, 
		borderRadius: 50, 
		backgroundColor: '#ffbf00',
		overflow: 'hidden',
		shadowColor: "#000",
		shadowOffset: {
			width: 2,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 0.3,
		elevation: 2,
	},
	modalArea: {
		flex: 1,
		alignItems: 'flex-end',
	},
	touchArea: {
		width:'100%', 
		height: '100%', 
		position: 'absolute', 
		bottom: 0, 
		backgroundColor: '#00000075'
	},
	buttonArea: {
		backgroundColor:'#fff',
		justifyContent:'center',
		alignItems:'center',
		paddingVertical: 10,
		borderRadius: 8,
		marginTop: 45,
		marginRight: 12
	},
	buttonWrap: {
		borderRadius: 4,
		overflow: 'hidden'
	},
	button: {
		marginHorizontal: 8,
		paddingVertical: 12,
		paddingRight: 12,
		paddingLeft: 40
	}
})