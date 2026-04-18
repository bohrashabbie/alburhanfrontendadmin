import CrudPage from '../components/CrudPage';

export default function PageContents() {
  return (
    <CrudPage
      title="Page Contents"
      endpoint="page-contents"
      fields={[
        { key: 'page_key', label: 'Page Key', required: true },
        { key: 'section_key', label: 'Section Key', required: true },
        { key: 'title_en', label: 'Title (EN)' },
        { key: 'title_ar', label: 'Title (AR)', hideInTable: true },
        { key: 'content_en', label: 'Content (EN)', type: 'textarea', hideInTable: true },
        { key: 'content_ar', label: 'Content (AR)', type: 'textarea', hideInTable: true },
        { key: 'image_url', label: 'Image', type: 'image', uploadFolder: 'page-content' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
