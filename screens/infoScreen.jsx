import { useContext, useEffect } from "react";
import {Alert, Image, Keyboard, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import defaultStyle from "./styleSheet";
import { Ionicons } from '@expo/vector-icons';

import CustomText from "../Components/customText";
import { AppContext } from "../context/appContext";

export default function InfoScreen() {
	const navigation = useNavigation(AppContext);
	const ctx = useContext(AppContext);

	useEffect(() => {
		navigation.setOptions({
			title: ctx.auth.email,
			headerTitleStyle: {fontSize: 16},
			headerRight: ()=> {
				return(<Pressable  onPress={logoutHandle}>
					<Ionicons name="md-log-out" color="#000" size={24} />
				</Pressable>)
			}
		});
	}, []);

	const logoutHandle = () => {
		Alert.alert("WITH", "로그아웃 하시겠습니까?", [
			{
				text: '취소'
			}, {
				text: '로그아웃',
				onPress: () =>{
					ctx.dispatch({type: 'logout'});
					navigation.navigate("Home");
				}
			}
		])
	}

	return ( <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={[defaultStyle.wrap]}>
			<View style={{alignItems:'center'}}>
				<Image source={require('../assets/images/myInfo.png')} resizeMode="cover" style={{width: 240, height: 240}}  />
			</View>
			<ScrollView style={{flex: 1}}>
				<CustomText> Info</CustomText>
			</ScrollView>
		</View>
	</TouchableWithoutFeedback> );
}

const styles = StyleSheet.create({

})