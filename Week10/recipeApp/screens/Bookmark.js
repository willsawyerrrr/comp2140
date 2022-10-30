import React from "react";
import { SafeAreaView, View, Text, FlatList } from "react-native";

import { colors, fonts, sizes } from "../data/theme";

import RecipeCard from "../components/RecipeCard";

function Bookmark({ navigation, recipes }) {

    const filteredRecipes = recipes.filter(recipe => recipe.isBookmark);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.white,
            }}
        >
            <FlatList
                data={filteredRecipes}
                keyExtractor={item => item.id}
                ListFooterComponent={
                    <View style={{ marginBottom: sizes.padding * 5 }}>
                        <Text style={{ ...fonts.body4 }}>That"s the end of bookmarked recipes.</Text>
                    </View>
                }
                renderItem={({ item }) => {
                    return (
                        <RecipeCard
                            recipe={item}
                            onPress={() => navigation.navigate("Recipe", { recipe: item })}
                        />
                    );
                }}
                style={{
                    padding: sizes.padding,
                }}
            >

            </FlatList>
        </SafeAreaView>
    );
}

export default Bookmark;