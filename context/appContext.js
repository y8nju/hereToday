import { createContext, useEffect, useReducer, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from "../Components/loadingOverlay";
import { sendLoginRequest } from "../util/account";

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

	return (<AppContext.Provider value={{auth, dispatch}}>
		{children}
	</AppContext.Provider>);
}
