import React from "react";
import { useParams } from "react-router-dom";

import Template from "../components/Template";

import { recipes } from "../data/recipes";

export default function Recipe() {
    let { id } = useParams();
    let [recipe] = recipes.filter((recipe) => recipe.id === id);

    if (recipe === undefined) {
        return (
            <Template title="Recipe Not Found"></Template>
        );
    }

    else {
        function Ingredient({ item, amount }) {
            return (
                <p>
                    {item} - <em>{amount}</em>
                </p>
            );
        }

        function Step({ description }) {
            return (
                <li>
                    {description}
                </li>
            );
        }

        let { title, description, author, rating, ingredients, steps } = recipe;

        return (
            <Template title={title}>
                <p className="author">
                    By {author} with Rating: {rating} / 5
                </p>
                <p>{description}</p>
                <section className="method">
                    <article>
                        <h3>Ingredients</h3>
                        {ingredients.map((ingredient) => (
                            <Ingredient {...ingredient} />
                        ))}
                    </article>
                    <article>
                        <h3>Steps</h3>
                        <ol>
                            {steps.map((step, index) => (
                                <Step description={step} />
                            ))}
                        </ol>
                    </article>
                </section>
            </Template>
        );

    }
}
