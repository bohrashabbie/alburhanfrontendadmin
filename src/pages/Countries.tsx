import CrudPage from '../components/CrudPage';

export default function Countries() {
  return (
    <CrudPage
      title="Countries"
      endpoint="countries"
      fields={[
        { key: 'name_en', label: 'Name (EN)', required: true },
        { key: 'name_ar', label: 'Name (AR)' },
        { key: 'slug', label: 'Slug', required: true },
        { key: 'firm_name_en', label: 'Firm Name (EN)' },
        { key: 'firm_name_ar', label: 'Firm Name (AR)', hideInTable: true },
        { key: 'description_en', label: 'Description (EN)', type: 'textarea', hideInTable: true },
        { key: 'description_ar', label: 'Description (AR)', type: 'textarea', hideInTable: true },
        { key: 'flag_url', label: 'Flag', type: 'image', uploadFolder: 'countries/flags', hideInTable: true },
        { key: 'country_image_url', label: 'Country Image', type: 'image', uploadFolder: 'countries' },
        { key: 'logo_url', label: 'Logo', type: 'image', uploadFolder: 'countries/logos', hideInTable: true },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
