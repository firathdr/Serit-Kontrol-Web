import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

interface Arac {
    arac_id: number;
    giris_zamani: string;
    saat: string;           // çıkış zamanı
    serit_id: number | null;
    ihlal_durumu: string | null;
    video_name: string;
    goruntu: string | null; // base64 image
}

const AdminAracListesi: React.FC = () => {
    const [araclar, setAraclar] = useState<Arac[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [modalShow, setModalShow] = useState<boolean>(false);
    const [selectedArac, setSelectedArac] = useState<Arac | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [feedbackMsg, setFeedbackMsg] = useState<string>("");

    // Araçları backend'den çek
    useEffect(() => {
        fetchAraclar();
    }, []);

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

    // Modal aç - seçilen aracı ayarla
    const handleSettingsClick = (arac: Arac) => {
        setSelectedArac(arac);
        setFeedbackMsg("");
        setModalShow(true);
    };

    // Modal kapat
    const handleModalClose = () => {
        setModalShow(false);
        setSelectedArac(null);
    };

    // Form input değişimi
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!selectedArac) return;
        const { name, value } = e.target;
        setSelectedArac({ ...selectedArac, [name]: value });
    };

    // Kaydetme işlemi
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

    // Silme işlemi
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
                    {araclar.map((arac) => (
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
                                ) : (
                                    "Yok"
                                )}
                            </td>
                            <td className="text-center">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleSettingsClick(arac)}
                                >
                                    <i className="bi bi-gear-fill"></i> {/* Bootstrap Icons kullanıyorsan */}
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
                        <Form.Group className="mb-3" controlId="formGirisZamani">
                            <Form.Label>Giriş Zamanı</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="giris_zamani"
                                value={selectedArac?.giris_zamani ? new Date(selectedArac.giris_zamani).toISOString().slice(0,16) : ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formCikisZamani">
                            <Form.Label>Çıkış Zamanı</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="saat"
                                value={selectedArac?.saat ? new Date(selectedArac.saat).toISOString().slice(0,16) : ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formSeritId">
                            <Form.Label>Şerit ID</Form.Label>
                            <Form.Control
                                type="number"
                                name="serit_id"
                                value={selectedArac?.serit_id ?? ""}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formIhlalDurumu">
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
