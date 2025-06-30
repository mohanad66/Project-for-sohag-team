const BASE_URL = 'https://dummyjson.com/products';

/**
 * Fetches products with optional filters and limit
 */
export const getProducts = async (options = {}) => {
  try {
    const {
      category = null,
      minPrice = 0,
      maxPrice = Infinity,
      minRating = 0,
      limit = 100 // Default limit if not specified
    } = options;

    // First fetch to get total product count
    const initialResponse = await fetch(`${BASE_URL}?limit=0`);
    if (!initialResponse.ok) throw new Error('Network response was not ok');
    const initialData = await initialResponse.json();
    const totalProducts = initialData.total;

    // Calculate the actual limit to use (minimum of requested limit and total products)
    const actualLimit = Math.min(limit, totalProducts);

    // Fetch products with the determined limit
    const productsResponse = await fetch(`${BASE_URL}?limit=${actualLimit}`);
    if (!productsResponse.ok) throw new Error('Network response was not ok');
    let data = await productsResponse.json();
    
    let products = data.products || [];
    
    // Apply category filter if specified
    if (category) {
      const categoryResponse = await fetch(`${BASE_URL}/category/${category}`);
      if (!categoryResponse.ok) throw new Error('Failed to fetch category');
      const categoryData = await categoryResponse.json();
      products = categoryData.products || [];
    }

    // Apply client-side filters
    const filteredProducts = products.filter(product =>
      product.price >= minPrice &&
      product.price <= maxPrice &&
      product.rating >= minRating
    );

    return {
      products: filteredProducts.slice(0, limit), // Ensure we don't exceed the requested limit
      total: filteredProducts.length
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      total: 0
    };
  }
};
/**
 * Fetches all available categories
 */
export const getCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

/**
 * Fetches products by category (no limits)
 */
export const getByCategory = async (category) => {
  try {
    const response = await fetch(`${BASE_URL}/category/${category}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return {
      products: data.products || [],
      total: data.products?.length || 0
    };
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return {
      products: [],
      total: 0
    };
  }
};

/**
 * Searches products without limits
 */
export const searchProducts = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search?q=${query}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return {
      products: data.products || [],
      total: data.total || 0
    };
  } catch (error) {
    console.error("Error searching products:", error);
    return {
      products: [],
      total: 0
    };
  }
};

/**
 * Gets carousel images (limited by design)
 */
export const getCarouselImages = async (limit = 5) => {
  try {
    const response = await fetch(`${BASE_URL}?limit=${limit}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    return data.products.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      img: product.thumbnail || product.images[0]
    }));
  } catch (error) {
    console.error("Error fetching carousel images:", error);
    return [
      {
        id: 1,
        title: "Default Slide 1",
        description: "This is a default description",
        img: "https://via.placeholder.com/600x400?text=Slide+1"
      },
      {
        id: 2,
        title: "Default Slide 2",
        description: "Another default description",
        img: "https://via.placeholder.com/600x400?text=Slide+2"
      }
    ];
  }
};

/**
 * Gets popular products (limited by design)
 */
export const getPopularProducts = async (limit = 9) => {
  try {
    // First get all products
    const response = await fetch(`${BASE_URL}?limit=0`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    const totalProducts = data.total;

    // Then fetch all to sort by rating
    const allProductsResponse = await fetch(`${BASE_URL}?limit=${totalProducts}`);
    if (!allProductsResponse.ok) throw new Error('Network response was not ok');
    const allProductsData = await allProductsResponse.json();
    
    // Sort by rating and limit
    const sorted = allProductsData.products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return sorted.slice(0, limit);
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return [];
  }
};