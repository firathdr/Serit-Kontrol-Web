import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Arac {
    arac_id: number;
    giris_zamani: string;
    saat: string;
    serit_id: number;
    ihlal_durumu: number;
    video_name: string;
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
    const [filters, setFilters] = useState<FilterState>({
        aracId: '',
        girisZamani: '',
        saat: '',
        seritId: '',
        ihlalDurumu: '',
        videoName: ''
    });

    useEffect(() => {
        const fetchAraclar = async () => {
            try {
                console.log("🚗 Araçlar yükleniyor...");
                const token = localStorage.getItem("token") || localStorage.getItem("access_token");
                console.log("🔑 Token:", token ? "Var" : "Yok");
                
                if (!token) {
                    setError("Token bulunamadı. Lütfen tekrar giriş yapın.");
                    setLoading(false);
                    return;
                }
                
                const response = await axios.get('http://localhost:5000/api/araclar', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                console.log("✅ API Response:", response.data);
                console.log("📊 Response type:", typeof response.data);
                console.log("📊 Is Array:", Array.isArray(response.data));
                
                // API response formatını kontrol et
                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    console.log("📋 Data array formatında");
                    setAraclar(response.data.data);
                } else if (Array.isArray(response.data)) {
                    console.log("📋 Direct array formatında");
                    setAraclar(response.data);
                } else if (response.data && response.data.araclar && Array.isArray(response.data.araclar)) {
                    console.log("📋 Araclar field formatında");
                    setAraclar(response.data.araclar);
                } else {
                    console.warn("⚠️ Beklenmeyen API response formatı:", response.data);
                    setAraclar([]);
                }
                
                setError("");
            } catch (error: any) {
                console.error('❌ Veri alınamadı:', error);
                console.error('❌ Error response:', error.response?.data);
                console.error('❌ Error status:', error.response?.status);
                
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


    const handleItirazEt = async (aracId: number, video_n: string,ihlal1:number) => {

        try {
            const sebep = window.prompt("İtiraz sebebinizi yazınız:");

            if (!sebep) {
                alert("İtiraz iptal edildi. Sebep girilmedi.");
                return;
            }

            const response = await axios.post(
                "http://localhost:5000/api/itiraz_et",
                {
                    username: localStorage.getItem('username'),
                    arac_id: aracId,
                    video_name: video_n,
                    sebep: sebep,
                    ihlal:ihlal1
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") || localStorage.getItem("access_token")}`,
                    },
                }
            );

            console.log("✅ İtiraz başarılı:", response.data);
            alert("İtirazınız başarıyla gönderildi!");
        } catch (error: any) {
            console.error('❌ İtiraz hatası:', error);
            alert("İtiraz gönderilirken hata oluştu: " + (error.response?.data?.message || 'Bilinmeyen hata'));
        }
    };

    const handleFilterChange = (field: keyof FilterState, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
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
        // Araç ID filtresi
        if (filters.aracId && !arac.arac_id.toString().includes(filters.aracId)) {
            return false;
        }

        // Giriş zamanı filtresi
        if (filters.girisZamani && arac.giris_zamani) {
            const girisDate = new Date(arac.giris_zamani);
            const filterDate = new Date(filters.girisZamani);
            if (girisDate.toDateString() !== filterDate.toDateString()) {
                return false;
            }
        }

        // Saat filtresi
        if (filters.saat && arac.saat && !arac.saat.includes(filters.saat)) {
            return false;
        }

        // Şerit ID filtresi
        if (filters.seritId && arac.serit_id && !arac.serit_id.toString().includes(filters.seritId)) {
            return false;
        }

        // İhlal durumu filtresi
        if (filters.ihlalDurumu !== '') {
            const ihlalVar = filters.ihlalDurumu === 'var';
            if (ihlalVar && arac.ihlal_durumu !== 1) {
                return false;
            }
            if (!ihlalVar && arac.ihlal_durumu === 1) {
                return false;
            }
        }

        // Video ismi filtresi
        if (filters.videoName && arac.video_name && !arac.video_name.toLowerCase().includes(filters.videoName.toLowerCase())) {
            return false;
        }

        return true;
    });

    if (loading) {
        return (
            <div className="p-4">
                <div className="text-center py-8">
                    <div className="text-xl">Yükleniyor...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="text-center py-8">
                    <div className="text-red-500 text-xl">Hata: {error}</div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Tekrar Dene
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Araç Listesi</h1>
            
            {/* Debug bilgisi */}
            {import.meta.env.DEV && (
                <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
                    <strong>Debug:</strong> {araclar.length} araç bulundu, {filteredAraclar.length} filtrelenmiş
                </div>
            )}

            {/* Gelişmiş Filtreleme */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Filtreleme</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Araç ID */}
                        <label className="block text-sm font-medium mb-1">Araç ID</label>
                        <input
                            type="text"
                            placeholder="Araç ID ara..."
                            value={filters.aracId}
                            onChange={(e) => handleFilterChange('aracId', e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    {/* Giriş Zamanı */}
                        <label className="block text-sm font-medium mb-1">Giriş Zamanı</label>
                        <input
                            type="date"
                            value={filters.girisZamani}
                            onChange={(e) => handleFilterChange('girisZamani', e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    {/* Saat */}
                        <label className="block text-sm font-medium mb-1">Saat</label>
                        <input
                            type="text"
                            placeholder="Saat ara..."
                            value={filters.saat}
                            onChange={(e) => handleFilterChange('saat', e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    {/* Şerit ID */}
                        <label className="block text-sm font-medium mb-1">Şerit ID</label>
                        <input
                            type="text"
                            placeholder="Şerit ID ara..."
                            value={filters.seritId}
                            onChange={(e) => handleFilterChange('seritId', e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    {/* İhlal Durumu */}
                        <label className="block text-sm font-medium mb-1">İhlal Durumu</label>
                        <select
                            value={filters.ihlalDurumu}
                            onChange={(e) => handleFilterChange('ihlalDurumu', e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tümü</option>
                            <option value="var">İhlal Var</option>
                            <option value="yok">İhlal Yok</option>
                        </select>


                    {/* Video İsmi */}
                        <label className="block text-sm font-medium mb-1">Video İsmi</label>
                        <input
                            type="text"
                            placeholder="Video ismi ara..."
                            value={filters.videoName}
                            onChange={(e) => handleFilterChange('videoName', e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                </div>

                {/* Filtre Temizle Butonu */}
                <div className="mt-4">
                    <button
                        onClick={clearFilters}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Filtreleri Temizle
                    </button>
                </div>
            </div>

            {/* Sonuç Bilgisi */}
            <div className="mb-4 text-sm text-gray-600">
                {filteredAraclar.length} araç bulundu
                {filters.aracId || filters.girisZamani || filters.saat || filters.seritId || filters.ihlalDurumu || filters.videoName ? 
                    ` (${araclar.length} toplam araçtan filtrelenmiş)` : ''}
            </div>

            {/* Tablo */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-300">
                    <thead>
                    <tr className="bg-gray-200 text-center">
                        <th className="border px-4 py-2">Araç ID</th>
                        <th className="border px-4 py-2">Giriş Zamanı</th>
                        <th className="border px-4 py-2">Saat</th>
                        <th className="border px-4 py-2">Şerit ID</th>
                        <th className="border px-4 py-2">İhlal</th>
                        <th className="border px-4 py-2">Video</th>
                        <th className="border px-4 py-2">İtiraz</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredAraclar.map((arac, index) => (
                        <tr key={index} className="text-center hover:bg-gray-50">
                            <td className="border px-4 py-2 font-medium">{arac.arac_id}</td>
                            <td className="border px-4 py-2">{arac.giris_zamani || 'Yok'}</td>
                            <td className="border px-4 py-2">{arac.saat || 'Yok'}</td>
                            <td className="border px-4 py-2">{arac.serit_id ?? 'Yok'}</td>
                            <td className="border px-4 py-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                    arac.ihlal_durumu === 1 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-green-100 text-green-800'
                                }`}>
                                    {arac.ihlal_durumu === 1 ? 'İhlal Var' : 'Yok'}
                                </span>
                            </td>
                            <td className="border px-4 py-2">{arac.video_name || 'Yok'}</td>
                            <td className="border px-4 py-2">
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                    onClick={() => handleItirazEt(arac.arac_id, arac.video_name,arac.ihlal_durumu)}
                                >
                                    İtiraz Et
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredAraclar.length === 0 && (
                        <tr>
                            <td colSpan={7} className="py-8 text-center text-gray-500">
                                {araclar.length === 0 ? 'Henüz araç verisi bulunmuyor.' : 'Filtre kriterlerine uygun araç bulunamadı.'}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Araclar;