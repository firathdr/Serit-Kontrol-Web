import React, { useState } from "react";
import UserManagement from "../adminpage/userManagement.tsx"
import AdminItirazListesi from "../adminpage/itirazManagement.tsx"
//import BookManagement from "../adminpage/userManagement.tsx"


const Admin: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"Araçlar" | "Kullanıcılar" | "İtirazlar" | "Sistem Kayıtları">(
        "Araçlar"
    );

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Yönetim Sayfası</h1>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "Araçlar" ? "active" : ""}`}
                        onClick={() => setActiveTab("Araçlar")}
                    >
                        Araçlar
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "Kullanıcılar" ? "active" : ""}`}
                        onClick={() => setActiveTab("Kullanıcılar")}
                    >
                        Kullanıcılar
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "İtirazlar" ? "active" : ""}`}
                        onClick={() => setActiveTab("İtirazlar")}
                    >
                        İtirazlar
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "Sistem Kayıtları" ? "active" : ""}`}
                        onClick={() => setActiveTab("Sistem Kayıtları")}
                    >
                        Sistem Kayıtları
                    </button>
                </li>
            </ul>
            <div className="mt-4">
                {activeTab === "Kullanıcılar" && <UserManagement />}
                {activeTab === "İtirazlar" && <AdminItirazListesi />}
            </div>
        </div>
    );
};

export default Admin;