import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Itiraz {
    id: number;
    username: string;
    arac_id: number;
    video_name: string;
    durum: string;
    sebep: string;
    giris_zamani: string;
    saat: string;
    serit_id: number;
    ihlal_durumu: string;
}

const AdminItirazListesi: React.FC = () => {
    const [itirazlar, setItirazlar] = useState<Itiraz[]>([]);
    const [loading, setLoading] = useState(true);
    const [hata, setHata] = useState('');

    useEffect(() => {
        const fetchItirazlar = async () => {
            try {
                const token = localStorage.getItem('token'); // JWT token'ı localStorage’dan al
                const response = await axios.get('http://localhost:5000/api/admin/itirazlar', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setItirazlar(response.data.data);
            } catch (error: any) {
                console.error(error);
                setHata('İtirazlar yüklenirken hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchItirazlar();
    }, []);

    if (loading) return <div>Yükleniyor...</div>;
    if (hata) return <div style={{ color: 'red' }}>{hata}</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Tüm İtirazlar</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">#</th>
                        <th className="px-4 py-2 border">Kullanıcı</th>
                        <th className="px-4 py-2 border">Araç ID</th>
                        <th className="px-4 py-2 border">Video</th>
                        <th className="px-4 py-2 border">Durum</th>
                        <th className="px-4 py-2 border">Sebep</th>
                        <th className="px-4 py-2 border">Giriş Zamanı</th>
                        <th className="px-4 py-2 border">Saat</th>
                        <th className="px-4 py-2 border">Şerit</th>
                        <th className="px-4 py-2 border">İhlal Durumu</th>
                    </tr>
                    </thead>
                    <tbody>
                    {itirazlar.map((itiraz, index) => (
                        <tr key={itiraz.id} className="text-center hover:bg-gray-50">
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{itiraz.username}</td>
                            <td className="border px-4 py-2">{itiraz.arac_id}</td>
                            <td className="border px-4 py-2">{itiraz.video_name}</td>
                            <td className="border px-4 py-2">{itiraz.durum}</td>
                            <td className="border px-4 py-2">{itiraz.sebep}</td>
                            <td className="border px-4 py-2">{itiraz.giris_zamani}</td>
                            <td className="border px-4 py-2">{itiraz.saat}</td>
                            <td className="border px-4 py-2">{itiraz.serit_id}</td>
                            <td className="border px-4 py-2">{itiraz.ihlal_durumu}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminItirazListesi;
