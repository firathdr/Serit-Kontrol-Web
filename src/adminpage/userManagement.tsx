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
                setUsers(data.kullanicilar); // array geliyor
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
            if (response.ok) {
                alert(data.message);
                fetchUsers(); // listeyi güncelle
            } else {
                alert(data.message);
            }
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
            if (response.ok) {
                alert(data.message);
                fetchUsers();
            } else {
                alert(data.message);
            }
        } catch {
            alert("Sunucu hatası oluştu");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Admin Paneli - Kullanıcı Listesi</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <table border={1} cellPadding={10} style={{ marginTop: "20px", borderCollapse: "collapse" }}>
                <thead>
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
                        <td>{user.rol}</td>
                        <td>
                            {user.rol !== "admin" && (
                                <button onClick={() => makeAdmin(user.username)}>Admin Yap</button>
                            )}
                            <button onClick={() => deleteUser(user.username)} style={{ marginLeft: "10px" }}>
                                Sil
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
