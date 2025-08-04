import React, { useEffect, useState } from "react";

const Home: React.FC = () => {
    const [authInfo, setAuthInfo] = useState<any>({});

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token") || localStorage.getItem("access_token");
            const isLoggedIn = !!token;
            
            let userInfo = {};
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    userInfo = {
                        username: payload.username || payload.sub,
                        exp: payload.exp,
                        name: payload.name,
                        role: payload.role,
                        iat: payload.iat
                    };
                } catch (error) {
                    console.error("Token parse hatası:", error);
                }
            }
            
            setAuthInfo({
                isLoggedIn,
                token: token ? "Token var" : "Token yok",
                userInfo
            });
        };

        checkAuth();
        const interval = setInterval(checkAuth, 1000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Ana Sayfa</h1>
            
            <div style={{ 
                backgroundColor: "#f8f9fa", 
                padding: "20px", 
                borderRadius: "8px",
                marginTop: "20px"
            }}>
                <h3>Debug Bilgileri:</h3>
                <pre>{JSON.stringify(authInfo, null, 2)}</pre>
            </div>
            
            <div style={{ marginTop: "20px" }}>
                <h3>Test Butonları:</h3>
                <button 
                    onClick={() => {
                        localStorage.setItem("test_token", "test");
                        window.dispatchEvent(new Event('authStateChanged'));
                    }}
                    style={{ marginRight: "10px", padding: "10px" }}
                >
                    Test Token Ekle
                </button>
                
                <button 
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("test_token");
                        window.dispatchEvent(new Event('authStateChanged'));
                    }}
                    style={{ padding: "10px" }}
                >
                    Tüm Token'ları Temizle
                </button>
            </div>
        </div>
    );
};

export default Home;