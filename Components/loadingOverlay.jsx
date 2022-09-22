import { ActivityIndicator, View } from "react-native";

export default function LoadingOverlay () {
    return ( <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
        <ActivityIndicator size= {60} color="#ffbf00" />
    </View> );
}

