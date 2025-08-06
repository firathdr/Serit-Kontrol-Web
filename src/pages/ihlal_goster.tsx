import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface ItirazDetay {
    id: number;
    username: string;
    arac_id: number;
    video_name: string;
    durum: string;
    sebep: string;
    itiraz_durumu: string;
    arac_goruntu?: string;
    arac_giris_zamani?: string;
    arac_cikis_zamani?: string;
    serit_id?: number;
    ihlal_durumu?: string;
}

const ItirazIzle: React.FC = () => {
    const { username, arac_id, video_name } = useParams<{ username: string; arac_id: string; video_name: string }>();
    const [itiraz, setItiraz] = useState<ItirazDetay | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItiraz = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/itiraz_kayit/detay', {
                    params: { username, arac_id, video_name }
                });
                setItiraz(response.data);
            } catch (err) {
                setError('İtiraz bilgileri alınırken hata oluştu.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchItiraz();
    }, [username, arac_id, video_name]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger text-center mt-5 mx-auto" style={{maxWidth: '600px'}}>
            {error}
        </div>
    );

    if (!itiraz) return (
        <div className="alert alert-warning text-center mt-5 mx-auto" style={{maxWidth: '600px'}}>
            İtiraz bilgisi bulunamadı.
        </div>
    );

    return (
        <div className="container py-5">
            <div className="card shadow-lg mx-auto" style={{maxWidth: '900px'}}>
                <div className="card-header bg-primary text-white">
                    <h2 className="text-center mb-0">İtiraz Detayları</h2>
                </div>

                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="card h-100">
                                <div className="card-header bg-light">
                                    <h5 className="card-title mb-0">Temel Bilgiler</h5>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">Kullanıcı:</span>
                                            <span>{itiraz.username}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">Araç ID:</span>
                                            <span>{itiraz.arac_id}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">Video Adı:</span>
                                            <span>{itiraz.video_name}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">Durum:</span>
                                            <span className={`badge bg-${itiraz.durum === 'Onaylandı' ? 'success' : 'warning'}`}>
                                                {itiraz.durum}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card h-100">
                                <div className="card-header bg-light">
                                    <h5 className="card-title mb-0">İtiraz Bilgileri</h5>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">İtiraz Sebebi:</span>
                                            <span>{itiraz.sebep}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">İtiraz Durumu:</span>
                                            <span className={`badge bg-${itiraz.itiraz_durumu === 'Beklemede' ? 'warning' : itiraz.itiraz_durumu === 'Reddedildi' ? 'danger' : 'success'}`}>
                                                {itiraz.itiraz_durumu}
                                            </span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <span className="fw-bold">Şerit ID:</span>
                                            <span>{itiraz.serit_id || 'Bilinmiyor'}</span>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-header bg-light">
                                    <h5 className="card-title mb-0">Araç Görüntüsü</h5>
                                </div>
                                <div className="card-body text-center">
                                    {itiraz.arac_goruntu ? (
                                        <img
                                            src={`data:image/jpeg;base64,${itiraz.arac_goruntu}`}
                                            alt={`Araç ${itiraz.arac_id}`}
                                            className="img-fluid rounded shadow-sm"
                                            style={{ maxHeight: '300px' }}
                                        />
                                    ) : (
                                        <div className="alert alert-info mb-0">Görüntü bulunamadı</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card h-100">
                                <div className="card-header bg-light">
                                    <h5 className="card-title mb-0">İhlal Videosu</h5>
                                </div>
                                <div className="card-body text-center">
                                    {itiraz.video_name ? (
                                        <video
                                            controls
                                            className="img-fluid rounded shadow-sm"
                                            style={{ maxHeight: '300px' }}
                                            src={`http://localhost:5000/api/videos/${itiraz.video_name}?start=${itiraz.arac_giris_zamani}&end=${itiraz.arac_cikis_zamani}`}
                                        >
                                            Tarayıcınız video etiketini desteklemiyor.
                                        </video>
                                    ) : (
                                        <div className="alert alert-info mb-0">Video bulunamadı</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-footer text-muted text-center">
                    <small>İtiraz ID: {itiraz.id} | Son Güncelleme: {new Date().toLocaleString()}</small>
                </div>
            </div>
        </div>
    );
};

export default ItirazIzle;