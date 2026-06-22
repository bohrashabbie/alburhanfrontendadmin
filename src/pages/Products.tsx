import { useEffect, useState } from 'react';
import CrudPage from '../components/CrudPage';
import type { FieldDef } from '../components/CrudPage';
import { getAll } from '../services/api';

export default function Products() {
  const [catOptions, setCatOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    getAll('product-categories', { active_only: false })
      .then((cats: any[]) =>
        setCatOptions(cats.map((c) => ({ value: String(c.id), label: c.name_en })))
      )
      .catch(() => {});
  }, []);

  const fields: FieldDef[] = [
    { key: 'model_code', label: 'Model Code', required: true },
    { key: 'name_en', label: 'Name (EN)', required: true },
    { key: 'slug', label: 'Slug (URL)' },
    { key: 'category_id', label: 'Category', type: 'select', options: catOptions },
    { key: 'image_url', label: 'Hero Image', type: 'image', uploadFolder: 'ms-lighting/products' },
    { key: 'spec_image_url', label: 'Spec Sheet Image', type: 'image', uploadFolder: 'ms-lighting/products', hideInTable: true },
    { key: 'description_en', label: 'Description (EN)', type: 'textarea', hideInTable: true },
    { key: 'seo_title', label: 'SEO Title', hideInTable: true },
    { key: 'seo_description', label: 'SEO Description', type: 'textarea', hideInTable: true },
    { key: 'seo_keywords', label: 'SEO Keywords (comma separated)', type: 'textarea', hideInTable: true },
    { key: 'sort_order', label: 'Sort', type: 'number' },
    { key: 'is_active', label: 'Active', type: 'checkbox' },
  ];

  return <CrudPage title="Products" endpoint="products" fields={fields} />;
}
