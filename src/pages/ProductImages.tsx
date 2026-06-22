import CrudPage from '../components/CrudPage';

export default function ProductImages() {
  return (
    <CrudPage
      title="Product Images"
      endpoint="product-images"
      fields={[
        { key: 'product_id', label: 'Product ID', type: 'number', required: true },
        { key: 'image_url', label: 'Image', type: 'image', uploadFolder: 'ms-lighting/products' },
        {
          key: 'image_type', label: 'Type', type: 'select',
          options: [
            { value: 'hero', label: 'Hero (product photo)' },
            { value: 'spec', label: 'Spec sheet' },
            { value: 'gallery', label: 'Gallery' },
          ],
        },
        { key: 'sort_order', label: 'Sort', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
