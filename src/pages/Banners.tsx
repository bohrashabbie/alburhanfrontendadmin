import CrudPage from '../components/CrudPage';

export default function Banners() {
  return (
    <CrudPage
      title="Banners"
      endpoint="banners"
      fields={[
        { key: 'country_id', label: 'Country ID', type: 'number' },
        { key: 'name_en', label: 'Name (EN)' },
        { key: 'name_ar', label: 'Name (AR)', hideInTable: true },
        { key: 'description_en', label: 'Description (EN)', type: 'textarea', hideInTable: true },
        { key: 'description_ar', label: 'Description (AR)', type: 'textarea', hideInTable: true },
        { key: 'image_url', label: 'Image URL' },
        { key: 'banner_type', label: 'Banner Type' },
        { key: 'position', label: 'Position', hideInTable: true },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
