import React, { useState } from "react";
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";
import "./Carousel.css";

const CustomCarousel = ({ images, onImageClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
  
    const handleNext = (e) => {
      e.stopPropagation(); // Detiene la propagación del evento
      setCurrentIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    };
  
    const handlePrev = (e) => {
      e.stopPropagation(); // Detiene la propagación del evento
      setCurrentIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : images.length - 1
      );
    };
  
    const handleImageClick = () => {
      if (onImageClick) {
        onImageClick(); // Llama a la función proporcionada externamente si existe
      }
    };
  
    return (
      <div
        className="custom-carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="carousel-container" onClick={handleImageClick}>
         {images && images.length > 0 && images.map((image, index) => (
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