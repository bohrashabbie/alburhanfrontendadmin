import CrudPage from '../components/CrudPage';

export default function Projects() {
  return (
    <CrudPage
      title="Projects"
      endpoint="projects"
      fields={[
        { key: 'category_id', label: 'Category ID', type: 'number' },
        { key: 'country_id', label: 'Country ID', type: 'number' },
        { key: 'name_en', label: 'Name (EN)', required: true },
        { key: 'name_ar', label: 'Name (AR)' },
        { key: 'description_en', label: 'Description (EN)', type: 'textarea', hideInTable: true },
        { key: 'description_ar', label: 'Description (AR)', type: 'textarea', hideInTable: true },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
