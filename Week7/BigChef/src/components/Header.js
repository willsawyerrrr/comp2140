import React from "react";
import { Link } from "react-router-dom";

export default function Header() {

    const navLinks = [
        {
            name: "Home",
            url: "/",
        },
        {
            name: "Recipes",
            url: "/recipe",
        },
    ];

    return (
        <header className="page-header">
            <Link to="/">
                <h1>Big Chef</h1>
            </Link>
            <nav className="main-menu">
                <ul>
                    {navLinks.map((link) => (
                        <Link key={link.url} to={link.url}>
                            <li>
                                {link.name}
                            </li>
                        </Link>
                    ))}
                </ul>
            </nav>
        </header>
    );  

}