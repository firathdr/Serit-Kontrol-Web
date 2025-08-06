import React from "react";
import "../App.css";
import "../index.css";

const features = [
  {
    title: "Gerçek Zamanlı İzleme",
    description: "Canlı video akışları üzerinden anlık ihlal tespiti ve takibi.",
    image: "/camera.jpg",
  },
  {
    title: "Hassas Araç Tespiti",
    description: "Gelişmiş yapay zeka modelleri ile araçları doğru bir şekilde algılama.",
    image: "/track.png",
  },
  {
    title: "Otomatik İhlal Tespiti",
    description: "Belirlenen kurallara göre otomatik şerit ihlali, park ihlali gibi durumları algılama.",
    image: "/gui.png",
  },
  {
    title: "Detaylı Raporlama",
    description: "Tespit edilen ihlallerin fotoğraf, video klibi ve zaman bilgileriyle raporlanması.",
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

// Sadece home sayfasına özel stiller
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
