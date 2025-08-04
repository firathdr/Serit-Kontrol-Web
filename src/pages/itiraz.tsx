import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token") || localStorage.getItem("access_token");
        
        if (!token) {
            setError("Token bulunamadı. Lütfen tekrar giriş yapın.");
            setLoading(false);
            return;
        }
        
        axios.get('http://localhost:5000/api/itiraz_kayit', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log('API Response:', response.data);
                console.log('Response data type:', typeof response.data);
                console.log('Response data structure:', response.data);
                
                // Farklı response yapılarını kontrol edelim
                let rawData;
                if (response.data && response.data.data) {
                    rawData = response.data.data;
                } else if (Array.isArray(response.data)) {
                    rawData = response.data;
                } else {
                    console.error('Unexpected response structure:', response.data);
                    setItirazlar([]);
                    setLoading(false);
                    return;
                }
                
                console.log('Raw data:', rawData);
                console.log('Raw data type:', typeof rawData);
                console.log('Is rawData array?', Array.isArray(rawData));
                console.log('First item in raw data:', rawData[0]);

                // Güvenli kontrol ekleyelim
                if (!rawData || !Array.isArray(rawData)) {
                    console.error('Raw data is not an array:', rawData);
                    setItirazlar([]);
                    setLoading(false);
                    return;
                }

                // Diziyi nesneye çevir - API'den gelen veri yapısına göre ayarlayalım
                const formattedData = rawData.map((item: any, index: number) => {
                    console.log(`Item ${index}:`, item);
                    
                    // Eğer item bir array ise (eski format)
                    if (Array.isArray(item)) {
                        return {
                            id: item[0] || index,
                            username: item[1] || 'Bilinmiyor',
                            arac_id: item[2] || 0,
                            video_name: item[3] || 'Bilinmiyor',
                            durum: item[4] || 'Beklemede',
                            sebep: item[5] || 'Belirtilmemiş',
                            itiraz_durumu: item[6] || item[6] || 'Beklemede'
                        };
                    }
                    
                    return {
                        id: item.id || item.ID || index,
                        username: item.username || item.Username || item.email || 'Bilinmiyor',
                        arac_id: item.arac_id || item.aracId || item.arac_id || 0,
                        video_name: item.video_name || item.videoName || item.video_name || 'Bilinmiyor',
                        durum: item.durum || item.Durum || 'Beklemede',
                        sebep: item.sebep || item.Sebep || 'Belirtilmemiş',
                        itiraz_durumu: item.itiraz_durumu || item.itiraz_durumu || 'Beklemede'
                    };
                });

                console.log('Formatted data:', formattedData);
                setItirazlar(formattedData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Veri çekme hatası:', error);
                setError('Veri çekme hatası oluştu');
                setItirazlar([]); // Hata durumunda boş dizi
                setLoading(false);
            });
    }, []);

    // Durum badge'ini renklendirme fonksiyonu
    const getStatusBadge = (durum: string) => {
        switch (durum.toLowerCase()) {
            case 'onaylandı':
                return <span className="badge bg-success">Onaylandı</span>;
            case 'reddedildi':
                return <span className="badge bg-danger">Reddedildi</span>;
            case 'beklemede':
                return <span className="badge bg-warning text-dark">Beklemede</span>;
            default:
                return <span className="badge bg-secondary">{durum}</span>;
        }
    };

    if (loading) {
        return (
            <div className="container-fluid" style={{ backgroundColor: '#F2F2F2', minHeight: '100vh' }}>
                <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                    <div className="col-md-6 text-center">
                        <div className="spinner-border text-primary" role="status" style={{ color: '#049DD9' }}>
                            <span className="visually-hidden">Yükleniyor...</span>
                        </div>
                        <p className="mt-3" style={{ color: '#243E73' }}>Veriler yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid" style={{ backgroundColor: '#F2F2F2', minHeight: '100vh' }}>
                <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                    <div className="col-md-6">
                        <div className="alert alert-danger text-center" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            Hata: {error}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (itirazlar.length === 0) {
        return (
            <div className="container-fluid" style={{ backgroundColor: '#F2F2F2', minHeight: '100vh' }}>
                <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                    <div className="col-md-6 text-center">
                        <div className="card shadow-sm" style={{ backgroundColor: '#8BBBD9', border: 'none' }}>
                            <div className="card-body">
                                <i className="bi bi-inbox display-1" style={{ color: '#243E73' }}></i>
                                <h4 className="mt-3" style={{ color: '#243E73' }}>Hiç itiraz kaydı bulunamadı</h4>
                                <p className="text-muted">Henüz itiraz kaydınız bulunmamaktadır.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid" style={{ backgroundColor: '#F2F2F2', minHeight: '100vh', padding: '20px' }}>
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm" style={{ backgroundColor: '#8BBBD9', border: 'none', borderRadius: '15px' }}>
                        <div className="card-header" style={{ backgroundColor: '#049DD9', color: 'white', borderRadius: '15px 15px 0 0', border: 'none' }}>
                            <h2 className="mb-0">
                                <i className="bi bi-clipboard-data me-2"></i>
                                İtiraz Kayıtlarınız
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr style={{ backgroundColor: '#243E73', color: 'white' }}>
                                            <th scope="col">ID</th>
                                            <th scope="col">Kullanıcı</th>
                                            <th scope="col">Araç ID</th>
                                            <th scope="col">Video Adı</th>
                                            <th scope="col">Durum</th>
                                            <th scope="col">Sebep</th>
                                            <th scope="col">İtiraz Durumu</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itirazlar.map((itiraz, index) => (
                                            <tr key={itiraz.id || index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#F2F2F2' }}>
                                                <td style={{ color: '#021F59', fontWeight: 'bold' }}>{itiraz.id}</td>
                                                <td style={{ color: '#243E73' }}>{itiraz.username}</td>
                                                <td style={{ color: '#243E73' }}>{itiraz.arac_id}</td>
                                                <td style={{ color: '#243E73' }}>{itiraz.video_name}</td>
                                                <td>{getStatusBadge(itiraz.durum)}</td>
                                                <td style={{ color: '#243E73' }}>{itiraz.sebep}</td>
                                                <td style={{ color: '#243E73' }}>{itiraz.itiraz_durumu}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItirazList;
