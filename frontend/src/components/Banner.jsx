import { useEffect, useState } from "react";
import "../style/Banner.css";

const images = [
  "/images/banner1.png",
  "/images/banner2.png",
  "/images/banner3.png",
];

export default function Banner() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(index); // lưu lại ảnh trước
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [index]);

  return (
    <div className="banner-container">
      {images.map((src, i) => {
        let className = "banner-image";
        if (i === index) className += " active";
        else if (i === prevIndex) className += " exit-left";

        return (
          <img
            key={i}
            className={className}
            src={src}
            alt={`Banner ${i + 1}`}
          />
        );
      })}
    </div>
  );
}
