import CrudPage from '../components/CrudPage';

export default function Branches() {
  return (
    <CrudPage
      title="Branches"
      endpoint="branches"
      fields={[
        { key: 'country_id', label: 'Country ID', type: 'number', required: true },
        { key: 'name_en', label: 'Name (EN)', required: true },
        { key: 'name_ar', label: 'Name (AR)' },
        { key: 'address_en', label: 'Address (EN)', type: 'textarea' },
        { key: 'address_ar', label: 'Address (AR)', type: 'textarea', hideInTable: true },
        { key: 'phone1', label: 'Phone 1' },
        { key: 'phone2', label: 'Phone 2', hideInTable: true },
        { key: 'email', label: 'Email', hideInTable: true },
        { key: 'is_head_office', label: 'Head Office', type: 'checkbox' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
