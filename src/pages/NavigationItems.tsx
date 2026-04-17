import CrudPage from '../components/CrudPage';

export default function NavigationItems() {
  return (
    <CrudPage
      title="Navigation Items"
      endpoint="navigation"
      fields={[
        { key: 'label_en', label: 'Label (EN)', required: true },
        { key: 'label_ar', label: 'Label (AR)' },
        { key: 'href', label: 'URL Path', required: true },
        { key: 'icon', label: 'Icon', hideInTable: true },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
