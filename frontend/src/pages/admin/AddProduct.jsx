import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm';
import { createProduct } from '../../api/adminProductService';

const AddProduct = () => {
  const navigate = useNavigate();

  const handleCreate = async (productData) => {
    await createProduct(productData);
    navigate('/admin/products');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm onSubmit={handleCreate} submitLabel="Create Product" />
    </div>
  );
};

export default AddProduct;