import { useContext, useEffect } from "react";
import {Alert, Image, Keyboard, Pressable, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Ionicons } from '@expo/vector-icons';

import { AppContext } from "../../context/appContext";
import InfoNavScreen from "./infoNavScreen";

export default function InfoScreen({navigation}) {
	const ctx = useContext(AppContext);

	useEffect(() => {
		navigation.setOptions({
			title: ctx.auth.email,
			headerTitleStyle: {fontSize: 16},
			headerRight: ()=> {
				return(<View style={{overflow: 'hidden', borderRadius: 8}}>
					<Pressable android_ripple={{color: "#00000008"}} style={{padding: 4}} onPress={userSettingHandle}>
						<Ionicons name="md-menu-sharp" color="#000" size={24} />
					</Pressable>
				</View>)
			}
		});
	}, []);
	const userSettingHandle = () => {
		navigation.navigate("UserSetting");
	}
	return ( <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<>
			<View style={{alignItems:'center', backgroundColor: '#fff'}}>
				<Image source={require('../../assets/images/myInfo.png')} resizeMode="cover" style={{width: 220, height: 220,}}  />
			</View>
			<InfoNavScreen style={{flex: 1}}/>
		</>
	</TouchableWithoutFeedback> );
}

const styles = StyleSheet.create({

})