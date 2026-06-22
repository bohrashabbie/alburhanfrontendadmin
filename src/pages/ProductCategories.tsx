import CrudPage from '../components/CrudPage';

export default function ProductCategories() {
  return (
    <CrudPage
      title="Product Categories"
      endpoint="product-categories"
      fields={[
        { key: 'name_en', label: 'Name (EN)', required: true },
        { key: 'slug', label: 'Slug (URL)', required: true },
        { key: 'name_ar', label: 'Name (AR)', hideInTable: true },
        { key: 'image_url', label: 'Image', type: 'image', uploadFolder: 'ms-lighting/categories' },
        { key: 'description_en', label: 'Description (EN)', type: 'textarea', hideInTable: true },
        { key: 'seo_title', label: 'SEO Title', hideInTable: true },
        { key: 'seo_description', label: 'SEO Description', type: 'textarea', hideInTable: true },
        { key: 'seo_keywords', label: 'SEO Keywords (comma separated)', type: 'textarea', hideInTable: true },
        { key: 'sort_order', label: 'Sort', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
