import { useContext, useEffect } from "react";
import {Alert, Image, Keyboard, Pressable, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Ionicons } from '@expo/vector-icons';

import { AppContext } from "../../context/appContext";
import InfoNavScreen from "./infoNavScreen";
import HeaderRightButton from "../../Components/headerRightButton";

export default function InfoScreen({navigation, route}) {
	const ctx = useContext(AppContext);
	useEffect(() => {
		navigation.setOptions({
			title: ctx.auth.email,
			headerTitleStyle: {fontSize: 16},
			headerRight: ()=> {
				return(<HeaderRightButton onPress={userSettingHandle}>
					<Ionicons name="md-menu-sharp" color="#000" size={24} />
				</HeaderRightButton>)
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