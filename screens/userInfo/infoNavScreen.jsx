import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import TalkListScreen from './talkListScreen';
import PlaceListScreen from './placeListScreen';

const Tab = createMaterialTopTabNavigator();

export default function InfoNavScreen() {
	
	return (
		<Tab.Navigator screenOptions={{
			lazy: true,
			tabBarIndicatorStyle: '#ffbf00',
			tabBarActiveTintColor: "#ffbf00",
			tabBarInactiveTintColor: '#999',
			tabBarPressColor: '#f1f1f1',
			tabBarIndicatorStyle: {
				backgroundColor: '#ffbf00'
			},
			tabBarBounces: true
		}}>
			<Tab.Screen name="PlaceList" component={PlaceListScreen} options={{
				tabBarLabel: '여기',
				tabBarLabelStyle: {
					fontFamily: 'SUIT-Regular',
					fontSize: 14
				}
			}} />
			<Tab.Screen name="TalkList" component={TalkListScreen} options={{
				tabBarLabel: '이야기',
				tabBarLabelStyle: {
					fontFamily: 'SUIT-Regular',
					fontSize: 14
				}
			}} />
		</Tab.Navigator>
	)
}