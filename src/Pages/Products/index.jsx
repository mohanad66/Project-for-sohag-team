import { useState, useEffect, useCallback, useRef } from "react";
import { getCategories, getProducts } from "../../services/api";
import Card from "../../components/Cards";
import "./css/styles.css";
import { useSearchParams } from "react-router";
import { ClipLoader } from "react-spinners";
import { FiArrowUp } from "react-icons/fi";

const DEFAULT_FILTERS = {
    category: "all",
    minPrice: 0,
    maxPrice: 1000,
    rating: 0
};

const BATCH_SIZE = 12; // Number of cards to render at a time
const BATCH_DELAY = 100; // Delay between batches in ms

export default function Products() {
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState(() => {
        const params = Object.fromEntries(searchParams.entries());
        return {
            category: params.category || DEFAULT_FILTERS.category,
            minPrice: Number(params.minPrice) || DEFAULT_FILTERS.minPrice,
            maxPrice: Number(params.maxPrice) || DEFAULT_FILTERS.maxPrice,
            rating: Number(params.rating) || DEFAULT_FILTERS.rating
        };
    });

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [filterInputs, setFilterInputs] = useState({
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating
    });
    const [showScrollButton, setShowScrollButton] = useState(false);
    const batchTimerRef = useRef(null);

    // Handle scroll to show/hide up button
    useEffect(() => {
        const handleScroll = () => {
            const shouldShow = window.pageYOffset > 400;
            if (shouldShow !== showScrollButton) {
                setShowScrollButton(shouldShow);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [showScrollButton]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch and filter products
    useEffect(() => {
        const fetchAndFilterProducts = async () => {
            try {
                setLoading(true);
                const response = await getProducts({
                    category: filters.category !== "all" ? filters.category : null,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    minRating: filters.rating,
                    limit: 30

                });
                setProducts(response.products);
                setFilteredProducts(response.products);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError(err.message);
                setProducts([]);
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAndFilterProducts();
    }, [filters]);

    // Render products in batches
    useEffect(() => {
        if (filteredProducts.length === 0) {
            setVisibleProducts([]);
            return;
        }

        let currentIndex = 0;

        const renderBatch = () => {
            const nextIndex = Math.min(currentIndex + BATCH_SIZE, filteredProducts.length);
            setVisibleProducts(filteredProducts.slice(0, nextIndex));
            currentIndex = nextIndex;

            if (currentIndex < filteredProducts.length) {
                batchTimerRef.current = setTimeout(renderBatch, BATCH_DELAY);
            }
        };

        renderBatch();

        return () => {
            if (batchTimerRef.current) {
                clearTimeout(batchTimerRef.current);
            }
        };
    }, [filteredProducts]);

    // Apply filters
    const applyFilters = useCallback(() => {
        setFilters(prev => ({
            ...prev,
            minPrice: filterInputs.minPrice,
            maxPrice: filterInputs.maxPrice,
            rating: filterInputs.rating
        }));
    }, [filterInputs]);

    // Handle search
    const handleSearch = useCallback((search) => {
        if (search) {
            const filtered = products.filter(product =>
                product.title?.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [products]);

    // Scroll to top function
    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    if (loading) return (
        <div className="loading-container Loading">
            <ClipLoader color="var(--accent-primary)" size={50} />
        </div>
    );

    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="products">
            <div className="filter">
                <div className="tags">
                    <select
                        name="category"
                        value={filters.category}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                            <option key={category.slug} value={category.slug}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <div className="price-range">
                        <label>Price Range: ${filterInputs.minPrice} - ${filterInputs.maxPrice}</label>
                        <div className="range-inputs">
                            <input
                                type="range"
                                name="minPrice"
                                min="0"
                                max="1000"
                                value={filterInputs.minPrice}
                                onChange={(e) => setFilterInputs(prev => ({
                                    ...prev,
                                    minPrice: Number(e.target.value)
                                }))}
                            />
                            <input
                                type="range"
                                name="maxPrice"
                                min="0"
                                max="1000"
                                value={filterInputs.maxPrice}
                                onChange={(e) => setFilterInputs(prev => ({
                                    ...prev,
                                    maxPrice: Number(e.target.value)
                                }))}
                            />
                        </div>
                    </div>

                    <div className="rating-filter">
                        <label>Minimum Rating:</label>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    type="button"
                                    className={`star ${filterInputs.rating >= star ? "active" : ""}`}
                                    onClick={() => setFilterInputs(prev => ({ ...prev, rating: star }))}
                                    aria-label={`${star} star`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="btns">
                        <button
                            type="button"
                            onClick={() => setFilters(DEFAULT_FILTERS)}
                            className="reset-btn btn"
                        >
                            Reset Filters
                        </button>
                        <button
                            type="button"
                            onClick={applyFilters}
                            className="apply-btn btn"
                        >
                            Apply
                        </button>
                    </div>
                </div>

                <div className="search">
                    <input
                        type="text"
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search products..."
                        aria-label="Search products"
                    />
                </div>
            </div>

            <div className="cards-container">
                {visibleProducts.length > 0 ? (
                    visibleProducts.map((product, index) => (
                        <Card
                            card={product}
                            key={product.id}
                            style={{ animationDelay: `${(index % BATCH_SIZE) * 0.05}s` }}
                        />
                    ))
                ) : (
                    <div className="no-results">No products match your filters</div>
                )}
            </div>

            {showScrollButton && (
                <button
                    className="up-button visible"
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                >
                    <FiArrowUp />
                </button>
            )}
        </div>
    );
}