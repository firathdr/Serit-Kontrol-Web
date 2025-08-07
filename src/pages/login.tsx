import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            console.log("🔐 Login işlemi başlatılıyor...");
            console.log("📝 Kullanıcı adı:", username);
            
            const response = await axios.post("http://localhost:5000/api/login", {
                username,
                password,
            });
            
            console.log("✅ Login başarılı, response:", response.data);
            
            const { token } = response.data; // access_token yerine token kullan
            
            console.log("🔑 Token alındı:", token ? "Token var" : "Token yok");
            
            // Token'ı hem token hem de access_token olarak kaydet (uyumluluk için)
            localStorage.setItem("token", token);
            localStorage.setItem("access_token", token);
            localStorage.setItem("username",username);
            
            console.log("💾 Token localStorage'a kaydedildi");
            
            window.dispatchEvent(new Event('authStateChanged'));
            console.log("🎯 authStateChanged event tetiklendi");
            
            setTimeout(() => {
                console.log("🚀 Ana sayfaya yönlendiriliyor...");
                navigate("/");
            }, 100);
            
        } catch (err: any) {
            console.error("❌ Login hatası:", err);
            setError("Geçersiz kullanıcı adı veya şifre");
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Giriş Yap</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Kullanıcı Adı
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="form-control"
                            placeholder="Kullanıcı adınızı girin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Şifre
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Şifrenizi girin"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <div className="d-grid">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleLogin}
                        >
                            Giriş Yap
                        </button>
                    </div>
                </form>
                <div className="text-center mt-3">
                    <p>
                        Hesabınız yok mu?{" "}
                        <a href="/register" className="text-decoration-none">
                            Buradan kayıt olun
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;