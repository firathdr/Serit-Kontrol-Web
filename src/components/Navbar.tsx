import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const checkAuthStatus = () => {
        const token = localStorage.getItem("token") || localStorage.getItem("access_token");
        
        console.log("🔍 Token kontrol ediliyor:", token ? "✅ Token var" : "❌ Token yok");
        
        if (token) {
            try {
                // JWT token'ı decode et
                const payload = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Date.now() / 1000;
                
                console.log("📋 Token payload:", payload);
                
                // Token'ın geçerliliğini kontrol et
                if (payload.exp && payload.exp < currentTime) {
                    console.warn("⏰ Token süresi dolmuş");
                    localStorage.removeItem("token");
                    localStorage.removeItem("access_token");
                    setIsLoggedIn(false);
                    setUsername(null);
                    return;
                }
                
                // Backend'den gelen username field'ını kullan
                const user = payload.username || payload.sub || payload.name || "Kullanıcı";
                console.log("👤 Kullanıcı adı:", user);
                
                setUsername(user);
                setIsLoggedIn(true);
            } catch (error) {
                console.warn("❌ Geçersiz JWT token:", error);
                console.warn("Token içeriği:", token);
                // Token geçersizse temizle
                localStorage.removeItem("token");
                localStorage.removeItem("access_token");
                setIsLoggedIn(false);
                setUsername(null);
            }
        } else {
            console.log("🚫 Token bulunamadı, giriş yapılmamış");
            setIsLoggedIn(false);
            setUsername(null);
        }
    };

    useEffect(() => {
        // İlk yükleme
        checkAuthStatus();
        
        // Her 1 saniyede bir kontrol et (daha sık)
        const interval = setInterval(checkAuthStatus, 1000);
        
        // localStorage değişikliklerini dinle
        const handleStorageChange = () => {
            console.log("💾 localStorage değişti, auth durumu kontrol ediliyor");
            checkAuthStatus();
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        // Custom event listener for login/logout
        window.addEventListener('authStateChanged', () => {
            console.log("🎯 authStateChanged event tetiklendi");
            checkAuthStatus();
        });
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authStateChanged', checkAuthStatus);
        };
    }, []); // location.pathname'i kaldırdım çünkü sürekli kontrol ediyoruz

    const handleLogout = () => {
        console.log("🚪 Çıkış yapılıyor...");
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        setUsername(null);
        
        // Custom event tetikle
        window.dispatchEvent(new Event('authStateChanged'));
        
        navigate("/login");
    };

    return (
        <nav style={styles.navbar}>
            <Link to="/" style={styles.logo}>🚗 Araç İhlal Sistemi</Link>

            <div style={styles.menu}>
                {isLoggedIn && (
                    <>
                        <Link to="/araclar" style={styles.link}>Araçlar</Link>
                        <Link to="/itirazlarim" style={styles.link}>İtirazlarım</Link>
                        <span style={styles.user}>👤 {username}</span>
                        <button onClick={handleLogout} style={styles.button}>Çıkış Yap</button>
                    </>
                )}

                {!isLoggedIn && (
                    <>
                        <Link to="/login" style={styles.link}>Giriş Yap</Link>
                        <Link to="/register" style={styles.link}>Kayıt Ol</Link>
                    </>
                )}
            </div>
            
            {/* Debug bilgisi - sadece geliştirme ortamında göster */}
            {import.meta.env.DEV && (
                <div style={{position: 'absolute', top: '5px', right: '5px', fontSize: '10px', color: '#95a5a6'}}>
                    🔐 {isLoggedIn ? 'Giriş yapıldı' : 'Giriş yapılmadı'} | 👤 {username || 'Yok'}
                </div>
            )}
        </nav>
    );
};

export default Navbar;

// Basit stiller
const styles = {
    navbar: {
        backgroundColor: "#2c3e50",
        color: "white",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between" as const,
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "sticky" as const,
        top: 0,
        zIndex: 1000,
    },
    logo: {
        fontSize: "20px",
        textDecoration: "none",
        color: "white",
        fontWeight: "bold" as const,
        transition: "color 0.3s ease",
    },
    menu: {
        display: "flex",
        gap: "20px",
        alignItems: "center",
    },
    link: {
        textDecoration: "none",
        color: "#ecf0f1",
        fontSize: "16px",
        fontWeight: "500" as const,
        transition: "color 0.3s ease",
        padding: "8px 12px",
        borderRadius: "4px",
        ":hover": {
            color: "#3498db",
        }
    },
    user: {
        color: "#bdc3c7",
        fontSize: "14px",
        fontWeight: "500" as const,
    },
    button: {
        backgroundColor: "#e74c3c",
        color: "white",
        border: "none",
        padding: "8px 16px",
        cursor: "pointer",
        borderRadius: "4px",
        fontSize: "14px",
        fontWeight: "500" as const,
        transition: "background-color 0.3s ease",
        ":hover": {
            backgroundColor: "#c0392b",
        }
    }
};
