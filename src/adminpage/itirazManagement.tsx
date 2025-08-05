import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Itiraz {
    id: number;
    username: string;
    arac_id: number;
    video_name: string;
    durum: string;
    sebep: string;
    arac_giris_zamani: string;
    arac_cikis_zamani: string;
    arac_goruntu?: string;
    serit_id?: number;
    ihlal_durumu?: string | number;
}

const AdminItirazListesi: React.FC = () => {
    const [itirazlar, setItirazlar] = useState<Itiraz[]>([]);
    const [loading, setLoading] = useState(true);
    const [hata, setHata] = useState('');

    useEffect(() => {
        const fetchItirazlar = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/admin/itirazlar', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setItirazlar(response.data.data);
            } catch (error) {
                console.error(error);
                setHata('İtirazlar yüklenirken hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchItirazlar();
    }, []);

    const handleItirazDurumu = async (
        username: string,
        arac_id: number,
        video_name: string,
        durum: 'onaylandi' | 'reddedildi'
    ) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/admin/itiraz', {
                username,
                arac_id,
                video_name,
                durum,
            }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            setItirazlar(prev =>
                prev.map(itiraz =>
                    itiraz.username === username &&
                    itiraz.arac_id === arac_id &&
                    itiraz.video_name === video_name
                        ? { ...itiraz, durum }
                        : itiraz
                )
            );
        } catch (error) {
            console.error("İtiraz durumu güncellenirken hata:", error);
            alert("Güncelleme başarısız.");
        }
    };


    if (loading) return <div className="text-center mt-4">Yükleniyor...</div>;
    if (hata) return <div className="text-danger text-center mt-4">{hata}</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Tüm İtirazlar</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover align-middle text-center">
                    <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Kullanıcı</th>
                        <th>Araç ID</th>
                        <th>Video</th>
                        <th>Sebep</th>
                        <th>Giriş</th>
                        <th>Çıkış</th>
                        <th>Şerit</th>
                        <th>İhlal</th>
                        <th>Araç Görüntü</th>
                        <th>İhlal Video</th>
                        <th>Durum</th>
                        <th>İşlem</th>
                    </tr>
                    </thead>
                    <tbody>
                    {itirazlar.map((itiraz, index) => (
                        <tr key={itiraz.id}>
                            <td>{index + 1}</td>
                            <td>{itiraz.username}</td>
                            <td>{itiraz.arac_id}</td>
                            <td>{itiraz.video_name}</td>
                            <td>{itiraz.sebep}</td>
                            <td>{itiraz.arac_giris_zamani || 'Yok'}</td>
                            <td>{itiraz.arac_cikis_zamani || 'Yok'}</td>
                            <td>{itiraz.serit_id ?? 'Yok'}</td>
                            <td>{itiraz.ihlal_durumu ?? 'Bilinmiyor'}</td>
                            <td>
                                {itiraz.arac_goruntu ? (
                                    <img
                                        src={`data:image/jpeg;base64,${itiraz.arac_goruntu}`}
                                        alt={`Araç ${itiraz.arac_id}`}
                                        className="img-thumbnail"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                ) : 'Yok'}
                            </td>
                            <td>
                                {itiraz.video_name ? (
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => {
                                            const videoUrl = `http://localhost:5000/api/videos/${itiraz.video_name}?start=${itiraz.arac_giris_zamani}&end=${itiraz.arac_cikis_zamani}`;
                                            window.open(videoUrl, '_blank');
                                        }}
                                    >
                                        İzle
                                    </button>
                                ) : 'Yok'}
                            </td>
                            <td>{itiraz.durum}</td>
                            <td>
                                <button
                                    onClick={() => handleItirazDurumu(itiraz.username, itiraz.arac_id, itiraz.video_name, 'onaylandi')}
                                >
                                    Onayla
                                </button>

                                <button
                                    onClick={() => handleItirazDurumu(itiraz.username, itiraz.arac_id, itiraz.video_name, 'reddedildi')}
                                >
                                    Reddet
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

export default AdminItirazListesi;
