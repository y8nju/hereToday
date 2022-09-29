import { useContext, useEffect, useState } from "react";
import { Alert, Keyboard,StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";

import { sendAddPlaceRequest } from "../../util/places";

import defaultStyle from "../styleSheet";

import { AppContext } from "../../context/appContext";
import ImagePicker from "../../Components/imagePicker";
import LocationPicker from "../../Components/locationPicker";
import HeaderRightButton from "../../Components/headerRightButton";
import LoadingOverlay from "../../Components/loadingOverlay";

export default function PlaceAddScreen({navigation}) {
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const [placeName, setPlceName] = useState('');	
	const [placeInfo, setPlaceInfo] = useState('');	// 장소 정보
	const [placeImage, setPlaceImage] = useState(null);	// 장소 이미지
	const [placeLocation, setPlaceLocation] = useState();	// 장소 위치
	const [plceImageLocation, setPlaceImageLocation] = useState(null);
	const [placeImageBase64, setPlaceImageBase64] = useState();
	
	const ctx = useContext(AppContext);
	useEffect(()=> {
		navigation.setOptions({
			headerRight: ()=> <HeaderRightButton onPress={writeHandle}>공유</HeaderRightButton>
		});
		console.log('placeName: ', placeName, '\n placeInfo :', placeInfo, '\n placeImage: ', placeImage, '\n placeLocation: ', placeLocation)
	},[placeName, placeInfo, placeImage, placeLocation, plceImageLocation, placeImageBase64 ])
	
	const modalCloseHandle = () => {
		setModal(false);
	}
	const imagePickeredHandle = (uri, base64) => {
		setPlaceImageBase64(base64);
		if(uri !== undefined) {
			// console.log(uri)
			setPlaceImage(uri.uri)
			if(uri.coordination) {
				setPlaceImageLocation(uri.coordination);
			}
		}
	}
	const locationPickeredHandle = (coord) => {
		setPlaceLocation(coord)
	}
	const writeHandle = () => {
		Alert.alert("오늘여기", "여기를 공유할까요?", [
			{
				text: '취소'
			}, {
				text: '공유',
				onPress: () =>{ 
					if(!placeImageBase64 || !placeName || !placeLocation || !placeImage || !placeInfo) {
						Alert.alert('오늘여기', '모든 필드는 필수입니다')
					}else {
						setLoading(true);
						!async function () {
							try {
								const data = {
									title: placeName,
									info: placeInfo,
									fileUri: placeImage,
									location: placeLocation
								}
								const idToken = ctx.auth.idToken;
								const writer = ctx.auth.email;
								sendAddPlaceRequest( data, placeImageBase64, placeImage, idToken, writer)
							} catch (e) {
								console.log(e);
							}
						}();
						setTimeout(()=>{
							setLoading(false);
							navigation.navigate("Home", {status: 'create'});
						}, 1500)
					}
				}
			}
		])
	}
	return (<TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		{loading? <LoadingOverlay /> :
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
					plceImageLocation={plceImageLocation}
					initCoords={placeLocation?.coordination}/>
			</View>
		</View>}
	</TouchableWithoutFeedback> )
}
const styles = StyleSheet.create({
	textarea: {
		fontSize: 16,
		textAlignVertical: "top",
		padding: 4,
	}
})