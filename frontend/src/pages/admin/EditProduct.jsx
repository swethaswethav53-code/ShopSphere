import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm';
import { getProductById } from '../../api/productService';
import { updateProduct } from '../../api/adminProductService';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await getProductById(id);
      setProduct(response.data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async (productData) => {
    await updateProduct(id, productData);
    navigate('/admin/products');
  };

  if (loading) return <p className="text-gray-500">Loading product...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm initialData={product} onSubmit={handleUpdate} submitLabel="Update Product" />
    </div>
  );
};

export default EditProduct;