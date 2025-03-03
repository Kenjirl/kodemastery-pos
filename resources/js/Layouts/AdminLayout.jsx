import React from "react";
import Sidebar from "../Components/Sidebar";
import NavbarBackend from "../Components/Navbar";

const AdminLayout = ({ children }) => {
    return (
        <>
            <NavbarBackend />
            <Sidebar />
            <div className="page-content">
                <div className="page-content-wrapper p-xxl-4">{children}</div>
            </div>
        </>
    );
};

export default AdminLayout;
