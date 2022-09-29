import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

import CustomText from "./customText";

export default function PlaceItem({data}) {
	const navigation = useNavigation();
	const {name, favorite, placeItem, range} = data.item;
	const detailHnadle = () => {
		navigation.navigate('PlaceView', {data: data.item});
	}
	return ( <View style={styles.placeItemArea}>
		<Pressable android_ripple={{color: "#00000008"}} style={{flex: 1, paddingTop: 14, paddingBottom: 10}}
		onPress={detailHnadle}>
			<View style={styles.placeItemContainer}>
				<View style={styles.placeImg}>
					<Image source={{uri: placeItem.imgURI}} resizeMode="cover" style={{flex: 1}}/>
				</View>
				<View style={{flex: 1, marginTop: 2}}>
					<View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
						<CustomText style={{ fontSize: 18}} weight={600}>{placeItem.title}</CustomText>
						<CustomText style={{fontSize: 12, color: '#ffbf00', marginLeft: 4, marginBottom: 1}} weight={600}>{range.toFixed(2)}Km</CustomText>
					</View>
					<View style={{flexDirection: 'row', marginTop: 4, marginBottom: 8}}>
						<CustomText style={{fontSize: 12, color: "#777"}}>{placeItem.location.address.split(' ')[2]}</CustomText>
						<CustomText style={{fontSize: 12, color: "#777", marginHorizontal : 4}}>·</CustomText>
						<CustomText style={{fontSize: 12, color: "#777"}}>{placeItem.createdAt.slice(0, 10)}</CustomText>
					</View>
					<View>
						<Text style={{fontFamily: 'SUIT-Regular', textAlign: 'justify', fontSize: 16}} numberOfLines={1}>{placeItem.info}</Text>
					</View>
					<View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4}}>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							{typeof favorite == 'object' ? <>
								<Ionicons name="heart-outline" size={10} color="#777" />
								<CustomText style={{fontSize: 10, color: "#777"}} weight={300}> {favorite?.length}</CustomText>
							</> : ''}
						</View>
					</View>
				</View>
			</View>
		</Pressable>
	</View> );
}

const styles = StyleSheet.create({
	placeItemArea: {
		flex: 1,
		borderBottomColor: '#eee',
		borderBottomWidth: 1,
	},
	placeItemContainer: {
		flexDirection: 'row',
		paddingVertical: 10,
		paddingHorizontal: 20
	},
	placeImg: {
		width: 76,
		height: 76,
		overflow: 'hidden',
		borderRadius: 8, 
		marginRight: 20
	}
})