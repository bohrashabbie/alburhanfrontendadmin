import CrudPage from '../components/CrudPage';

export default function SearchAliases() {
  return (
    <CrudPage
      title="Search Aliases"
      endpoint="search-aliases"
      fields={[
        { key: 'keyword', label: 'Keyword (what users type)', required: true },
        {
          key: 'target_type', label: 'Target Type', type: 'select',
          options: [
            { value: 'product', label: 'Product' },
            { value: 'category', label: 'Category' },
          ],
        },
        { key: 'target_slug', label: 'Target Slug', required: true },
        { key: 'target_url', label: 'Target URL (optional, e.g. /products/recessed-down-light/ms-240r)', hideInTable: true },
        { key: 'is_redirect', label: 'Jump straight to page', type: 'checkbox' },
        { key: 'weight', label: 'Weight', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
