import { useState, useEffect } from "react";
import "./css/styles.css";
import { Link } from "react-router";

export default function Card({ card , isCart = false, onUpdateItem }) {
    const [showPopup, setShowPopup] = useState(false);
    const [volume, setVolume] = useState(1);
    const [cartQuantity, setCartQuantity] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (showPopup) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showPopup]);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const found = cart.find(item => item.id === card.id);
        setCartQuantity(found ? found.volume || 1 : 0);
    }, [card.id]);

    const handleVolumeChange = (e) => {
        const value = Math.max(1, Number(e.target.value));
        setVolume(value);
    };

    const handleRemoveOneFromCart = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const idx = cart.findIndex(item => item.id === card.id);
        if (idx > -1) {
            let newQuantity = (cart[idx].volume || 1) - volume;
            if (newQuantity > 0) {
                cart[idx].volume = newQuantity;
                setCartQuantity(newQuantity);
            } else {
                cart.splice(idx, 1);
                setIsVisible(false);
                setCartQuantity(0);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            if (onUpdateItem) onUpdateItem(cart);
        }
    };

    const handleAddingToCart = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const idx = cart.findIndex(item => item.id === card.id);
        let newQuantity = volume;
        if (idx > -1) {
            newQuantity = (cart[idx].volume || 1) + volume;
            cart[idx].volume = newQuantity;
        } else {
            const cardWithVolume = { ...card, volume };
            cart.push(cardWithVolume);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartQuantity(newQuantity);
        if (onUpdateItem) onUpdateItem(cart);
    };

    const handleRemovingFromCart = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(item => item.id !== card.id);
        localStorage.setItem("cart", JSON.stringify(cart));
        setIsVisible(false);
        setCartQuantity(0);
        if (onUpdateItem) onUpdateItem(cart);
    };

    const [currentImageIdx, setCurrentImageIdx] = useState(0);
    if (!isVisible) return null;

    const images = card.images && card.images.length > 0 ? card.images : ["https://picsum.photos/200/300"];

    const goToPrevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <div className="card">
                <div className="card-image" onClick={() => setShowPopup(true)}>
                    <img src={images[0]} alt="" />
                </div>
                <div className="card-content">
                    <h2>{card.title}</h2>
                    <p>{card.description}</p>
                    <div className="info">
                        <div className="volume-control">
                            <label htmlFor={`volume-${card.id}`}>Quantity:</label>
                            <input
                                id={`volume-${card.id}`}
                                type="number"
                                min="1"
                                value={volume}
                                onChange={handleVolumeChange}
                            />
                        </div>
                        <div className="cart-quantity-info">
                            {cartQuantity > 0 && (
                                <span>In cart: {cartQuantity}</span>
                            )}
                        </div>
                        {isCart === false ? (
                            <div className="btns">
                                <button onClick={handleAddingToCart} className="btn">Add To Cart</button>
                                <Link to="/cart" className="btn" onClick={handleAddingToCart}>Buy</Link>
                            </div>
                        ) : (
                            <div className="btns">
                                <button onClick={handleRemovingFromCart} className="btn">Remove all</button>
                                <button onClick={handleRemoveOneFromCart} className="btn">
                                    Remove {volume >= cartQuantity ? cartQuantity : volume}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showPopup && (
                <div className="card-popup-overlay" onClick={() => setShowPopup(false)}>
                    <div className="card-popup-rectangle" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowPopup(false)}>×</button>
                        <div className="popup-content">
                            <div className="popup-left">
                                <h2>{card.title}</h2>
                                {card.price && <p className="card-price">Price: ${card.price}</p>}
                                {card.category && <p className="card-category">Category: {card.category}</p>}
                                {card.tags && card.tags.length > 0 && (
                                    <div className="card-tags">
                                        Tags: {card.tags.map(tag => (
                                            <span key={tag} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                {card.rating && (
                                    <div className="card-rating">Rating: {card.rating} / 5</div>
                                )}
                                <p>{card.description}</p>
                                <div className="volume-control">
                                    <label htmlFor={`popup-volume-${card.id}`}>Quantity:</label>
                                    <input
                                        id={`popup-volume-${card.id}`}
                                        type="number"
                                        min="1"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                    />
                                </div>
                                <div className="cart-quantity-info">
                                    {cartQuantity > 0 && <span>In cart: {cartQuantity}</span>}
                                </div>
                                {card.details && (
                                    <div className="card-details">
                                        <h3>Details</h3>
                                        <ul>
                                            {Object.entries(card.details).map(([key, value]) => (
                                                <li key={key}>
                                                    <strong>{key}:</strong> {value}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="btns">
                                    {isCart === false ? (
                                        <>
                                            <button onClick={handleAddingToCart} className="btn">Add To Cart</button>
                                            <Link to="/cart" className="btn" onClick={handleAddingToCart}>Buy</Link>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={handleRemovingFromCart} className="btn">Remove all</button>
                                            <button onClick={handleRemoveOneFromCart} className="btn">
                                                Remove {volume >= cartQuantity ? cartQuantity : volume}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="popup-right">
                                <div className="carousel popup-carousel">
                                    <button
                                        className="carousel-btn prev"
                                        onClick={goToPrevImage}
                                        disabled={images.length <= 1}
                                        style={{
                                            opacity: images.length <= 1 ? 0.5 : 1,
                                            pointerEvents: images.length <= 1 ? "none" : "auto"
                                        }}
                                    >&lt;</button>
                                    <img src={images[currentImageIdx]} alt="" />
                                    <button
                                        className="carousel-btn next"
                                        onClick={goToNextImage}
                                        disabled={images.length <= 1}
                                        style={{
                                            opacity: images.length <= 1 ? 0.5 : 1,
                                            pointerEvents: images.length <= 1 ? "none" : "auto"
                                        }}
                                    >&gt;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}