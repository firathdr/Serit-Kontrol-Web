import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;

    // Kullanıcının rolünü kontrol et
    let role: string | null = null;
    if (token) {
        const decoded = parseJwt(token); // Token'ı çözümle
        if (decoded && decoded.role) {
            role = decoded.role; // Rol bilgisine ulaş
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <nav style={styles.navbar}>
            <h1 style={styles.logo}>
                <Link to="/" style={styles.link}>
                    İhlal Kontrol Sistemi
                </Link>
            </h1>
            <ul style={styles.navLinks}>
                {isAuthenticated ? (
                    <>
                        <li>
                            <Link to="/books" style={styles.link}>
                                Books
                            </Link>
                        </li>
                        <li>
                            <Link to="/borrowed-books" style={styles.link}>
                                Borrowed Books
                            </Link>
                        </li>
                        {/* Eğer kullanıcı admin ise Admin tuşunu göster */}
                        {role === "admin" && (
                            <li>
                                <Link to="/admin" style={styles.link}>
                                    Admin
                                </Link>
                            </li>
                        )}

                        <li>
                            <button onClick={handleLogout} style={styles.logoutButton}>
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login" style={styles.link}>
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/register" style={styles.link}>
                                Register
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

const parseJwt = (token: string) => {
    try {
        const base64Url = token.split(".")[1]; // Token'ın payload kısmını al
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Base64 formatını düzelt
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );
        return JSON.parse(jsonPayload); // JSON olarak çöz
    } catch (e) {
        console.error("Invalid JWT token", e);
        return null;
    }
};

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
    },
    logo: {
        margin: 0,
    },
    navLinks: {
        display: "flex",
        listStyleType: "none",
        margin: 0,
        padding: 0,
    },
    link: {
        margin: "0 10px",
        textDecoration: "none",
        color: "#fff",
    },
    logoutButton: {
        marginLeft: "10px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
    },
};

export default Navbar;