import React from "react";
import { Link } from "@inertiajs/react";
import NavItem from "../Components/NavItem";
import hasAnyPermission from "../utils/hasAnyPermission";

const Sidebar = () => {
    return (
        <nav className="navbar sidebar navbar-expand-xl navbar-light bg-dark max-h-screen overflow-y-auto">
            <div className="d-flex align-items-center p-3">
                <Link className="navbar-brand" href="/">
                    <span className="navbar-brand-item h5 text-primary mb-0">
                        EasyPOS
                    </span>
                </Link>
            </div>

            <div
                className="offcanvas offcanvas-start flex-row custom-scrollbar h-100"
                data-bs-backdrop="true"
                tabIndex="-1"
                id="offcanvasSidebar"
            >
                <div className="offcanvas-body sidebar-content d-flex flex-column bg-dark">
                    <ul className="navbar-nav flex-column" id="navbar-sidebar">
                        {/* Header */}
                        <li className="nav-item mt-3 mb-1 text-muted">
                            Dashboard
                        </li>

                        {/* Menu Item: Dashboard */}
                        {hasAnyPermission(["dashboard.index"]) && (
                            <NavItem
                                href="/admin/dashboard"
                                icon="bi-house-door"
                                label="Dashboard"
                            />
                        )}

                        <li className="nav-item mt-3 mb-1 text-muted">
                            Management User
                        </li>
                        {hasAnyPermission(["roles.index"]) && (
                            <NavItem
                                href="/admin/roles"
                                icon="bi-shield-lock"
                                label="Roles"
                            />
                        )}

                        {hasAnyPermission(["users.index"]) && (
                            <NavItem
                                href="/admin/users"
                                icon="bi-person"
                                label="Users"
                            />
                        )}

                        <li className="nav-item mt-3 mb-1 text-muted">
                            Data Management
                        </li>

                        {hasAnyPermission(["suppliers.index"]) && (
                            <NavItem
                                href="/admin/suppliers"
                                icon="bi-truck"
                                label="Suppliers"
                            />
                        )}

                        {hasAnyPermission(["customers.index"]) && (
                            <NavItem
                                href="/admin/customers"
                                icon="bi-people"
                                label="Customers"
                            />
                        )}

                        {hasAnyPermission(["categories.index"]) && (
                            <NavItem
                                href="/admin/categories"
                                icon="bi-list-ul"
                                label="Categories"
                            />
                        )}

                        {hasAnyPermission(["units.index"]) && (
                            <NavItem
                                href="/admin/units"
                                icon="bi-rulers"
                                label="Units"
                            />
                        )}

                        {hasAnyPermission(["products.index"]) && (
                            <NavItem
                                href="/admin/products"
                                icon="bi-box"
                                label="Products"
                            />
                        )}

                        {hasAnyPermission(["stocks.index"]) && (
                            <NavItem
                                href="/admin/stocks"
                                icon="bi-box-seam"
                                label="Stock in"
                            />
                        )}

                        <li className="nav-item mt-3 mb-1 text-muted">
                            Transactions
                        </li>

                        {hasAnyPermission(["transactions.index"]) && (
                            <NavItem
                                href="/admin/sales"
                                icon="bi-cash"
                                label="Sales"
                            />
                        )}

                        <li className="nav-item mt-3 mb-1 text-muted">
                            Reports
                        </li>

                        {hasAnyPermission(["reports.index"]) && (
                            <NavItem
                                href="/admin/report"
                                icon="bi-clipboard-data"
                                label="Reports"
                            />
                        )}

                        {hasAnyPermission(["stock-opnames.index"]) && (
                            <NavItem
                                href="/admin/stock-opnames"
                                icon="bi-journal-check"
                                label="Stock Opnames"
                            />
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
