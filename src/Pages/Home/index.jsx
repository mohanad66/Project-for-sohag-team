import React, { useEffect, useState } from "react";
import { getCarouselImages } from "../../services/api.js";
import { getCategories, getPopularProducts } from "../../services/api.js";
import Card from "../../components/Cards/index.jsx";
import { useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";
import "./css/styles.css"
// Add: Home page CLS wrapper
function HomeCLSWrapper({ children }) {
    return <div className="home-cls-wrapper">{children}</div>;
}

export default function Home() {
    const navigate = useNavigate(); // Add this line
    const [categories, setCategories] = useState([])
    const [popCards, setPopCards] = useState([])
     const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      if (document.readyState === "complete") {
        setLoading(false)
      }
    }, 500)
  }, [])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCategories();
    }, [])
    useEffect(() => {
        const fetchPopCards = async () => {
            try {
                const PopCardsData = await getPopularProducts(6);
                setPopCards(PopCardsData);
            } catch (err) {
                console.log(err);
            }
        };
        fetchPopCards();
    }, [])
    // Responsive: show 5 categories on small screens
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 500);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const displayedCategories = isMobile ? categories.slice(0, 10) : categories;
    const handleCategoryClick = (categorySlug) => {
        navigate(`/products?category=${categorySlug}`);
    };
    if (loading) {
        return <div className="Loading loading-container" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ClipLoader
                color={"#2b2b2b"}
                loading={loading}
            />
        </div>;
    }
    return (
        <>
            <div className="home">
                <h1 className="title">Some Of Our Products</h1>
                <Carousel />
                <div className="categories-container">
                    <h1 className="title">Categories</h1>
                    {displayedCategories.map((category, index) => (
                        <div
                            className="category"
                            key={index}
                            onClick={() => handleCategoryClick(category.slug)}
                            style={{ cursor: 'pointer' }} // Add pointer cursor
                        >
                            <h3>{category.name}</h3>
                        </div>
                    ))}
                </div>
                <div className="cards-container">
                    <h1 className="title">Popular Products</h1>
                    {popCards.map((popCard, index) => (
                        <Card card={popCard} key={index} />
                    ))}
                </div>
            </div>
        </>
    );
}


function Carousel() {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const images = await getCarouselImages(7); // Get 5 images
                setSlides(images);
            } catch (err) {
                setError(err.message);
                console.error("Carousel error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    // Auto-rotate slides every 5 seconds
    useEffect(() => {
        if (slides.length > 1) {
            const timer = setInterval(() => {
                goToNext();
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [slides, currentIndex]);

    const goToPrevious = () => {
        setCurrentIndex(prev =>
            prev === 0 ? slides.length - 1 : prev - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex(prev =>
            prev === slides.length - 1 ? 0 : prev + 1
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return <div className="Loading loading-container" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ClipLoader
                color={"#2b2b2b"}
                loading={loading}
            />
        </div>;
    }

    if (error) {
        return <div className="carousel-error">Error: {error}</div>;
    }

    if (slides.length === 0) {
        return <div className="carousel-empty">No slides available</div>;
    }

    return (
        <div className="carousel mobile-carousel">
            <div className="carousel-container mobile-carousel-container">
                <button
                    className="carousel-button prev mobile-carousel-button"
                    onClick={goToPrevious}
                    aria-label="Previous slide"
                >
                    &lt;
                </button>

                <div className="slide mobile-slide">
                    <div className="slide-image-container mobile-slide-image-container">
                        <img
                            src={slides[currentIndex].img}
                            alt={slides[currentIndex].title}
                            className="slide-image mobile-slide-image"
                            loading="lazy"
                        />
                    </div>
                    <div className="slide-content mobile-slide-content">
                        <h2 className="slide-title mobile-slide-title">{slides[currentIndex].title}</h2>
                        <p className="slide-description mobile-slide-description">{slides[currentIndex].description}</p>
                    </div>
                </div>

                <button
                    className="carousel-button next mobile-carousel-button"
                    onClick={goToNext}
                    aria-label="Next slide"
                >
                    &gt;
                </button>
            </div>

            {slides.length > 1 && (
                <div className="carousel-dots mobile-carousel-dots">
                    {slides.map((slide, index) => (
                        <button
                            key={index}
                            className={`dot mobile-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
