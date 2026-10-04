import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-slate-700 transition-all h-full"
    >
      <div className="h-40 sm:h-44 bg-slate-950 flex items-center justify-center overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-slate-500 text-sm">No Image</span>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-white text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
          {product.name}
        </h3>

        {product.category?.name && (
          <p className="text-slate-400 text-xs sm:text-sm mb-2 truncate">
            {product.category.name}
          </p>
        )}

        <div className="mt-auto pt-2">
          <p className="font-bold text-base sm:text-lg text-amber-400">₹{product.price}</p>

          {product.numReviews > 0 && (
            <p className="text-xs text-amber-400 mt-1">
              ⭐ {product.ratingsAverage?.toFixed(1)} ({product.numReviews} reviews)
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;