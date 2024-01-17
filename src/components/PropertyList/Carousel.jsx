import React, { useState } from "react";
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";
import "./Carousel.css";

const CustomCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  return (
    <div
      className="custom-carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-container">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`carousel-image ${
              index === currentIndex ? "active" : ""
            }`}
          />
        ))}
        <div className={`carousel-overlay ${isHovered ? "visible" : ""}`}>
          <button className="carousel-button prev" onClick={handlePrev}>
            <LeftCircleFilled style={{ color: "white" }} />
          </button>
          <button className="carousel-button next" onClick={handleNext}>
            <RightCircleFilled style={{ color: "white" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomCarousel;
