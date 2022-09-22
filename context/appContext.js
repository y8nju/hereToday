import { createContext, useEffect, useReducer, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from "../Components/loadingOverlay";

export const AppContext = createContext({
	
});

const authReducer = (state= null, action) => {
	switch(action.type) {
		case 'login': 
			// AsyncStorage.setItem('authentication', JSON.stringify(action.payload));
			return action.payload;
		case 'logout': 
			AsyncStorage.setItem('authentication', JSON.stringify(null))
			return null;
	}
	return null;
}

export function AppContextProvider({children}) {
	const [auth, dispatch] = useReducer(authReducer, null);
	const [done, setDone] = useState(false);
	
	useEffect(()=> {
		AsyncStorage.getItem('authentication').then((data)=> {
			if(data) {    
				dispatch({type: 'login', payload: JSON.parse(data)});
				console.log(data)
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
