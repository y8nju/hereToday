import { Keyboard, Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import defaultStyle from "../styleSheet";

import CustomText from "../../Components/customText";
import ImagePicker from "../../Components/imagePicker";
import LocationPicker from "../../Components/locationPicker";
import { useEffect, useState } from "react";

export default function PlaceAddScreen() {
	
	const [modal, setModal] = useState(false);
	const [placeName, setPlceName] = useState('');	
	const [placeInfo, setPlaceInfo] = useState('');	// 장소 정보
	const [placeImage, setPlaceImage] = useState(null);	// 장소 이미지
	const [placeLocation, setPlaceLocation] = useState();	// 장소 위치
	useEffect(()=> {
		console.log('placeName: ', placeName, '\n placeInfo :', placeInfo, '\n placeImage: ', placeImage, '\n placeLocation: ', placeLocation)
	},[placeName, placeInfo, placeImage, placeLocation ])
	
	const modalCloseHandle = () => {
		setModal(false);
	}
	const imagePickeredHandle = (uri) => {
		setPlaceImage(uri)
	}
	const locationPickeredHandle = (coord) => {
		setPlaceLocation(coord)
	}
	return (<TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={[defaultStyle.wrap, {flex: 1, backgroundColor: '#fff', position: 'relative'}]}>
			<View style={{flex:1, paddingHorizontal: 24}}>	
				<View style={{marginBottom: 10}}>
					<View style={{borderBottomColor: '#ddd', borderBottomWidth: 1, marginBottom: 10}}>
						<TextInput
							value={placeName}
							onChangeText={(text) => setPlceName(text)}
							placeholder="어디인가요?"
							style={[styles.textarea, {fontFamily: 'SUIT-SemiBold'}]}
						/>
					</View>
					<TextInput
						value={placeInfo}
						multiline
						numberOfLines={5}
						onChangeText={(text) => setPlaceInfo(text)}
						placeholder="장소에 대해 알려주세요 :)"
						style={[styles.textarea, {fontFamily: 'SUIT-Regular', lineHeight: 30}]}
					/>
				</View>
				<ImagePicker onPicked={imagePickeredHandle}/>
				<LocationPicker onPicked={locationPickeredHandle}
					initCoords={placeLocation?.coordination}/>
			</View>
		</View>
	</TouchableWithoutFeedback> )
}
const styles = StyleSheet.create({
	textarea: {
		fontSize: 16,
		textAlignVertical: "top",
		padding: 4,
	}
})