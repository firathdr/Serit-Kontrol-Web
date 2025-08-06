import React, { useEffect, useState } from "react";

interface User {
    id: number;
    isim: string;
    username: string;
    rol: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string>("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/kullanicilar", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setUsers(data.kullanicilar);
            } else {
                setError(data.message || "Kullanıcılar alınamadı");
            }
        } catch (err) {
            setError("Sunucu hatası");
        }
    };

    const makeAdmin = async (username: string) => {
        const confirmed = window.confirm(`${username} adlı kullanıcıyı admin yapmak istiyor musun?`);
        if (!confirmed) return;

        try {
            const response = await fetch("http://localhost:5000/api/admin/yetkilendir", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();
            alert(data.message);
            if (response.ok) fetchUsers();
        } catch {
            alert("Sunucu hatası oluştu");
        }
    };

    const deleteUser = async (username: string) => {
        const confirmed = window.confirm(`${username} adlı kullanıcıyı silmek istiyor musun?`);
        if (!confirmed) return;

        try {
            const response = await fetch("http://localhost:5000/api/admin/kullanici-sil", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();
            alert(data.message);
            if (response.ok) fetchUsers();
        } catch {
            alert("Sunucu hatası oluştu");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">🛠️ Admin Paneli - Kullanıcı Yönetimi</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>İsim</th>
                        <th>Kullanıcı Adı</th>
                        <th>Rol</th>
                        <th>İşlemler</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.isim}</td>
                            <td>{user.username}</td>
                            <td>
                                    <span className={`badge ${user.rol === "admin" ? "bg-success" : "bg-secondary"}`}>
                                        {user.rol}
                                    </span>
                            </td>
                            <td>
                                {user.rol !== "admin" && (
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => makeAdmin(user.username)}
                                    >
                                        Admin Yap
                                    </button>
                                )}
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => deleteUser(user.username)}
                                >
                                    Sil
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
