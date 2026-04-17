import CrudPage from '../components/CrudPage';

export default function SiteSettings() {
  return (
    <CrudPage
      title="Site Settings"
      endpoint="site-settings"
      fields={[
        { key: 'key', label: 'Key', required: true },
        { key: 'value_en', label: 'Value (EN)', type: 'textarea' },
        { key: 'value_ar', label: 'Value (AR)', type: 'textarea' },
        { key: 'setting_type', label: 'Type', type: 'select', options: [
          { value: 'text', label: 'Text' },
          { value: 'image', label: 'Image' },
          { value: 'url', label: 'URL' },
          { value: 'json', label: 'JSON' },
        ]},
        { key: 'description', label: 'Description', hideInTable: true },
      ]}
    />
  );
}
