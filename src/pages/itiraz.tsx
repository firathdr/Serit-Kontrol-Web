import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Itiraz {
    id: number;
    username: string;
    arac_id: number;
    video_name: string;
    durum: string;
    sebep: string;
    itiraz_durumu: string;
}

const ItirazList: React.FC = () => {
    const [itirazlar, setItirazlar] = useState<Itiraz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token") || localStorage.getItem("access_token");

        if (!token) {
            setError("Token bulunamadı. Lütfen tekrar giriş yapın.");
            setLoading(false);
            return;
        }

        axios.get("http://localhost:5000/api/itiraz_kayit", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                let rawData: any[] = [];

                if (Array.isArray(response.data)) {
                    rawData = response.data;
                } else if (response.data && response.data.data) {
                    rawData = response.data.data;
                }

                const formatted = rawData.map((item: any, index: number): Itiraz => {
                    if (Array.isArray(item)) {
                        return {
                            id: item[0] || index,
                            username: item[1] || 'Bilinmiyor',
                            arac_id: item[2] || 0,
                            video_name: item[3] || 'Bilinmiyor',
                            durum: item[4] || 'Beklemede',
                            sebep: item[5] || 'Belirtilmemiş',
                            itiraz_durumu: item[6] || 'Beklemede'
                        };
                    } else {
                        return {
                            id: item.id || item.ID || index,
                            username: item.username || item.email || 'Bilinmiyor',
                            arac_id: item.arac_id || 0,
                            video_name: item.video_name || 'Bilinmiyor',
                            durum: item.durum || 'Beklemede',
                            sebep: item.sebep || 'Belirtilmemiş',
                            itiraz_durumu: item.itiraz_durumu || 'Beklemede'
                        };
                    }
                });

                setItirazlar(formatted);
                setLoading(false);
            })
            .catch(err => {
                console.error("API Hatası:", err);
                setError("Veri çekilirken bir hata oluştu.");
                setLoading(false);
            });
    }, []);

    const getDurumBadge = (durum: string = '') => {
        switch (durum.toLowerCase()) {
            case 'ihlal':
                return <span className="badge bg-danger">İhlal Var</span>;
            case 'temiz':
                return <span className="badge bg-success">İhlal Yok</span>;
            default:
                return <span className="badge bg-secondary">{durum}</span>;
        }
    };

    const getItirazBadge = (itirazDurumu: string = '') => {
        switch (itirazDurumu.toLowerCase()) {
            case 'onaylandı':
            case 'onaylandi':
                return <span className="badge bg-success">İtiraz Onaylandı</span>;
            case 'reddedildi':
                return <span className="badge bg-danger">İtiraz Reddedildi</span>;
            default:
                return <span className="badge bg-warning text-dark">Beklemede</span>;
        }
    };

    const handleViewDetails = (username: string, aracId: number, videoName: string) => {
        navigate(`/itirazlar/${username}/${aracId}/${videoName}`);
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3">Yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center m-5" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
            </div>
        );
    }

    if (itirazlar.length === 0) {
        return (
            <div className="text-center p-5">
                <i className="bi bi-inbox fs-1 text-muted"></i>
                <h4 className="mt-3">Hiç itiraz kaydı bulunamadı.</h4>
                <p className="text-muted">Henüz sistemde kayıtlı bir itirazınız yok.</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0"><i className="bi bi-clipboard-check me-2"></i>İtiraz Kayıtlarınız</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Kullanıcı</th>
                                <th>Araç ID</th>
                                <th>Video</th>
                                <th>Durum</th>
                                <th>İtiraz Sebebi</th>
                                <th>İtiraz Durumu</th>
                                <th>İşlemler</th>
                            </tr>
                            </thead>
                            <tbody>
                            {itirazlar.map((item, i) => (
                                <tr key={`${item.id}-${i}`}>
                                    <td><strong>{item.id}</strong></td>
                                    <td>{item.username}</td>
                                    <td>{item.arac_id}</td>
                                    <td>{item.video_name}</td>
                                    <td>{getDurumBadge(item.durum)}</td>
                                    <td>{item.sebep}</td>
                                    <td>{getItirazBadge(item.itiraz_durumu)}</td>
                                    <td>
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => handleViewDetails(item.username, item.arac_id, item.video_name)}
                                        >
                                            <i className="bi bi-eye me-1"></i>Detay
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItirazList;