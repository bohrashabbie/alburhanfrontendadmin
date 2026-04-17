import CrudPage from '../components/CrudPage';

export default function Brands() {
  return (
    <CrudPage
      title="Brands"
      endpoint="brands"
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'logo_url', label: 'Logo URL' },
        { key: 'website_url', label: 'Website URL', hideInTable: true },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
