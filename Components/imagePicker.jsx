import { useEffect, useState } from "react";
import { Alert, Image, Modal, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { launchCameraAsync, launchImageLibraryAsync, PermissionStatus, useCameraPermissions, useMediaLibraryPermissions, getCameraPermissionsAsync } from "expo-image-picker";
import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';

import CustomText from "./customText";

export default function ImagePicker({onPicked, placeImage}) {
	const [modalVisible, setModalVisible] = useState(false);
	const [imageUri, setImageUri] = useState();
	// 카메라 접근 권한 확인
	const [cameraPermission, requestCameraPermission] = useCameraPermissions();
	const [imagePermission, requestImagePermission] = useMediaLibraryPermissions();
	
	useEffect(()=> {
		if(placeImage) {
			setImageUri(placeImage);
		}
	},[]);
	
	const  takeFromGellary = async () => {
		if(imagePermission.status == PermissionStatus.DENIED ||
			imagePermission.status == PermissionStatus.UNDETERMINED) {
				try{
					const resp = await requestImagePermission();
					// console.log(resp);
					if (!resp.granted) {
						Alert.alert('오늘여기', '이 기능은 갤러리 접근 권한이 필요해요');
						return;
					}
				}catch(e) {
					console.log(e);
					return
				}
			}
			const result = await launchImageLibraryAsync({
				quality: 0.5,
				allowsEditing: true,
				aspect: [1, 1],	// 비율
				exif: true,	// 사진에 저장된 정보를 가져옴
				base64: true,	// 인코딩방식
			});
			if(!result.cancelled) {
				// 사진에 GPS 정보가 저장되어 있으면, 위치를 얻어낼 수 있다
				const lat = result.exif.GPSLatitude;
				const lng = result.exif.GPSLongitude;
				if(lat !== 0 && lng !==0 || lat !== undefined && lng !== undefined) {
					onPicked({uri: result.uri, coordination: {latitude: result.exif.GPSLatitude, longitude:  result.exif.GPSLongitude}}, result.base64)
				}else {
					onPicked({uri: result.uri}, result.base64);	// 부모한테 이미지 넘기기
				}
				setImageUri(result.uri);
				// console.log(result.exif);
			}
			// console.log(result);
			setImageUri(result.uri);
			setModalVisible(false);
	}
	const takeFromCamera= async () => {
		console.log(cameraPermission);
		const { status } = await getCameraPermissionsAsync();
		console.log(status)
		if(status !== 'granted') {
			const resp = await requestCameraPermission();
			// console.log(resp);
			if (!resp.granted) {
				Alert.alert('오늘여기', '이 기능은 카메라 접근 권한이 필요해요');
				return;
			}
		} 
		const result = await launchCameraAsync({
			quality: 0.5,
			allowsEditing: true,
			aspect: [1, 1],	// 비율
			exif: true,	// 사진에 저장된 정보를 가져옴
			base64: true,	// 인코딩방식
		});
		if(!result.cancelled) {
			// console.log(result.base64)
			// 사진에 GPS 정보가 저장되어 있으면, 위치를 얻어낼 수 있다
			const lat = result.exif.GPSLatitude;
			const lng = result.exif.GPSLongitude;
			if(lat !== 0 && lng !==0 || lat !== undefined && lng !== undefined && !lat && ! lng) {
				onPicked({uri: result.uri, coordination: {latitude: result.exif.GPSLatitude, longitude:  result.exif.GPSLongitude}}, result.base64)
			}else{
				onPicked({uri: result.uri}, result.base64);	// 부모한테 이미지 넘기기
			}
			setImageUri(result.uri);
		}
		// console.log(result);
		setImageUri(result.uri);
		setModalVisible(false);
	}
	return(<View style={{marginTop: 10}}>
		<View style={styles.contentArea}>
			<Pressable style={{flex:1}} onPress={() => setModalVisible(true)}>
				{imageUri ? 
					<Image source={{uri: imageUri}}  style={{flex:1}} resizeMode={'cover'} /> : 
					<View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
						<Foundation name="photo" size={30} color="#777" /><CustomText style={{marginTop: 8, color: '#777'}} weight={600}>NO IMAGE AVAILABLE</CustomText>
					</View>
				}
			</Pressable>
		</View>
		<Modal animationType="fade" transparent={true} visible={modalVisible}
			onRequestClose={() => setModalVisible(!modalVisible)}>
			<View style={styles.modalArea}>
				<Pressable style={styles.touchArea} onPress={() => setModalVisible(!modalVisible)}></Pressable>
				<View style={styles.buttonArea}>
					<View style={[styles.buttonWrap, {borderBottomColor: '#eee',borderBottomWidth: 1 }]}>
						<Pressable android_ripple={{color: "#00000008"}} style={styles.button} onPress={takeFromCamera}>
							{({ pressed }) => (<>
								<Ionicons name={pressed ? "md-camera-sharp" : 'md-camera-outline' } size={20} color={pressed ? "#ffbf00" : '#000' } />
								<CustomText style={[{fontSize: 18}, pressed && {color: '#ffbf00'}]}> 카메라</CustomText>
							</>)}
						</Pressable>
					</View>
					<View style={styles.buttonWrap}>
						<Pressable android_ripple={{color: "#00000008"}} style={styles.button} onPress={takeFromGellary}>
							{({ pressed }) => (<>
								<Ionicons name={pressed ? "md-image-sharp" : 'md-image-outline' } size={20} color={pressed ? "#ffbf00" : '#000' } />
								<CustomText style={[{fontSize: 18}, pressed && {color: '#ffbf00'}]}> 갤러리</CustomText>
							</>)}
						</Pressable>
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
		marginTop: 20,
		flex: 1
	},
	touchArea: {
		width:'100%', 
		height: '100%', 
		position: 'absolute', 
		backgroundColor: '#00000075'
	},
	buttonArea: {
		backgroundColor:'#fff',
		justifyContent:'center',
		alignItems:'center',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8
	},
	buttonWrap: {
		borderRadius: 4,
		overflow: 'hidden'
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 8,
		paddingVertical: 8,
		paddingHorizontal: 12
	}
})