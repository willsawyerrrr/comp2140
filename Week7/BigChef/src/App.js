import { Link } from "react-router-dom";
import Template from "./components/Template";

export default function App() {
    return (
        <Template title="Welcome to Big Chef!">
            <p>Check out our <Link to={`/recipe`}>list of recipes</Link>.</p>
        </Template>
    );
}