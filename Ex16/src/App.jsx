import React, { useState, useEffect } from 'react';
import './App.css';

const slides = [
  { id: 1, text: 'Welcome to Slide 1' },
  { id: 2, text: 'This is Slide 2' },
  { id: 3, text: 'And finally, Slide 3' },
];

export default function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className="slideContainer">
        <p className="slideText">
          {slides[currentSlideIndex].text}
        </p>
      </div>
    </div>
  );
}


