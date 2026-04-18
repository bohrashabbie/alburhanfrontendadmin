import CrudPage from '../components/CrudPage';

export default function CarouselSlides() {
  return (
    <CrudPage
      title="Carousel Slides"
      endpoint="carousel"
      fields={[
        { key: 'title_en', label: 'Title (EN)', required: true },
        { key: 'title_ar', label: 'Title (AR)' },
        { key: 'subtitle_en', label: 'Subtitle (EN)' },
        { key: 'subtitle_ar', label: 'Subtitle (AR)', hideInTable: true },
        { key: 'description_en', label: 'Description (EN)', type: 'textarea', hideInTable: true },
        { key: 'description_ar', label: 'Description (AR)', type: 'textarea', hideInTable: true },
        { key: 'image_url', label: 'Image', type: 'image', uploadFolder: 'carousel' },
        { key: 'sort_order', label: 'Sort Order', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
