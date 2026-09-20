import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      style={{
        display: 'block',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#fff',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div
        style={{
          height: '160px',
          backgroundColor: '#f1f1f1',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px',
          overflow: 'hidden',
        }}
      >
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ color: '#999' }}>No Image</span>
        )}
      </div>

      <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>{product.name}</h3>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
        {product.category?.name}
      </p>
      <p style={{ fontWeight: 'bold', fontSize: '18px' }}>₹{product.price}</p>

      {product.numReviews > 0 && (
        <p style={{ fontSize: '13px', color: '#f5a623' }}>
          ⭐ {product.ratingsAverage.toFixed(1)} ({product.numReviews} reviews)
        </p>
      )}
    </Link>
  );
};

export default ProductCard;