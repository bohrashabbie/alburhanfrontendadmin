import CrudPage from '../components/CrudPage';

export default function TeamMembers() {
  return (
    <CrudPage
      title="Team Members"
      endpoint="team-members"
      fields={[
        { key: 'name_en', label: 'Name (EN)', required: true },
        { key: 'name_ar', label: 'Name (AR)' },
        { key: 'designation_en', label: 'Designation (EN)' },
        { key: 'designation_ar', label: 'Designation (AR)', hideInTable: true },
        { key: 'quote_en', label: 'Quote (EN)', type: 'textarea', hideInTable: true },
        { key: 'quote_ar', label: 'Quote (AR)', type: 'textarea', hideInTable: true },
        { key: 'image_url', label: 'Image URL', hideInTable: true },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
