import CrudPage from '../components/CrudPage';

export default function SocialLinks() {
  return (
    <CrudPage
      title="Social Links"
      endpoint="social-links"
      fields={[
        { key: 'platform', label: 'Platform', required: true },
        { key: 'url', label: 'URL', required: true },
        { key: 'icon', label: 'Icon' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
