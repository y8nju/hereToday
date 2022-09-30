import { createContext, useEffect, useReducer, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { sendLoginRequest } from "../util/account";

import LoadingOverlay from "../Components/loadingOverlay";

export const AppContext = createContext({
	
});

const authReducer = (state= null, action) => {
	switch(action.type) {
		case 'login': 
			// AsyncStorage.setItem('authentication', JSON.stringify(action.payload));
			return action.payload;
		case 'logout': 
			AsyncStorage.setItem('authentication', JSON.stringify(null));
			return null;
	}
	return null;
}

export function AppContextProvider({children}) {
	const [auth, dispatch] = useReducer(authReducer, null);
	const [done, setDone] = useState(false);

	async function reLogin(email, pass) {
		const recv = await sendLoginRequest(email, pass);
		const reUserData = {...recv, password: pass}
		console.log('reRoad', reUserData);
		dispatch({type: 'login', payload: reUserData});
		AsyncStorage.setItem('authentication', JSON.stringify(reUserData));
	}
	

	function addRangeFieldAndSort(arr, lat= 35.1653428, lng = 126.9092003) {
		// 위도 경도 거리 구하기
		function deg2rad(deg) {
			return deg * (Math.PI / 180)
		}

		const cvt = arr.map((one) => {
			const targetLat = one.placeItem.location.coordination.latitude;
			const targetLng = one.placeItem.location.coordination.longitude;

			var R = 6371; // Radius of the earth in km
			var dLat = deg2rad(targetLat - lat);  // deg2rad below
			var dLon = deg2rad(targetLng - lng);
			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(targetLat)) * Math.cos(deg2rad(lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c; // Distance in km
			return { ...one, range: d };
		});
	return cvt;
}
	
	useEffect(()=> {
		AsyncStorage.getItem('authentication').then((data)=> {
			const userData = JSON.parse(data);
			if(userData) {
				console.log(data)
				// 마운트 됐을 때, 재로그인 
				reLogin(userData.email, userData.password);
				// 59분 뒤, 재로그인
				setInterval(()=> {
					reLogin(userData.email, userData.password)
				},1000 * 60 * 59)
				dispatch({type: 'login', payload: userData});
				console.log(userData.email, userData.password)
			}
			setDone(true);
		});
	}, []);

	if(!done) {
		return <LoadingOverlay />
	}

	return (<AppContext.Provider value={{auth, dispatch, addRangeFieldAndSort}}>
		{children}
	</AppContext.Provider>);
}
