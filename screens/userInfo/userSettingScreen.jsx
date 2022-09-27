import { useContext, useEffect } from "react";
import { Alert, Image, Pressable, StyleSheet, ToastAndroid, View } from "react-native";
import { CommonActions } from "@react-navigation/native";

import { Ionicons } from '@expo/vector-icons';
import defaultStyle from "../styleSheet";

import { AppContext } from "../../context/appContext";
import CustomText from "../../Components/customText";

export default function UserSettingScreen({navigation, route}) {
	const ctx = useContext(AppContext);

	useEffect(() => {
		if(route.params !== undefined) {
			switch(route.params.status) {
				case 'passChange':
					navigation.dispatch(CommonActions.setParams({ status: '' }));
					return ToastAndroid.show("비밀번호가 변경되었습니다", ToastAndroid.SHORT);
			}
		}
	}, [route])
	
	const logoutHandle = () => {
		Alert.alert("오늘여기", "로그아웃 하시겠습니까?", [
			{
				text: '취소'
			}, {
				text: '로그아웃',
				onPress: () =>{
					ctx.dispatch({type: 'logout'});
					navigation.navigate("Home", {status: 'logout'});
				}
			}
		])
	}
	const accountDeleteHandle = () => {
		navigation.navigate("Withdraw");
	}

	const passChangeHandele = () => {
		navigation.navigate("PassChange");
	}


	return(<View style={[defaultStyle.wrap, {backgroundColor: '#fff'}]}>
		<View style={{alignItems:'center', backgroundColor: '#fff'}}>
			<Image source={require('../../assets/images/myInfo.png')} resizeMode="cover" style={{width: 220, height: 220,}}  />
		</View>
		<View style={{paddingHorizontal: 20}}>
			<View style={styles.infoItemCol}>
				<CustomText style={styles.infoTit}>이메일</CustomText>
				<CustomText style={{fontSize: 16}}>{ctx.auth.email}</CustomText>
			</View>
			<Pressable onPress={passChangeHandele}>
				<View style={styles.infoItemRow}>
					<CustomText>비밀번호 변경</CustomText>
					<View style={{overflow: 'hidden', borderRadius: 8}}>
							<Ionicons name="md-chevron-forward-sharp" size={18} color="#000" />
					</View>
				</View>
			</Pressable>
			<Pressable onPress={logoutHandle}>
				<View style={styles.infoItemRow}>
					<CustomText>로그아웃</CustomText>
					<View style={{overflow: 'hidden', borderRadius: 8}}>
						<Ionicons name="md-chevron-forward-sharp" size={18} color="#000" />
					</View>
				</View>
			</Pressable>
			<Pressable onPress={accountDeleteHandle}>
				<View style={styles.infoItemRow}>
					<CustomText>서비스 탈퇴</CustomText>
					<View style={{overflow: 'hidden', borderRadius: 8}}>
							<Ionicons name="md-chevron-forward-sharp" size={18} color="#000" />
					</View>
				</View>
			</Pressable>
		</View>
	</View>)
}

const styles = StyleSheet.create({
	infoItemCol: {
		paddingVertical: 20,
		borderBottomColor: "#eee", 
		borderBottomWidth: 1
	},
	infoItemRow: {
		paddingVertical: 20,
		borderBottomColor: "#eee", 
		borderBottomWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	infoTit: {
		color: "#777",
		marginBottom: 8
	}
})