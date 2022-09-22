import { Pressable, View } from "react-native";
import CustomText from "./customText";

function TalkItem() {
    return ( <View>
        <Pressable android_ripple={{color: "#00000008"}} style={{paddingVertical: 10}}>
            <View style={{padding: 10}}>
                <CustomText style={{textAlign: 'justify'}}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro maiores ipsum quaerat soluta perferendis, officia, eaque sapiente id nobis deserunt corrupti quidem reprehenderit voluptatum nisi nesciunt, nemo dolor tenetur! Id.</CustomText>
            </View>
            <View style={{padding: 10, flexDirection: "row", justifyContent: 'space-between'}}>
                <CustomText style={{fontSize: 12, color: "#777"}}>작성자</CustomText>
                <CustomText style={{fontSize: 12, color: "#777"}}>날짜</CustomText>
            </View>
        </Pressable>
        <View style={{height: 8, backgroundColor: "#f1f1f1"}}></View>
    </View> );
}

export default TalkItem;