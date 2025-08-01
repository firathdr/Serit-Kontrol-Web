import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Itiraz {
    id: number;
    username: string;
    arac_id: number;
    video_name: string;
    durum: string;
    sebep: string;
    // veritabanı tablosuna göre ek alanlar varsa ekle
}

const ItirazList: React.FC = () => {
    const [itirazlar, setItirazlar] = useState<Itiraz[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItirazlar = async () => {
            try {
                const token = localStorage.getItem("token") || localStorage.getItem("access_token");
                const response = await axios.post(
                    'http://localhost:5000/api/itiraz_kayit',
                    {},  // POST gövdesi boş çünkü backend query username’den alıyor
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                console.log(response);

                setItirazlar(response.data.data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Veri çekilirken hata oluştu");
            } finally {
                setLoading(false);
            }
        };

        fetchItirazlar();
    }, []);

    if (loading) return <div>Yükleniyor...</div>;
    if (error) return <div style={{ color: "red" }}>Hata: {error}</div>;

    if (itirazlar.length === 0) return <div>Hiç itiraz kaydı bulunamadı.</div>;

    return (
        <div>
            <h2>İtiraz Kayıtlarınız</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Araç ID</th>
                    <th>Video Adı</th>
                    <th>Durum</th>
                    <th>Sebep</th>
                </tr>
                </thead>
                <tbody>
                {itirazlar.map((itiraz) => (
                    <tr key={itiraz.id}>
                        <td>{itiraz.arac_id}</td>
                        <td>{itiraz.video_name}</td>
                        <td>{itiraz.durum}</td>
                        <td>{itiraz.sebep}</td>
                    </tr>
                ))}
                </tbody>

            </table>
        </div>
    );
};

export default ItirazList;
