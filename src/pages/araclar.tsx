import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Arac {
    arac_id: number;
    giris_zamani: string;
    saat: string;
    serit_id: number;
    ihlal_durumu: number;
    video_name: string;
    goruntu?: string; // base64 string
}

interface FilterState {
    aracId: string;
    girisZamani: string;
    saat: string;
    seritId: string;
    ihlalDurumu: string;
    videoName: string;
}

const Araclar: React.FC = () => {
    const [araclar, setAraclar] = useState<Arac[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        aracId: '',
        girisZamani: '',
        saat: '',
        seritId: '',
        ihlalDurumu: '',
        videoName: ''
    });

    useEffect(() => {
        if (!selectedImage) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedImage(null);
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImage]);

    useEffect(() => {
        const fetchAraclar = async () => {
            try {
                const token = localStorage.getItem("token") || localStorage.getItem("access_token");
                if (!token) {
                    setError("Token bulunamadı. Lütfen tekrar giriş yapın.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/araclar', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    setAraclar(response.data.data);
                } else if (Array.isArray(response.data)) {
                    setAraclar(response.data);
                } else if (response.data && response.data.araclar && Array.isArray(response.data.araclar)) {
                    setAraclar(response.data.araclar);
                } else {
                    setAraclar([]);
                }

                setError("");
            } catch (error: any) {
                if (error.response?.status === 401) {
                    setError("Yetkilendirme hatası. Lütfen tekrar giriş yapın.");
                } else if (error.response?.status === 404) {
                    setError("API endpoint bulunamadı.");
                } else {
                    setError(error.response?.data?.message || 'Veriler yüklenirken hata oluştu');
                }
                setAraclar([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAraclar();
    }, []);

    const handleItirazEt = async (aracId: number, video_n: string, ihlal1: number) => {
        try {
            const sebep = window.prompt("İtiraz sebebinizi yazınız:");
            if (!sebep) {
                alert("İtiraz iptal edildi. Sebep girilmedi.");
                return;
            }

            await axios.post(
                "http://localhost:5000/api/itiraz_et",
                {
                    username: localStorage.getItem('username'),
                    arac_id: aracId,
                    video_name: video_n,
                    sebep: sebep,
                    ihlal: ihlal1
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") || localStorage.getItem("access_token")}`,
                    },
                }
            );

            alert("İtirazınız başarıyla gönderildi!");
        } catch (error: any) {
            alert("İtiraz gönderilirken hata oluştu: " + (error.response?.data?.message || 'Bilinmeyen hata'));
        }
    };

    const handleFilterChange = (field: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const clearFilters = () => {
        setFilters({
            aracId: '',
            girisZamani: '',
            saat: '',
            seritId: '',
            ihlalDurumu: '',
            videoName: ''
        });
    };

    const filteredAraclar = araclar.filter(arac => {
        if (filters.aracId && !arac.arac_id.toString().includes(filters.aracId)) return false;
        if (filters.girisZamani && arac.giris_zamani) {
            const girisDate = new Date(arac.giris_zamani);
            const filterDate = new Date(filters.girisZamani);
            if (girisDate.toDateString() !== filterDate.toDateString()) return false;
        }
        if (filters.saat && arac.saat && !arac.saat.includes(filters.saat)) return false;
        if (filters.seritId && arac.serit_id && !arac.serit_id.toString().includes(filters.seritId)) return false;
        if (filters.ihlalDurumu !== '') {
            const ihlalVar = filters.ihlalDurumu === 'var';
            if (ihlalVar && arac.ihlal_durumu !== 1) return false;
            if (!ihlalVar && arac.ihlal_durumu === 1) return false;
        }
        if (filters.videoName && arac.video_name && !arac.video_name.toLowerCase().includes(filters.videoName.toLowerCase())) return false;
        return true;
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                    <div className="mt-3">Yükleniyor...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                    <button onClick={() => window.location.reload()} className="btn btn-primary ms-3">
                        Tekrar Dene
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <h1 className="text-primary mb-4">
                <i className="bi bi-car-front-fill me-2"></i>
                Araç Listesi
            </h1>

            {/* Filtreleme Paneli */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                        <i className="bi bi-funnel-fill me-2"></i>
                        Filtreleme
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4 col-lg-2">
                            <label className="form-label">Araç ID</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Araç ID ara..."
                                value={filters.aracId}
                                onChange={(e) => handleFilterChange('aracId', e.target.value)}
                            />
                        </div>
                        <div className="col-md-4 col-lg-2">
                            <label className="form-label">Giriş Zamanı</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filters.girisZamani}
                                onChange={(e) => handleFilterChange('girisZamani', e.target.value)}
                            />
                        </div>
                        <div className="col-md-4 col-lg-2">
                            <label className="form-label">Saat</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Saat ara..."
                                value={filters.saat}
                                onChange={(e) => handleFilterChange('saat', e.target.value)}
                            />
                        </div>
                        <div className="col-md-4 col-lg-2">
                            <label className="form-label">Şerit ID</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Şerit ID ara..."
                                value={filters.seritId}
                                onChange={(e) => handleFilterChange('seritId', e.target.value)}
                            />
                        </div>
                        <div className="col-md-4 col-lg-2">
                            <label className="form-label">İhlal Durumu</label>
                            <select
                                className="form-select"
                                value={filters.ihlalDurumu}
                                onChange={(e) => handleFilterChange('ihlalDurumu', e.target.value)}
                            >
                                <option value="">Tümü</option>
                                <option value="var">İhlal Var</option>
                                <option value="yok">İhlal Yok</option>
                            </select>
                        </div>
                        <div className="col-md-4 col-lg-2">
                            <label className="form-label">Video İsmi</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Video ismi ara..."
                                value={filters.videoName}
                                onChange={(e) => handleFilterChange('videoName', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mt-3 d-flex justify-content-between">
                        <button
                            onClick={clearFilters}
                            className="btn btn-outline-secondary"
                        >
                            <i className="bi bi-x-circle me-1"></i>
                            Filtreleri Temizle
                        </button>
                        <div className="text-muted">
                            {filteredAraclar.length} araç bulundu
                            {filters.aracId || filters.girisZamani || filters.saat || filters.seritId || filters.ihlalDurumu || filters.videoName ?
                                ` (${araclar.length} toplam araçtan filtrelenmiş)` : ''}
                        </div>
                    </div>
                </div>
            </div>

            {/* Araç Tablosu */}
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-striped mb-0">
                            <thead className="table-dark">
                            <tr>
                                <th>Araç ID</th>
                                <th>Giriş Zamanı</th>
                                <th>Saat</th>
                                <th>Şerit ID</th>
                                <th>İhlal</th>
                                <th>Görsel</th>
                                <th>Video</th>
                                <th>İşlemler</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredAraclar.length > 0 ? (
                                filteredAraclar.map((arac, index) => (
                                    <tr key={index}>
                                        <td className="fw-bold">{arac.arac_id}</td>
                                        <td>{arac.giris_zamani || '-'}</td>
                                        <td>{arac.saat || '-'}</td>
                                        <td>{arac.serit_id ?? '-'}</td>
                                        <td>
                                                <span className={`badge ${arac.ihlal_durumu === 1 ? 'bg-danger' : 'bg-success'}`}>
                                                    {arac.ihlal_durumu === 1 ? 'İhlal Var' : 'Yok'}
                                                </span>
                                        </td>
                                        <td>
                                            {arac.goruntu ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${arac.goruntu}`}
                                                    alt={`Araç ${arac.arac_id}`}
                                                    className="img-thumbnail cursor-pointer"
                                                    style={{ width: '100px', height: '60px', objectFit: 'cover' }}
                                                    onClick={() => setSelectedImage(`data:image/jpeg;base64,${arac.goruntu}`)}
                                                />
                                            ) : (
                                                <span className="text-muted">Yok</span>
                                            )}
                                        </td>
                                        <td>{arac.video_name || '-'}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleItirazEt(arac.arac_id, arac.video_name, arac.ihlal_durumu)}
                                            >
                                                <i className="bi bi-megaphone me-1"></i>
                                                İtiraz Et
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-4">
                                        <div className="alert alert-warning mb-0">
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            {araclar.length === 0 ? 'Henüz araç verisi bulunmuyor.' : 'Filtre kriterlerine uygun araç bulunamadı.'}
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Büyük Görsel Modal */}
            {selectedImage && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content border-0">
                            <div className="modal-header border-0">
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setSelectedImage(null)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body text-center">
                                <img
                                    src={selectedImage}
                                    alt="Büyütülmüş Görsel"
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '80vh' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Araclar;