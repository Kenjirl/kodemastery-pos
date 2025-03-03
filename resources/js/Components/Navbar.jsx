import React from "react";
import { Link, router, usePage } from "@inertiajs/react";

const NavbarBackend = () => {
    const { auth } = usePage().props;

    const logoutHandler = async (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    return (
        <nav className="navbar top-bar navbar-light border-bottom py-0 py-xl-3">
            <div className="container-fluid p-0">
                <div className="d-flex align-items-center w-100">
                    {/* Tampilan logo untuk layar kecil */}
                    <div className="d-flex align-items-center d-xl-none">
                        <Link className="navbar-brand" href="/">
                            <span className="navbar-brand-item h5 text-primary mb-0">
                                EasyPOS
                            </span>
                        </Link>
                    </div>

                    <div className="navbar-expand-xl sidebar-offcanvas-menu">
                        <button
                            className="navbar-toggler me-auto"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasSidebar"
                            aria-controls="offcanvasSidebar"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                            data-bs-auto-close="outside"
                        >
                            <i className="bi bi-text-right fa-fw h2 lh-0 mb-0 rtl-flip"></i>
                        </button>
                    </div>

                    <div className="ms-xl-auto">
                        <ul className="navbar-nav flex-row align-items-center">
                            <li className="nav-item ms-2 ms-md-3 dropdown">
                                <a
                                    className="nav-link dropdown-toggle d-flex align-items-center"
                                    href="#"
                                    id="profileDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <span className="fw-bold me-1">
                                        {auth.user.name}
                                    </span>
                                    <i className="bi bi-chevron-down"></i>
                                </a>
                                <ul
                                    className="dropdown-menu dropdown-animation dropdown-menu-end shadow pt-3"
                                    aria-labelledby="profileDropdown"
                                >
                                    <li className="px-3">
                                        <span className="fw-bold">
                                            {auth.user.name}
                                        </span>
                                        <p className="small text-muted mb-1">
                                            {auth.user.email}
                                        </p>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <a
                                            className="dropdown-item bg-danger-soft-hover"
                                            href="#"
                                            onClick={logoutHandler}
                                        >
                                            <i className="bi bi-power fa-fw me-2"></i>
                                            Keluar
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavbarBackend;
