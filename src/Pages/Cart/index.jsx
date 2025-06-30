import React, { useEffect, useState } from "react";
import Card from "../../components/Cards";
import "./css/styles.css";
import { ClipLoader } from "react-spinners";

export default function Cart() {
    const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
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
        const handleStorageChange = () => {
            setCartItems(JSON.parse(localStorage.getItem('cart')) || []);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Proper grouping by ID and summing quantities
    const itemSummary = cartItems.reduce((acc, item) => {
        if (!acc[item.id]) {
            acc[item.id] = {
                ...item,
                quantity: item.volume || 1,
                totalPrice: (item.price || 0) * (item.volume || 1)
            };
        } else {
            acc[item.id].quantity += item.volume || 1;
            acc[item.id].totalPrice += (item.price || 0) * (item.volume || 1);
        }
        return acc;
    }, {});

    const summaryArray = Object.values(itemSummary);
    const grandTotal = summaryArray.reduce((sum, item) => sum + item.totalPrice, 0);

    const handleCheckout = () => {
        localStorage.removeItem('cart');
        setCartItems([]);
    };

    const handleUpdateItem = (updatedCart) => {
        setCartItems(updatedCart);
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
        <div className="cart">
            {cartItems.length > 0 ? (
                <>
                    <div className="cards-container">
                        {summaryArray.map(item => (
                            <Card
                                card={item}
                                key={item.id}
                                isCart={true}
                                onUpdateItem={handleUpdateItem}
                            />
                        ))}
                    </div>
                    <div className="cart-summary" style={{ marginTop: "2rem" }}>
                        <h2>Cart Summary</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summaryArray.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.title}</td>
                                        <td>${item.price?.toFixed(2) || '0.00'}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.totalPrice.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="cart-total">
                            <strong>Grand Total: ${grandTotal.toFixed(2)}</strong>
                        </div>
                        <button className="checkout-btn" onClick={handleCheckout}>
                            Check Out (Remove All)
                        </button>
                    </div>
                </>
            ) : (
                <div className="empty-page">
                    <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🛒</h1>
                    <h2 style={{ fontWeight: 400 }}>Your cart is empty!</h2>
                </div>
            )}
        </div>
    );
}