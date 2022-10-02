import { useContext, useEffect, useState } from "react";
import { Alert, Keyboard,StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";

import { placeUpdate } from "../../util/places";

import defaultStyle from "../styleSheet";

import { AppContext } from "../../context/appContext";
import ImagePicker from "../../Components/imagePicker";
import LocationPicker from "../../Components/locationPicker";
import HeaderRightButton from "../../Components/headerRightButton";
import LoadingOverlay from "../../Components/loadingOverlay";


export default function PlaceUpdateScreen({navigation, route}) {
	const [loading, setLoading] = useState(false);
	const [placeName, setPlaceName] = useState('');	
	const [placeInfo, setPlaceInfo] = useState('');	// 장소 정보
	const [placeImage, setPlaceImage] = useState(null);	// 장소 이미지
	const [placeLocation, setPlaceLocation] = useState();	// 장소 위치
	const [plceImageLocation, setPlaceImageLocation] = useState(null);
	const [placeImageBase64, setPlaceImageBase64] = useState();
	
    const data = route.params.data;
    const {name, placeItem} = data;
	const ctx = useContext(AppContext);
    // console.log(placeImageBase64.slice(0, 10))
    useEffect(()=>{
        setPlaceName(placeItem.title);
        setPlaceInfo(placeItem.info);
        setPlaceImage(placeItem.imgURI);
        const reader = (placeItem.imgURI);
        console.log(reader)
    },[])
	useEffect(()=> {
		navigation.setOptions({
			headerRight: ()=> <HeaderRightButton onPress={writeHandle}>수정</HeaderRightButton>
		});
		console.log('placeName: ', placeName, '\n placeInfo :', placeInfo, '\n placeImage: ', placeImage, '\n placeLocation: ', placeLocation)
	},[placeName, placeInfo, placeImage, placeLocation, plceImageLocation, placeImageBase64 ])
	
	const imagePickeredHandle = (uri, base64) => {
		setPlaceImageBase64(base64);
		if(uri) {
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
		Alert.alert("오늘여기", "여기를 수정할까요?", [
			{
				text: '취소'
			}, {
				text: '수정',
				onPress: () =>{ 
					if(!placeName || !placeLocation || !placeImage || !placeInfo) {
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
								placeUpdate( data, placeImageBase64, placeImage, name, idToken, writer)
							} catch (e) {
								console.log(e);
							}
						}();
						setTimeout(()=>{
							setLoading(false);
							navigation.navigate('Home', {status: 'update'});
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
							onChangeText={(text) => setPlaceName(text)}
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
				<ImagePicker onPicked={imagePickeredHandle} placeImage={placeItem.imgURI}/>
				<LocationPicker onPicked={locationPickeredHandle}
					plceImageLocation={plceImageLocation}
					initCoords={placeLocation?.coordination}
                    location={placeItem.location}/>
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