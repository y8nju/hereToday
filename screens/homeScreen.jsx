import { useContext, useEffect } from "react";
import { Button, Image, Keyboard, Pressable, StyleSheet, ToastAndroid, TouchableWithoutFeedback, View } from "react-native";
import { CommonActions, useIsFocused, useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

import defaultStyle from "./styleSheet";

import { AppContext } from "../context/appContext";
import CustomText from "../Components/customText";

export default function HomeScreen({route}) {
	const navigation = useNavigation(AppContext);
	const ctx = useContext(AppContext);
	// console.log(route.params)

	/* navigation 이 가지고 있는 hook으로, 해당 화면에 focus된 상태인지 아닌지 확인해 볼 수 있다 */
	const focused = useIsFocused();

	useEffect(()=> {
		if(route.params !== undefined) {
			switch(route.params.status) {
				case 'login':
					navigation.dispatch(CommonActions.setParams({ status: '' }));
					return ToastAndroid.show("어서오세요", ToastAndroid.SHORT);
				case 'logout':
					navigation.dispatch(CommonActions.setParams({ status: '' }));
					return ToastAndroid.show("다음에 또 만나요", ToastAndroid.SHORT);
				case 'signup':
					navigation.dispatch(CommonActions.setParams({ status: '' }));
					return ToastAndroid.show("만나서 반가워요", ToastAndroid.SHORT);
				case 'create':
					navigation.dispatch(CommonActions.setParams({ status: '' }));
					return ToastAndroid.show("여기를 공유했어요", ToastAndroid.SHORT);
			}
		}
	}, [route])
	const loginHandle = () => {
		navigation.navigate("Account");
	}
	const onAddItemHandle = ()=> {
		navigation.navigate('PlaceAdd');
	}
	if(!ctx.auth) {
		return (<View style={[defaultStyle.wrap, {justifyContent: 'center'}]}>
			<View style={{alignItems:'center'}}>
				<Image source={require('../assets/images/notLogin.png')} resizeMode="cover" style={{width: 280, height: 280}}  />
			</View>
			<View style={defaultStyle.accountBtnArea}>
				<Button title="로그인 하기" color="#ffbf00" onPress={loginHandle} />
			</View>
		</View>)
	}
	return ( <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex:1}}>
		<View style={{flex: 1, backgroundColor: '#fff', position: 'relative'}}>
			<View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>	
			<CustomText type="hand" style={{fontSize: 32}}> 준비중 </CustomText>
			</View>
			{ctx.auth && <View style={styles.addBtn}>
				<Pressable android_ripple={{color: '#fff'}} onPress={onAddItemHandle}
					style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Ionicons name="add" size={32} color="#fff" />
				</Pressable>
			</View>}
		</View>
	</TouchableWithoutFeedback> );
}
const styles = StyleSheet.create({
	addBtn: {
		position:'absolute', 
		width: 44,
		height:44,
		bottom: 12, 
		right: 12, 
		borderRadius: 50, 
		backgroundColor: '#ffbf00',
		overflow: 'hidden',
		shadowColor: "#000",
		shadowOffset: {
			width: 2,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 0.3,
		elevation: 2,
	}
})