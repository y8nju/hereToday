import { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

import { AppContext, AppContextProvider } from './context/appContext';
import HomeScreen from './screens/homeScreen';
import LoginScreen from './screens/loginScreen';
import RegisterScreen from './screens/registerScreen';
import InfoScreen from './screens/infoScreen';
import TalkScreen from './screens/talkScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
function GuestStackNavigator() {
	return (<Stack.Navigator screenOptions={{
			headerTitleStyle: {fontFamily: "SUIT-Regular"}, 
			animation: 'slide_from_right'
		}}>
		<Stack.Screen name="Login" component={LoginScreen} />
		<Stack.Screen name="Register" component={RegisterScreen} />
	</Stack.Navigator>)
}
function MemberStackNavigator() {
	return (<Stack.Navigator screenOptions={{animation: 'slide_from_right'}}>
		<Stack.Screen name="Info" component={InfoScreen} options={{title: '프로필'}}/>
	</Stack.Navigator>)
}
function AccountStackNavigator() {
	const ctx = useContext(AppContext);
	return (<>
		{ctx.auth ? <MemberStackNavigator /> : <GuestStackNavigator />}
	</>)
}

export default function App() {
	const [fontLoaded] = useFonts({
		'SUIT-Light': require('./assets/fonts/SUIT-Light.ttf'),	// 300
		'SUIT-Regular': require('./assets/fonts/SUIT-Regular.ttf'),	// 400
		'SUIT-SemiBold': require('./assets/fonts/SUIT-SemiBold.ttf'),	// 600
		'SUIT-ExtraBold': require('./assets/fonts/SUIT-ExtraBold.ttf'),	// 800
		'Kyobo': require('./assets/fonts/KyoboHandwriting.ttf'),
	})
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
						<Tab.Screen name="Home" component={HomeScreen} 
							options={{tabBarIcon:({ focused, color,  }) => (
								<Ionicons name={focused ? 'md-home-sharp' : 'md-home-outline' } color={color} size={24} />
							)}}/>
						<Tab.Screen name="Talk" component={TalkScreen} 
							options={{tabBarIcon:({ focused, color,  }) => (
								<Ionicons name={focused ? 'newspaper-sharp' : 'newspaper-outline' } color={color} size={24} />
							)}}/>
						<Tab.Screen name="Account" component={AccountStackNavigator} 
							options={{headerShown: false,
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
