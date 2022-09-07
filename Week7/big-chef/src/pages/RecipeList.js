import React from "react";
import { Link } from "react-router-dom";

import Template from "../components/Template";
import { recipes } from "../data/recipes";

export default function RecipeList() {
    return (
        <Template title="List of Recipes">
            <ul>
                {recipes.map((recipe) => (
                    <li>
                        <Link to={`/recipe/${recipe.id}`}>
                            {recipe.title}
                        </Link>
                        <ul>
                            <li>
                                Rating: {recipe.rating} / 5
                            </li>
                        </ul>
                    </li>
                ))}
            </ul>
        </Template>
    );
}
