import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";

import { colors, sizes, fonts } from "../data/theme";
import icons from "../data/icons";

function Recipe({ navigation, route, recipes, setRecipes }) {

    const { recipe } = route.params;

    function toggleBookmark(recipe) {
        const filteredRecipes = recipes.filter(_recipe => _recipe !== recipe);
        recipe.isBookmark = !recipe.isBookmark;
        setRecipes([...filteredRecipes, recipe]);
    }

    function renderHeaderBar() {
        return (
            <View
                style={{
                    backgroundColor: colors.darkGreen,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: sizes.padding,
                        height: 70,
                    }}>
                    {/* Go Back */}
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onPress={() => navigation.goBack()}
                    >
                        <Image
                            source={icons.back}
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: colors.white,
                                marginRight: sizes.padding / 2,
                            }}
                        />
                        <Text
                            style={{
                                color: colors.white,
                                fontWeight: "bold",
                                fontSize: sizes.body2,
                            }}
                        >
                            Back
                        </Text>
                    </TouchableOpacity>

                    {/* Bookmark */}
                    <TouchableOpacity style={{
                        alignItems: "center",
                        justifyContent: "center",
                        height: 35,
                        width: 35,
                    }} onPress={() => toggleBookmark(recipe)}>
                        <Image
                            source={recipe?.isBookmark ? icons.
                                bookmarkFilled : icons.bookmark}
                            style={{
                                width: 30,
                                height: 30,
                                tintColor: colors.white,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    function renderImage() {
        return (
            <View
                style={{
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                {/* Recipe Image */}
                <Image
                    source={recipe?.image}
                    resizeMode="cover"
                    style={{
                        height: sizes.headerHeight,
                    }}
                />
            </View>
        );
    }

    function renderInfo() {
        return (
            <View style={{
                padding: sizes.padding,
                backgroundColor: colors.grayLight,
            }}>
                {/* Recipe */}
                <View>
                    <Text style={{
                        ...fonts.heading
                    }}>
                        {recipe?.name}
                    </Text>
                    <Text style={{
                        ...fonts.body3,
                        color: colors.lightGray2,
                    }}>
                        {recipe?.duration} | Serves {recipe?.serving}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.white
            }}
        >
            {/* Header Bar */}
            {renderHeaderBar()}

            {/* Recipe Ingredients */}
            <FlatList
                data={recipe?.ingredients}
                keyExtractor={item => item.id}
                ListHeaderComponent={
                    <View style={{ marginBottom: sizes.padding / 2 }}>
                        {/* Image */}
                        {renderImage()}

                        {/* Info */}
                        {renderInfo()}
                    </View>
                }
                ListFooterComponent={
                    <View style={{ marginTop: sizes.padding / 2 }} />
                }
                renderItem={({ item }) => (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingHorizontal: sizes.padding,
                            paddingVertical: sizes.padding / 4,
                        }}
                    >
                        <View>
                            <Image
                                source={item.icon}
                                style={{
                                    height: 40,
                                    width: 40,
                                }}
                            />
                        </View>

                        <View
                            style={{
                                flex: 1,
                                paddingHorizontal: sizes.padding / 2,
                                justifyContent: "center"
                            }}
                        >
                            <Text
                                style={{
                                    ...fonts.body3
                                }}
                            >
                                {item.description}
                            </Text>
                        </View>

                        <View>
                            <Text
                                style={{
                                    ...fonts.body3
                                }}
                            >
                                {item.quantity}
                            </Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );

}

export default Recipe;