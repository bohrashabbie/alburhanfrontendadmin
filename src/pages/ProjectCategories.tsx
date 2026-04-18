import CrudPage from '../components/CrudPage';

export default function ProjectCategories() {
  return (
    <CrudPage
      title="Project Categories"
      endpoint="projects/categories"
      fields={[
        { key: 'name_en', label: 'Name (EN)', required: true },
        { key: 'name_ar', label: 'Name (AR)' },
        { key: 'cover_image_url', label: 'Cover Image', type: 'image', uploadFolder: 'project-categories' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
