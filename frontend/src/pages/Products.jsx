import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Whenever URL search params (category or search) change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');

    setSelectedCategory(categoryParam || 'All');
    setSearchQuery(searchParam || '');

    if (products.length > 0) {
      applyFilters(categoryParam, searchParam, products);
    }
  }, [location.search, products]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://https://shopsphere-4xu4.onrender.com/api/products');
      const productData = res.data.data || res.data;
      const prodArray = Array.isArray(productData) ? productData : [];
      setProducts(prodArray);
      
      const params = new URLSearchParams(location.search);
      const categoryParam = params.get('category');
      const searchParam = params.get('search');

      setSelectedCategory(categoryParam || 'All');
      setSearchQuery(searchParam || '');
      applyFilters(categoryParam, searchParam, prodArray);
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (category, search, allProducts) => {
    let result = [...allProducts];

    // 1. Filter by Category
    if (category && category !== 'All') {
      result = result.filter((p) => {
        if (!p.category) return false;
        let catName = '';
        if (typeof p.category === 'object' && p.category !== null) {
          catName = p.category.name || '';
        } else if (typeof p.category === 'string') {
          catName = p.category;
        }
        return catName.trim().toLowerCase() === category.trim().toLowerCase();
      });
    }

    // 2. Filter by Search Query (Name or Description match)
    if (search && search.trim() !== '') {
      const query = search.toLowerCase().trim();
      
      result = result.filter((p) => {
        const nameMatch = p.name && p.name.toLowerCase().includes(query);
        const descMatch = p.description && p.description.toLowerCase().includes(query);
        return nameMatch || descMatch;
      });

      // Sort so exact/closer matches appear at the top
      result.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName.includes(query) && !bName.includes(query)) return -1;
        if (!aName.includes(query) && bName.includes(query)) return 1;
        return 0;
      });
    }

    setFilteredProducts(result);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 sm:py-8">
      <div className="page-container">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Products</h1>
            <p className="text-xs sm:text-sm text-amber-400 mt-1 break-words">
              {searchQuery ? (
                <span>Search results for: <b>"{searchQuery}"</b></span>
              ) : (
                <span>Showing category: <b>{selectedCategory}</b></span>
              )} ({filteredProducts.length} items)
            </p>
          </div>
          {(selectedCategory !== 'All' || searchQuery) && (
            <Link 
              to="/products"
              className="btn-touch inline-flex items-center justify-center self-start sm:self-auto text-xs bg-slate-900 border border-slate-800 px-4 rounded-xl hover:border-slate-700 transition-colors text-slate-300"
            >
              View All Products
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-12 sm:py-20 text-slate-400">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-20 px-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-sm sm:text-base text-slate-400 mb-2">
              No products found {searchQuery ? `for "${searchQuery}"` : `for category: ${selectedCategory}`}
            </p>
            <p className="text-xs text-slate-500">Try searching with a different keyword or browse all categories.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const displayCatName = 
                typeof product.category === 'object' && product.category !== null 
                  ? product.category.name 
                  : product.category;

              return (
                <div key={product._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-slate-700 transition-all">
                  <div className="h-44 sm:h-48 bg-slate-800 relative overflow-hidden">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {displayCatName && (
                      <span className="absolute top-3 left-3 max-w-[80%] truncate bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs px-2.5 py-1 rounded-full border border-slate-800">
                        {displayCatName}
                      </span>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">{product.description}</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
                      <span className="text-base font-bold text-amber-400">₹{product.price}</span>
                      <Link 
                        to={`/products/${product._id}`}
                        className="btn-touch inline-flex items-center bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold px-4 rounded-xl transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;