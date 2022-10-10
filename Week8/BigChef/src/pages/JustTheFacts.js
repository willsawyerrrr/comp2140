import { useState, useEffect } from "react";

import Template from "../components/Template";

function Fact({ fact }) {
    return <p>{fact}</p>;
}

export default function JustTheFacts() {
    async function getFact() {
        const response = await fetch("https://catfact.ninja/fact");
        const data = await response.json();
        const fact = data.fact;
        setFact(fact);
    }

    useEffect(() => {
        getFact();
    }, []);

    const initialFact = "Loading fact...";
    const [fact, setFact] = useState(initialFact);

    return (
        <Template title="Just the Facts">
            <h3>Random Fact</h3>
            <Fact fact={fact} />
        </Template>
    );

}