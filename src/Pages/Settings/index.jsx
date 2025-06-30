import { useEffect, useState } from "react";
import "./css/styles.css"
import { ClipLoader } from "react-spinners";
export default function Settings() {
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            if (document.readyState === "complete") {
                setLoading(false)
            }
        }, 500)
    }, [])
    const [marketName, setMarketName] = useState("My Market");
    const [currency, setCurrency] = useState("USD");
    const [isOpen, setIsOpen] = useState(true);
    if (loading) {
        return <div className="Loading loading-container" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ClipLoader
                color={"#2b2b2b"}
                loading={loading}
            />
        </div>;
    }
    return (
        <div className="settings">
            <h1>Settings</h1>
            <div>
                <label>
                    Market Name:
                    <input
                        type="text"
                        value={marketName}
                        onChange={e => setMarketName(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Currency:
                    <select
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="EGP">EGP</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Market Open:
                    <input
                        type="checkbox"
                        checked={isOpen}
                        onChange={e => setIsOpen(e.target.checked)}
                    />
                </label>
            </div>
            <div style={{ marginTop: 20 }}>
                <strong>Preview:</strong>
                <p>Market Name: {marketName}</p>
                <p>Currency: {currency}</p>
                <p>Status: {isOpen ? "Open" : "Closed"}</p>
            </div>
        </div>
    )
}