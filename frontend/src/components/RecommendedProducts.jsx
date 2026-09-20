import { useState, useEffect } from 'react';
import { getRecommendations } from '../api/recommendationService';
import ProductCard from './ProductCard';

const RecommendedProducts = ({ title = "You Might Also Like", limit = 4, excludeId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await getRecommendations(limit, excludeId);
        setProducts(data.data || data);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      } finally {
        setLoading(false);
      }
    };

    if (excludeId) {
      fetchRecommendations();
    }
  }, [excludeId, limit]);

  if (loading || !products || products.length === 0) {
    return null; // RENDER AGATHU, so layout shift or duplication avoid pannalam
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;