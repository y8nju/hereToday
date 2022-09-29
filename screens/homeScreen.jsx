import { useContext, useEffect, useState } from "react";
import { FlatList, Keyboard, Pressable, StyleSheet, ToastAndroid, TouchableWithoutFeedback, View } from "react-native";
import { CommonActions, useIsFocused, useNavigation } from "@react-navigation/native";
import { getCurrentPositionAsync, useForegroundPermissions } from "expo-location";
import { Ionicons } from '@expo/vector-icons';

import { placeList } from "../util/places";

import { AppContext } from "../context/appContext";
import PlaceItem from "../Components/placeItem";
import LoadingOverlay from "../Components/loadingOverlay";
import NotLogin from "../Components/notLogin";

function addRangeFieldAndSort(arr, lat= 35.1653428, lng = 126.9092003) {
	// 위도 경도 거리 구하기
	function deg2rad(deg) {
		return deg * (Math.PI / 180)
	}

	const cvt = arr.map((one) => {
		const targetLat = one.placeItem.location.coordination.latitude;
		const targetLng = one.placeItem.location.coordination.longitude;

		var R = 6371; // Radius of the earth in km
		var dLat = deg2rad(targetLat - lat);  // deg2rad below
		var dLon = deg2rad(targetLng - lng);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(targetLat)) * Math.cos(deg2rad(lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c; // Distance in km
		return { ...one, range: d };
	});
	return cvt;
}

export default function HomeScreen({route}) {
	const [loaded, setLoaded] = useState(false);
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

	/* 추가할 것
		headerRight에 거리순, 전체 리스트 모달 넣기
		거리순, 전체 리스트가 선택되면 state에 상태 추가
		상태에 따라 place 혹은 allPlace 추가
	*/
	useEffect(()=>{
		// 권한 여부 확인해서, 권한이 없다면 권한 얻기
		setLoaded(true);
		if(locationPermission) {
			verifyPermition();
			console.log('locationPermission : ', locationPermission);
		}
	},[locationPermission]);
	useEffect(()=> {
		setIsPermission(Date.now());
	}, [focused])
	useEffect(()=>{
		if(location == null) {
			myLocation();
		}
	},[isPermission])
	useEffect(()=> {
		setLoaded(true);
		// 위치 받아서 location이 등록 됐으면 게시물 가져오기
		if(location !== null) {
			getPlaceArr();
		}
		setLoaded(false);
	}, [location, focused])
	useEffect(()=> {
		setLoaded(true);
		onRead(places);
		setLoaded(false);
	},[allPlace])
	useEffect(()=> {
		// setRefresh(true);
		console.log('route.params :', route.params)
		if(route.params !== undefined) {
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
			}
		}
		// setRefresh(false);
	}, [route, focused]);

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
	const onAddItemHandle = ()=> {
		navigation.navigate('PlaceAdd');
	}
	const getPlaceArr = async() => {
		let idToken = ctx.auth?.idToken;
		if(idToken) {
			const result = await placeList(idToken);
			console.log(result);
			const placeArr = Object.keys(result).map((name) => { return {name, ...result[name]}});
			placeArr.sort((a, b) => a.createdAt - b.createdAt).reverse();
			setAllPlace(addRangeFieldAndSort(placeArr, location?.lat, location?.lng));
		}
	}
	function onRead() {
		const arr = allPlace.filter(one => {
			return one.range < 2
		})
		setPlaces(arr);
	}
	if(!ctx.auth) {
		return (<NotLogin />)
	}
	return ( <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={{flex: 1, backgroundColor: '#fff', position: 'relative'}}>
			{loaded ? <LoadingOverlay />: <View style={{flex:1}}>	
				<FlatList style={{flex: 1}} data={places}  
					keyExtractor={({name})=> name}
					refreshing={ refresh }
					onRefresh={()=> {
						setRefresh(true)
						setTimeout(()=> {
							onRead();
							setRefresh(false);
						}, 2000);
					}}
					renderItem={(one)=> <PlaceItem data={one} />}
					/>
			</View>}
			{ctx.auth && <View style={styles.addBtn}>
				<Pressable android_ripple={{color: '#fff'}} onPress={onAddItemHandle}
					style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Ionicons name="add" size={32} color="#fff" />
				</Pressable>
			</View>}
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
	}
})