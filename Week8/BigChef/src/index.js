import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import JustTheFacts from "./pages/JustTheFacts";
import Music from "./pages/Music";
import Recipe from "./pages/Recipe";
import RecipeList from "./pages/RecipeList";

import { toneObject, toneTransport, tonePart } from "./data/instruments.js";

import "./css/style.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/recipe" element={<RecipeList />} />
                <Route path="/recipe/:id" element={<Recipe />} />
                <Route path="/just-the-facts" element={<JustTheFacts />} />
                <Route path="/music" element={
                    <Music
                        toneObject={toneObject}
                        toneTransport={toneTransport}
                        tonePart={tonePart}
                    />
                } />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);