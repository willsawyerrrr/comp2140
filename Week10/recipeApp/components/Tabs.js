import React from "react";
import { View, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../screens/Home";
import Bookmark from "../screens/Bookmark";

import { colors, sizes } from "../data/theme";
import icons from "../data/icons";

function TabIcon({ focused, icon }) {
    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "center",
                height: 80,
                width: 50,
            }}
        >
            <Image
                source={icon}
                resizeMode="contain"
                style={{
                    width: 30,
                    height: 30,
                    tintColor: focused ? colors.white : colors.lightLime
                }}
            />
        </View>
    );
}

const Tab = createBottomTabNavigator();

function tabOptions(icon) {
    return {
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icon} />,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.lightLime,
        headerStyle: {
            backgroundColor: colors.darkGreen,
            height: 50,
        },
        headerTintColor: colors.white,
        headerTitleAlign: "center",
        headerTitleStyle: {
            fontSize: sizes.body2,
        },
        tabBarStyle: {
            height: 70,
            padding: sizes.padding,
            backgroundColor: colors.darkGreen
        },
        tabBarLabelStyle: {
            padding: sizes.padding / 2
        }
    };
}

function Tabs({ navigation, recipes, setRecipes }) {

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                children={() => <Home navigation={navigation} recipes={recipes} />}
                options={() => tabOptions(icons.home)}
            />
            <Tab.Screen
                name="Bookmarks"
                children={() => <Bookmark navigation={navigation} recipes={recipes} />}
                options={() => tabOptions(icons.bookmarkFilled)}
            />
        </Tab.Navigator>
    );

}

export default Tabs;