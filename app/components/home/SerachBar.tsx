import { Search } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

const SerachBar = () => {
  const [gameName, setGameName] = React.useState<string>("");
  return (
    <View className="bg-neutral-900 rounded-xl p-4">
      <Text className="text-white mb-2">Search Game</Text>
      <View className="flex-row">
        <TextInput
          className="bg-zinc-700 pl-3 p-3 flex-1 mr-3 rounded-md text-white"
          onChangeText={setGameName}
          placeholder="Find game"
          placeholderTextColor="#aaa"
          value={gameName}
        />

        <TouchableOpacity className="bg-white px-4 rounded-md items-center justify-center">
          <Search color={"black"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SerachBar;
