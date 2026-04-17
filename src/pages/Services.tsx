import CrudPage from '../components/CrudPage';

export default function Services() {
  return (
    <CrudPage
      title="Services"
      endpoint="services"
      fields={[
        { key: 'title_en', label: 'Title (EN)', required: true },
        { key: 'title_ar', label: 'Title (AR)' },
        { key: 'description_en', label: 'Description (EN)', type: 'textarea', hideInTable: true },
        { key: 'description_ar', label: 'Description (AR)', type: 'textarea', hideInTable: true },
        { key: 'image_url', label: 'Image URL' },
        { key: 'icon', label: 'Icon', hideInTable: true },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
