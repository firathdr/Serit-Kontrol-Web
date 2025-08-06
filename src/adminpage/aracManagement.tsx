import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";

interface Arac {
    arac_id: number;
    giris_zamani: string;
    saat: string;
    serit_id: number | null;
    ihlal_durumu: string | null;
    video_name: string;
    goruntu: string | null;
}

interface FilterState {
    aracId: string;
    girisZamani: string;
    saat: string;
    seritId: string;
    ihlalDurumu: string;
    videoName: string;
}

const AdminAracListesi: React.FC = () => {
    const [araclar, setAraclar] = useState<Arac[]>([]);
    const [filteredAraclar, setFilteredAraclar] = useState<Arac[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [modalShow, setModalShow] = useState<boolean>(false);
    const [selectedArac, setSelectedArac] = useState<Arac | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [feedbackMsg, setFeedbackMsg] = useState<string>("");

    const [filters, setFilters] = useState<FilterState>({
        aracId: "",
        girisZamani: "",
        saat: "",
        seritId: "",
        ihlalDurumu: "",
        videoName: "",
    });

    useEffect(() => {
        fetchAraclar();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, araclar]);

    const fetchAraclar = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/araclar", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            setAraclar(res.data.data);
        } catch (err: any) {
            setError("Araçlar yüklenirken hata oluştu.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        const filtered = araclar.filter((arac) => {
            return (
                (filters.aracId === "" || arac.arac_id.toString().includes(filters.aracId)) &&
                (filters.girisZamani === "" || arac.giris_zamani.includes(filters.girisZamani)) &&
                (filters.saat === "" || arac.saat.includes(filters.saat)) &&
                (filters.seritId === "" || arac.serit_id?.toString().includes(filters.seritId)) &&
                (filters.ihlalDurumu === "" || arac.ihlal_durumu === filters.ihlalDurumu) &&
                (filters.videoName === "" || arac.video_name.includes(filters.videoName))
            );
        });
        setFilteredAraclar(filtered);
    };

    const handleSettingsClick = (arac: Arac) => {
        setSelectedArac(arac);
        setFeedbackMsg("");
        setModalShow(true);
    };

    const handleModalClose = () => {
        setModalShow(false);
        setSelectedArac(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!selectedArac) return;
        const { name, value } = e.target;
        setSelectedArac({ ...selectedArac, [name]: value });
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSave = async () => {
        if (!selectedArac) return;
        setSaving(true);
        setFeedbackMsg("");
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/araclar/${selectedArac.video_name}/${selectedArac.arac_id}`,
                {
                    giris_zamani: selectedArac.giris_zamani,
                    saat: selectedArac.saat,
                    serit_id: selectedArac.serit_id,
                    ihlal_durumu: selectedArac.ihlal_durumu,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            setFeedbackMsg("Araç başarıyla güncellendi.");
            fetchAraclar();
        } catch (err) {
            setFeedbackMsg("Güncelleme başarısız oldu.");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedArac) return;
        if (!window.confirm("Bu aracı silmek istediğinize emin misiniz?")) return;
        setDeleteLoading(true);
        setFeedbackMsg("");
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `http://localhost:5000/api/araclar/${selectedArac.video_name}/${selectedArac.arac_id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            setFeedbackMsg("Araç başarıyla silindi.");
            setModalShow(false);
            fetchAraclar();
        } catch (err) {
            setFeedbackMsg("Silme işlemi başarısız oldu.");
            console.error(err);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Tüm Araçlar</h2>

            {/* Filtreler */}
            <Row className="mb-3">
                <Col><Form.Control placeholder="Araç ID" name="aracId" value={filters.aracId} onChange={handleFilterChange} /></Col>
                <Col><Form.Control type="date" name="girisZamani" value={filters.girisZamani} onChange={handleFilterChange} /></Col>
                <Col><Form.Control type="date" name="saat" value={filters.saat} onChange={handleFilterChange} /></Col>
                <Col><Form.Control placeholder="Şerit ID" name="seritId" value={filters.seritId} onChange={handleFilterChange} /></Col>
                <Col>
                    <Form.Select name="ihlalDurumu" value={filters.ihlalDurumu} onChange={handleFilterChange}>
                        <option value="">İhlal Durumu</option>
                        <option value="ihlal">İhlal</option>
                        <option value="ihlal yok">İhlal Yok</option>
                    </Form.Select>
                </Col>
                <Col><Form.Control placeholder="Video Adı" name="videoName" value={filters.videoName} onChange={handleFilterChange} /></Col>
            </Row>

            {loading && (
                <div className="text-center my-4">
                    <Spinner animation="border" />
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>Araç ID</th>
                        <th>Giriş Zamanı</th>
                        <th>Çıkış Zamanı</th>
                        <th>Şerit</th>
                        <th>İhlal Durumu</th>
                        <th>Video</th>
                        <th>Görüntü</th>
                        <th>İşlemler</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredAraclar.map((arac) => (
                        <tr key={arac.arac_id}>
                            <td>{arac.arac_id}</td>
                            <td>{arac.giris_zamani}</td>
                            <td>{arac.saat}</td>
                            <td>{arac.serit_id ?? "Yok"}</td>
                            <td>{arac.ihlal_durumu ?? "Bilinmiyor"}</td>
                            <td>{arac.video_name}</td>
                            <td>
                                {arac.goruntu ? (
                                    <img
                                        src={`data:image/jpeg;base64,${arac.goruntu}`}
                                        alt={`Araç ${arac.arac_id}`}
                                        style={{ width: 100, height: 60, objectFit: "cover", borderRadius: 4 }}
                                    />
                                ) : "Yok"}
                            </td>
                            <td>
                                <Button variant="secondary" size="sm" onClick={() => handleSettingsClick(arac)}>
                                    Ayarlar
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            {/* Modal */}
            <Modal show={modalShow} onHide={handleModalClose} backdrop="static" keyboard={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Araç Düzenle - ID: {selectedArac?.arac_id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {feedbackMsg && (
                        <Alert variant={feedbackMsg.includes("başarılı") ? "success" : "danger"}>
                            {feedbackMsg}
                        </Alert>
                    )}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Giriş Zamanı</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="giris_zamani"
                                value={selectedArac?.giris_zamani ? new Date(selectedArac.giris_zamani).toISOString().slice(0,16) : ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Çıkış Zamanı</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="saat"
                                value={selectedArac?.saat ? new Date(selectedArac.saat).toISOString().slice(0,16) : ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Şerit ID</Form.Label>
                            <Form.Control
                                type="number"
                                name="serit_id"
                                value={selectedArac?.serit_id ?? ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>İhlal Durumu</Form.Label>
                            <Form.Select
                                name="ihlal_durumu"
                                value={selectedArac?.ihlal_durumu ?? ""}
                                onChange={handleInputChange}
                            >
                                <option value="">Seçiniz</option>
                                <option value="ihlal">İhlal</option>
                                <option value="ihlal yok">İhlal Yok</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>
                        {deleteLoading ? "Siliniyor..." : "Aracı Sil"}
                    </Button>
                    <Button variant="secondary" onClick={handleModalClose} disabled={saving || deleteLoading}>
                        İptal
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={saving || deleteLoading}>
                        {saving ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminAracListesi;
