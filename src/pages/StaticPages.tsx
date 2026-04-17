import CrudPage from '../components/CrudPage';

export default function StaticPages() {
  return (
    <CrudPage
      title="Static Pages"
      endpoint="static-pages"
      fields={[
        { key: 'slug', label: 'Slug', required: true },
        { key: 'title_en', label: 'Title (EN)' },
        { key: 'title_ar', label: 'Title (AR)' },
        { key: 'content_en', label: 'Content (EN)', type: 'textarea', hideInTable: true },
        { key: 'content_ar', label: 'Content (AR)', type: 'textarea', hideInTable: true },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
