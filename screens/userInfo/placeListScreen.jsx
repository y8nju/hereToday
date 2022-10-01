import { useContext, useEffect, useState } from "react";
import { Dimensions, FlatList, Image, ImageBackground, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { placeList } from "../../util/places";

import { AppContext } from "../../context/appContext";
import CustomText from "../../Components/customText";

const windowWidth = Dimensions.get('window').width;

export default function PlaceListScreen() {
	const [places, setPlaces] = useState();

	const navigation = useNavigation();
	const ctx = useContext(AppContext);
	
	useEffect(()=> {
		getPlaceArr();
	}, []);
	
	const getPlaceArr = async() => {
		let idToken = ctx.auth?.idToken;
		if(idToken) {
			const result = await placeList(idToken);
			const placeArr = Object.keys(result).map((name) => { return {name, ...result[name]}});
			const myPlace = placeArr.filter(one=> one.placeItem.writer == ctx.auth.email);
			myPlace.sort((a, b) => a.placeItem.createdAt - b.placeItem.createdAt ).reverse();
			setPlaces(myPlace);
		}
	}
	function PlaceItem({data}) {
		const placeData = data.item;
		return (<Pressable style={styles.itemArea} onPress={()=>navigation.navigate('PlaceView', {data: placeData})}>
			<ImageBackground source={{uri: placeData.placeItem.imgURI}} resizeMode="cover" style={{flex: 1}} /> 
		</Pressable>)
	}

	return (<View style={{flex: 1, backgroundColor: '#fff'}}>
		{places ? <FlatList style={{flex: 1}} data={places}
			keyExtractor={({name})=> name}
			numColumns = {3}
			renderItem={one => <PlaceItem data={one} />}
			/>
		: <></>}
	</View>)
}
const styles = StyleSheet.create({
	itemArea: {
		flex: 1/3,
		height: windowWidth/3,
		backgroundColor: '#ddd',
		margin: 1,
	}
})