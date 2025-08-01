import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const [isim, setIsim] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/registr", {
                isim,
                username,
                password,
            });
            alert("Üye işlemi Başarılı"); // Başarı mesajını göster
            navigate("/login"); // Başarıyla kayıt olunca login sayfasına yönlendir
        } catch (err: any) {
            setError("Kayıt işlemi başarısız. Lütfen tekrar deneyin.");
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Kayıt Ol</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Ad Soyad
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            placeholder="Adınızı ve soyadınızı girin"
                            value={isim}
                            onChange={(e) => setIsim(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Kullanıcı Adı
                        </label>
                        <input
                            type="text"
                            id="username"
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
                            onClick={handleRegister}
                        >
                            Kayıt Ol
                        </button>
                    </div>
                </form>
                <div className="text-center mt-3">
                    <p>
                        Zaten hesabınız var mı?{" "}
                        <a href="/login" className="text-decoration-none">
                            Buradan giriş yapın
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;