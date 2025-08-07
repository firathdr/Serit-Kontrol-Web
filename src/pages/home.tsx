import React from "react";
import "../App.css";
import "../index.css";

const features = [
  {
    title: "Gerçek Zamanlı İzleme",
    description: "Sistem, canlı video akışları üzerinden araçları gerçek zamanlı olarak izler. PyQt arayüzü ile kullanıcılara anlık görüntü aktarılır. Gelişmiş threading yapısı ile yüksek performanslı görüntü işleme sağlanır.",
    image: "/camera.jpg",
  },
  {
    title: "Hassas Araç Tespiti",
    description: "YOLO (You Only Look Once) nesne tespiti modeli kullanılarak araçlar hızlı ve doğru şekilde algılanır. Tespit edilen her araca benzersiz bir ID atanır ve takip sistemiyle hareketleri izlenir. Araç bilgileri otomatik veritabanına kaydedilir.",
    image: "/track.png",
  },
  {
    title: "Otomatik İhlal Tespiti",
    description: "Sistem, kullanıcı tarafından tanımlanan kurallara göre otomatik olarak ihlal tespiti yapar. Şerit ihlali, yasak park veya ters yönde ilerleme gibi senaryolar desteklenir. Tüm ihlaller, yapay zeka destekli analiz algoritmalarıyla belirlenir.",
    image: "/gui.png",
  },
  {
    title: "Detaylı Raporlama",
    description: "Her ihlal; aracın plakası, ihlal anına ait görüntü, kısa video klip, zaman damgası ve ihlal tipi ile birlikte sisteme kaydedilir. Kullanıcılar, PyQt arayüzü üzerinden bu verilere kolayca erişebilir ve dışa aktarım gerçekleştirebilir.",
    image: "/traffic.jpg",
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="snap-container-home">
      {features.map((feature) => (
        <section
          key={feature.title}
          className="feature-section-full-home snap-section-home"
          style={{
            backgroundImage: `linear-gradient(rgba(44,62,80,0.7), rgba(44,62,80,0.7)), url(${feature.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="feature-content-full-home">
            <h1>{feature.title}</h1>
            <p>{feature.description}</p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default HomePage;

const style = document.createElement('style');
style.innerHTML = `
.snap-container-home {
  scroll-snap-type: y mandatory;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100vw;
  margin: 0;
  padding: 0;
}
.snap-section-home {
  scroll-snap-align: start;
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
.feature-section-full-home {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background 0.4s;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
.feature-content-full-home {
  background: rgba(44,62,80,0.65);
  border-radius: 24px;
  padding: 48px 32px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.18);
  text-align: center;
  color: #fff;
  max-width: 600px;
}
.feature-content-full-home h1 {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 24px;
}
.feature-content-full-home p {
  font-size: 1.4rem;
  font-weight: 400;
}
/* Scrollbar gizleme sadece home için */
.snap-container-home::-webkit-scrollbar,
.snap-section-home::-webkit-scrollbar {
  display: none;
}
.snap-container-home,
.snap-section-home {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;
document.head.appendChild(style);
