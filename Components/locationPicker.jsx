import { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, View } from "react-native";
import { getCurrentPositionAsync, PermissionStatus, useForegroundPermissions } from "expo-location";
import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import { createStaticMapUri } from "../util/maps";

import CustomText from "./customText";

export default function LocationPicker() {
	const [modalVisible, setModalVisible] = useState(false);
	const [mapUri, setMapUri] = useState(null);

	const [locationPermission, requsetLocationPermission] = useForegroundPermissions();
	const takeFromLocation = async () => {
		if(locationPermission.status == PermissionStatus.DENIED ||
			locationPermission.status == PermissionStatus.UNDETERMINED) {
			const permission = await requsetLocationPermission();
			if(!permission.granted) {
				return;
			}
		}
        getCurrentPositionAsync().then(result => {
            console.log(result);
			const temp = createStaticMapUri(result.coords.latitude, result.coords.longitude);
			setMapUri(temp);
			console.log(temp)
        }).catch(e => {
            console.log(e);
        });
	}
	return(<View style={{marginTop: 20}}>
		<View style={styles.contentArea}>
		<Pressable style={{flex:1}} onPress={() => setModalVisible(true)}>
			{mapUri ? <Image source={{uri: mapUri}} style={{flex: 1}} resizeMode={'cover'}/> :
				<View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
					<Foundation name="map" size={30} color="#777" /><CustomText style={{marginTop: 8, color: '#777'}} weight={600}>NO MAP AVAILABLE</CustomText>
				</View>
			}
			<View style={[styles.buttonWrap, {position: 'absolute', bottom: 8, right: 8, borderColor:'#ccc', borderWidth:1, backgroundColor: '#fff'}]}>
				<Pressable android_ripple={{color: "#00000008"}} style={{padding: 8}} onPress={takeFromLocation}>
					{({ pressed }) => (<>
						<MaterialIcons name="my-location" size={24} color={pressed ? "#000" : '#777' } />
					</>)}
				</Pressable>
			</View>
		</Pressable>
		</View>
		<Modal animationType="fade" transparent={true} visible={modalVisible}
			onRequestClose={() => setModalVisible(!modalVisible)}>
			<View style={styles.modalArea}>
				<Pressable style={styles.touchArea} onPress={() => setModalVisible(!modalVisible)}></Pressable>
				<View style={styles.modalContent}>
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
	modalContent: {
		marginTop: 'auto',
		width: '100%',
		height: '50%',
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
		backgroundColor: '#fff',
	},
	buttonArea: {
		flexDirection:'row', 
		justifyContent: 'center', 
		marginTop: 10
	},
	buttonWrap: {
		borderRadius: 4,
		overflow: 'hidden'
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 8,
		paddingVertical: 4,
		paddingHorizontal: 8
	}
})