import React from "react";
import { Link, usePage } from "@inertiajs/react";

const NavItem = ({ href, icon, label, labelClass = "", children }) => {
    const { url } = usePage();
    const isActive = url.startsWith(href);

    return (
        <li className="nav-item">
            <a
                href={href}
                className={`nav-link d-flex align-items-center text-white rounded ${isActive ? "bg-secondary" : ""}`}
            >
                <i className={`bi ${icon} fa-fw me-2 ${labelClass}`} />
                <span>{label}</span>
            </a>
            {children && <ul className="nav flex-column ms-3">{children}</ul>}
        </li>
    );
};

export default NavItem;
