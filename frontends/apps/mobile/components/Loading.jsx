import React from "react";
import {Text, View} from "react-native";
import {LoaderCircle} from "lucide-react-native";


export const Loading = () => {
    return (
        <View className="flex-1 items-center justify-center animate-spin">
            <Text><LoaderCircle size={64} color="#d97706"/></Text>
        </View>
    );
};
