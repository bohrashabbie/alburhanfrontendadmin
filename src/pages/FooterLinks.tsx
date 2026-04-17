import CrudPage from '../components/CrudPage';

export default function FooterLinks() {
  return (
    <CrudPage
      title="Footer Links"
      endpoint="footer-links"
      fields={[
        { key: 'section', label: 'Section', required: true, type: 'select', options: [
          { value: 'services', label: 'Services' },
          { value: 'legal', label: 'Legal' },
        ]},
        { key: 'label_en', label: 'Label (EN)', required: true },
        { key: 'label_ar', label: 'Label (AR)' },
        { key: 'href', label: 'URL' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
