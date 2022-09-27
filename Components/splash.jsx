import { ImageBackground, View } from 'react-native';

export default function Splash() {
	return (<View style={{flex: 1, backgroundColor: '#fff'}}>
		<ImageBackground source={require('../assets/splash.png')} resizeMode="cover" style={{flex: 1}} />
	</View>)
}