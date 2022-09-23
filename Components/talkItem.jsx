import { useNavigation } from "@react-navigation/native";
import { Pressable, View } from "react-native";
import CustomText from "./customText";

function TalkItem({data}) {
	const navigation = useNavigation();
    const message = data.item
    const detailHnadle = () => {
        navigation.navigate('TalkView', {data: message});
    }
    return ( <View>
        <Pressable android_ripple={{color: "#00000008"}} style={{paddingVertical: 10}}
        onPress={detailHnadle}>
            <View style={{paddingVertical: 10, paddingHorizontal: 20}}>
                <CustomText style={{textAlign: 'justify'}}>{message.title}</CustomText>
            </View>
            <View style={{paddingVertical: 10, paddingHorizontal: 20, flexDirection: "row", justifyContent: 'space-between'}}>
                <CustomText style={{fontSize: 12, color: "#777"}}>{message.writer}</CustomText>
                <CustomText style={{fontSize: 12, color: "#777"}}>{message.createdAt.slice(0, 10)}</CustomText>
            </View>
        </Pressable>
        <View style={{height: 8, backgroundColor: "#f1f1f1"}}></View>
    </View> );
}

export default TalkItem;