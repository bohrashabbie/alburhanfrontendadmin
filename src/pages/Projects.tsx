import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Upload,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import {
  getAll,
  create,
  update,
  remove,
  listProjectImages,
  uploadProjectImage,
  deleteProjectImage,
} from '../services/api';
import type { ProjectImageOut } from '../services/api';
import { resolveImageUrl } from '../lib/images';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProjectRow {
  id: number;
  category_id: number | null;
  country_id: number | null;
  name_en: string;
  name_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  sort_order: number;
  is_active: boolean;
  images?: ProjectImageOut[];
}

interface CategoryRow {
  id: number;
  name_en: string;
  name_ar: string | null;
}

interface CountryRow {
  id: number;
  name_en: string;
  name_ar: string | null;
  slug: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const resolveImage = resolveImageUrl;

// ---------------------------------------------------------------------------
// Image management modal
// ---------------------------------------------------------------------------

function ImagesModal({
  project,
  onClose,
  onChange,
}: {
  project: ProjectRow;
  onClose: () => void;
  onChange: () => void;
}) {
  const [images, setImages] = useState<ProjectImageOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await listProjectImages(project.id);
      const sorted = [...data].sort((a, b) => a.sort_order - b.sort_order);
      setImages(sorted);
    } catch {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const startOrder = images.length > 0 ? Math.max(...images.map((i) => i.sort_order)) + 1 : 0;
      for (let i = 0; i < files.length; i++) {
        await uploadProjectImage(project.id, files[i], { sort_order: startOrder + i });
      }
      toast.success(files.length === 1 ? 'Image uploaded' : `${files.length} images uploaded`);
      await refresh();
      onChange();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    setDeleting(imageId);
    try {
      await deleteProjectImage(imageId);
      toast.success('Image deleted');
      await refresh();
      onChange();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl m-4 mb-10">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-lg font-semibold">Images — {project.name_en}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Upload, reorder (by ID), and delete images for this project.
              {' '}
              <span className="font-medium">{images.length}</span> image
              {images.length === 1 ? '' : 's'}.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {/* Upload bar */}
          <div className="flex items-center gap-3 mb-5">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? 'Uploading…' : 'Upload images'}
            </button>
            <span className="text-xs text-gray-500">
              Tip: select multiple files at once to upload in bulk.
            </span>
          </div>

          {/* Image grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2 size={20} className="animate-spin mr-2" /> Loading images…
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              <ImageIcon size={32} className="mx-auto mb-2 text-gray-300" />
              No images yet. Click <strong className="text-gray-600">Upload images</strong> to add some.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img) => {
                const src = resolveImage(img.image_url);
                const isDeleting = deleting === img.id;
                return (
                  <div
                    key={img.id}
                    className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                  >
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={24} />
                      </div>
                    )}

                    {/* overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-2">
                      <div className="w-full flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white font-medium bg-black/60 rounded px-1.5 py-0.5">
                          #{img.sort_order}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDelete(img.id)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 disabled:opacity-60"
                        >
                          {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                          {isDeleting ? '…' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function Projects() {
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [countries, setCountries] = useState<CountryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<ProjectRow> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [imagesFor, setImagesFor] = useState<ProjectRow | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [projs, cats, ctrs] = await Promise.all([
        getAll('projects', { active_only: false }),
        getAll('projects/categories', { active_only: false }),
        getAll('countries', { active_only: false }),
      ]);
      setItems(projs);
      setCategories(cats);
      setCountries(ctrs);
    } catch {
      toast.error('Failed to fetch data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const catName = (id: number | null | undefined) =>
    categories.find((c) => c.id === id)?.name_en || '—';
  const countryName = (id: number | null | undefined) =>
    countries.find((c) => c.id === id)?.name_en || '—';

  const handleNew = () => {
    setEditItem({
      category_id: categories[0]?.id ?? null,
      country_id: null,
      name_en: '',
      name_ar: '',
      description_en: '',
      description_ar: '',
      sort_order: 0,
      is_active: true,
    });
    setIsNew(true);
    setShowForm(true);
  };

  const handleEdit = (item: ProjectRow) => {
    setEditItem({ ...item });
    setIsNew(false);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this project? All of its images will be removed.')) return;
    try {
      await remove('projects', id);
      toast.success('Deleted');
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Delete failed');
    }
  };

  const handleSave = async () => {
    if (!editItem) return;
    try {
      const payload: Record<string, any> = { ...editItem };
      delete payload.id;
      delete payload.images;
      delete payload.category;
      delete payload.country;
      delete payload.created_at;
      delete payload.updated_at;

      if (isNew) {
        await create('projects', payload);
        toast.success('Created');
      } else {
        await update('projects', editItem.id!, payload);
        toast.success('Updated');
      }
      setShowForm(false);
      fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Save failed');
    }
  };

  const handleChange = (key: keyof ProjectRow, value: any) => {
    setEditItem((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage projects and their image galleries. Images are uploaded to S3 and shown on the
            public site.
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Edit/create modal */}
      {showForm && editItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4 mb-10">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-semibold">{isNew ? 'Create' : 'Edit'} Project</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={editItem.category_id ?? ''}
                  onChange={(e) =>
                    handleChange('category_id', e.target.value ? parseInt(e.target.value) : null)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                >
                  <option value="">-- Select category --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country (optional)
                </label>
                <select
                  value={editItem.country_id ?? ''}
                  onChange={(e) =>
                    handleChange('country_id', e.target.value ? parseInt(e.target.value) : null)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                >
                  <option value="">— Any country —</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_en}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to show the project on every country page.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (EN) *</label>
                <input
                  type="text"
                  value={editItem.name_en ?? ''}
                  onChange={(e) => handleChange('name_en', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (AR)</label>
                <input
                  type="text"
                  value={editItem.name_ar ?? ''}
                  onChange={(e) => handleChange('name_ar', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (EN)
                </label>
                <textarea
                  value={editItem.description_en ?? ''}
                  onChange={(e) => handleChange('description_en', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (AR)
                </label>
                <textarea
                  value={editItem.description_ar ?? ''}
                  onChange={(e) => handleChange('description_ar', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editItem.sort_order ?? 0}
                    onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={!!editItem.is_active}
                      onChange={(e) => handleChange('is_active', e.target.checked)}
                      className="h-4 w-4 text-amber-600 rounded"
                    />
                    Active (visible on site)
                  </label>
                </div>
              </div>

              {!isNew && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                  Save the project first, then use the <strong>Images</strong> button on the row to
                  upload photos.
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-5 border-t">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Save size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Images modal */}
      {imagesFor && (
        <ImagesModal
          project={imagesFor}
          onClose={() => setImagesFor(null)}
          onChange={fetchAll}
        />
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Preview</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name (EN)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Country</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Images</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sort</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Active</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    No projects yet.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const firstImg = resolveImage(item.images?.[0]?.image_url);
                  const count = item.images?.length || 0;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{item.id}</td>
                      <td className="px-4 py-3">
                        {firstImg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={firstImg}
                            alt=""
                            className="h-10 w-14 rounded object-cover border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{item.name_en}</td>
                      <td className="px-4 py-3 text-gray-600">{catName(item.category_id)}</td>
                      <td className="px-4 py-3 text-gray-600">{countryName(item.country_id)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            count > 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <ImageIcon size={12} />
                          {count}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{item.sort_order}</td>
                      <td className="px-4 py-3">{item.is_active ? '✓' : '✗'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setImagesFor(item)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-amber-700 hover:bg-amber-50 rounded border border-amber-200"
                            title="Manage images"
                          >
                            <ImageIcon size={13} /> Images
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
