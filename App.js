import { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

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
import Splash from './Components/splash';
import PlaceViewScreen from './screens/content/placeViewScreen';
import PlaceUpdateScreen from './screens/content/placeUpdateScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function GuestStackNavigator() {
	return (<Stack.Navigator
			initialRouteName="Login" screenOptions={{
			headerTitleStyle: {fontFamily: "SUIT-Regular"}, 
			animation: 'slide_from_right'
		}}>
		<Stack.Screen name="Login" component={LoginScreen}/>
		<Stack.Screen name="Register" component={RegisterScreen} />
	</Stack.Navigator>)
}
function MemberStackNavigator() {
	return (<Stack.Navigator screenOptions={{animation: 'slide_from_right'}}>
		<Stack.Screen name="Info" component={InfoScreen} options={{title: '?????????'}}/>
		<Stack.Screen name="UserSetting" component={UserSettingScreen} options={{title: '?????? ??????'}}/>
		<Stack.Screen name="PassChange" component={PassChangeScreen} options={{title: '???????????? ??????'}}/>
		<Stack.Screen name="Withdraw" component={WithdrawScreen} options={{title: '????????? ??????'}}/>
	</Stack.Navigator>)
}
function TalkStackNavigator() {
	return (<Stack.Navigator initialRouteName="Talk"  screenOptions={{animation: 'slide_from_right'}}>
		<Stack.Screen name="Talk" component={TalkScreen} options={{title: '?????????'}}/>
		<Stack.Screen name="TalkWrite" component={talkWriteScreen} options={{title: '????????? ??????', presentation: 'modal', animation: 'fade_from_bottom'}}/>
		<Stack.Screen name="TalkView" component={TalkViewScreen} options={{title: '?????????'}}/>
		<Stack.Screen name="TalkUpdate" component={TalkUpdateScreen} options={{title: '????????? ????????????'}}/>
	</Stack.Navigator>)
}
function HomeStackNavigator() {
	return (<Stack.Navigator
			initialRouteName="Home" screenOptions={{animation: 'slide_from_right'}}>
		<Stack.Screen name="Home" component={HomeScreen} options={{title: '????????????'}}/>
		<Stack.Screen name="PlaceAdd" component={PlaceAddScreen} options={{title: '?????? ????????????', presentation: 'modal', animation: 'fade_from_bottom'}}/>
		<Stack.Screen name="PlaceView" component={PlaceViewScreen} options={{title: '??????', headerTransparent: true	}}/>
		<Stack.Screen name="PlaceUpdate" component={PlaceUpdateScreen} options={{title: '?????? ????????????'}}/>
		<Stack.Screen name="WithdrawSuccess" component={WithdrawSuccessScreen} options={{title: '?????? ??????'}}/>
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
		return <Splash />
	}
	return (<>
			<StatusBar style='auto' />
			<AppContextProvider>
				<NavigationContainer>
					<Tab.Navigator initialRouteName='Home' screenOptions={{
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
