import { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

import { AppContext, AppContextProvider } from './context/appContext';
import HomeScreen from './screens/homeScreen';
import LoginScreen from './screens/account/loginScreen';
import RegisterScreen from './screens/account/registerScreen';
import InfoScreen from './screens/userInfo/infoScreen';
import TalkScreen from './screens/talk/talkScreen';
import talkWriteScreen from './screens/talk/talkWriteScreen';
import TalkViewScreen from './screens/talk/talkViewScreen';
import TalkUpdateScreen from './screens/talk/talkUpdateScreen';
import UserSettingScreen from './screens/userInfo/userSettingScreen';
import PassChangeScreen from './screens/account/passChangeScreen';
import WithdrawScreen from './screens/account/withdrawScreen';
import WithdrawSuccessScreen from './screens/account/withdrawSuccessScreen';
import PlaceAddScreen from './screens/content/placeAddScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function GuestStackNavigator() {
	return (<Stack.Navigator screenOptions={{
			headerTitleStyle: {fontFamily: "SUIT-Regular"}, 
			animation: 'slide_from_right'
		}}>
		<Stack.Screen name="Login" component={LoginScreen}/>
		<Stack.Screen name="Register" component={RegisterScreen} />
	</Stack.Navigator>)
}
function MemberStackNavigator() {
	return (<Stack.Navigator screenOptions={{animation: 'slide_from_right'}}>
		<Stack.Screen name="Info" component={InfoScreen} options={{title: '프로필'}}/>
		<Stack.Screen name="UserSetting" component={UserSettingScreen} options={{title: '계정 정보'}}/>
		<Stack.Screen name="PassChange" component={PassChangeScreen} options={{title: '비밀번호 변경'}}/>
		<Stack.Screen name="Withdraw" component={WithdrawScreen} options={{title: '서비스 탈퇴'}}/>
	</Stack.Navigator>)
}
function TalkStackNavigator() {
	return (<Stack.Navigator screenOptions={{animation: 'slide_from_right'}}>
		<Stack.Screen name="Talk" component={TalkScreen} options={{title: '이야기'}}/>
		<Stack.Screen name="TalkWrite" component={talkWriteScreen} options={{title: '이야기 쓰기', presentation: 'modal', animation: 'fade_from_bottom'}}/>
		<Stack.Screen name="TalkView" component={TalkViewScreen} options={{title: '이야기'}}/>
		<Stack.Screen name="TalkUpdate" component={TalkUpdateScreen} options={{title: '이야기 수정하기'}}/>
	</Stack.Navigator>)
}
function HomeStackNavigator() {
	return (<Stack.Navigator screenOptions={{animation: 'slide_from_right'}}>
		<Stack.Screen name="Home" component={HomeScreen} options={{title: 'WITH'}}/>
		<Stack.Screen name="PlaceAdd" component={PlaceAddScreen} options={{title: '장소 공유하기', presentation: 'modal', animation: 'fade_from_bottom'}}/>
		<Stack.Screen name="WithdrawSuccess" component={WithdrawSuccessScreen} options={{title: '탈퇴 완료'}}/>
		{/* <Stack.Screen name="TalkView" component={TalkViewScreen} options={{title: '이야기'}}/> */}
	</Stack.Navigator>)
}

function AccountStackNavigator() {
	const ctx = useContext(AppContext);
	return (<>
		{ctx.auth ? <MemberStackNavigator /> : <GuestStackNavigator />}
	</>)
}

export default function App() {
	const ctx = useContext(AppContext);
	const [isCtx, setIsCtx] = useState(null);
	const [fontLoaded] = useFonts({
		'SUIT-Light': require('./assets/fonts/SUIT-Light.ttf'),	// 300
		'SUIT-Regular': require('./assets/fonts/SUIT-Regular.ttf'),	// 400
		'SUIT-SemiBold': require('./assets/fonts/SUIT-SemiBold.ttf'),	// 600
		'SUIT-ExtraBold': require('./assets/fonts/SUIT-ExtraBold.ttf'),	// 800
		'Kyobo': require('./assets/fonts/KyoboHandwriting.ttf'),
	})
	// useEffect(()=> {
	// 	console.log(ctx.auth)
	// 	if(ctx.auth) {
	// 		setIsCtx('unmountOnBlur: true');
	// 	}else {
	// 		setIsCtx('unmountOnBlur: false');
	// 	}
	// 	console.log('isCtx', isCtx)
	// }, [ctx])
	if(!fontLoaded) {
		return <></>
	}
	return (<>
			<StatusBar style='auto' />
			<AppContextProvider>
				<NavigationContainer>
					<Tab.Navigator initialRouteName='HOME' screenOptions={{
						tabBarLabelStyle: { fontFamily: 'SUIT-SemiBold', display: 'none'},
						tabBarActiveTintColor: "#ffbf00"
					}}>
						<Tab.Screen name="HomeStack" component={HomeStackNavigator} 
							options={{headerShown: false,
							tabBarIcon:({ focused, color,  }) => (
							<Ionicons name={focused ? 'md-home-sharp' : 'md-home-outline' } color={color} size={24} />
						)}}/>
						<Tab.Screen name="TalkStack" component={TalkStackNavigator} 
							options={{headerShown: false, unmountOnBlur: true,
							tabBarIcon:({ focused, color,  }) => (
							<Ionicons name={focused ? 'newspaper-sharp' : 'newspaper-outline' } color={color} size={24} />
						)}}/>
						<Tab.Screen name="Account" component={AccountStackNavigator} 
							options={{headerShown: false, unmountOnBlur: true,
							tabBarIcon: ({focused, color})=> (
							<Ionicons name={focused ? 'md-person-circle' : 'md-person-circle-outline'} color={color} size={26}  />
						)}} />
					</Tab.Navigator>
				</NavigationContainer>
			</AppContextProvider>
		</>);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
