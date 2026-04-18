import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Upload,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Search,
  RefreshCw,
} from 'lucide-react';
import {
  getAll,
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
  sort_order: number;
  is_active: boolean;
}

interface CategoryRow {
  id: number;
  name_en: string;
}

interface CountryRow {
  id: number;
  name_en: string;
}

interface ImageRow extends ProjectImageOut {
  project_name: string;
  category_name: string;
  country_name: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const resolveImage = resolveImageUrl;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProjectImages() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Upload state
  const [uploadProjectId, setUploadProjectId] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [projs, cats, ctrs] = await Promise.all([
        getAll('projects', { active_only: false }),
        getAll('projects/categories', { active_only: false }),
        getAll('countries', { active_only: false }),
      ]);
      setProjects(projs);

      // Fetch images for every project in parallel, then flatten + decorate.
      const lists = await Promise.all(
        projs.map((p: ProjectRow) =>
          listProjectImages(p.id).catch(() => []),
        ),
      );
      const catMap = new Map(cats.map((c: CategoryRow) => [c.id, c.name_en]));
      const ctryMap = new Map(ctrs.map((c: CountryRow) => [c.id, c.name_en]));
      const flat: ImageRow[] = [];
      projs.forEach((p: ProjectRow, idx: number) => {
        for (const img of lists[idx]) {
          flat.push({
            ...img,
            project_name: p.name_en,
            category_name: (p.category_id && catMap.get(p.category_id)) || '—',
            country_name: (p.country_id && ctryMap.get(p.country_id)) || '—',
          });
        }
      });
      // Sort: newest (highest id) first, per project.
      flat.sort((a, b) => b.id - a.id);
      setImages(flat);

      // Sensible default for the uploader.
      if (!uploadProjectId && projs.length > 0) {
        setUploadProjectId(String(projs[0].id));
      }
    } catch {
      toast.error('Failed to load data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (!uploadProjectId) {
      toast.error('Pick a project first');
      return;
    }
    const projectId = parseInt(uploadProjectId, 10);
    const existingForProject = images.filter((i) => i.project_id === projectId);
    const startOrder =
      existingForProject.length > 0
        ? Math.max(...existingForProject.map((i) => i.sort_order)) + 1
        : 0;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadProjectImage(projectId, files[i], {
          sort_order: startOrder + i,
        });
      }
      toast.success(files.length === 1 ? 'Image uploaded' : `${files.length} images uploaded`);
      await fetchAll();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (img: ImageRow) => {
    if (!confirm(`Delete this image from "${img.project_name}"?`)) return;
    setDeleting(img.id);
    try {
      await deleteProjectImage(img.id);
      toast.success('Image deleted');
      setImages((prev) => prev.filter((x) => x.id !== img.id));
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return images.filter((img) => {
      if (projectFilter !== 'all' && String(img.project_id) !== projectFilter) {
        return false;
      }
      if (q && !img.project_name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [images, projectFilter, search]);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.name_en.localeCompare(b.name_en)),
    [projects],
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Images</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Mass-manage every photo across all projects. Uploaded files are stored on S3.
          </p>
        </div>
        <button
          onClick={fetchAll}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Upload bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Upload images to project
            </label>
            <select
              value={uploadProjectId}
              onChange={(e) => setUploadProjectId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
            >
              <option value="">-- Select project --</option>
              {sortedProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name_en}
                  {p.is_active ? '' : '  (inactive)'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || !uploadProjectId}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? 'Uploading…' : 'Upload images'}
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="sm:w-72">
            <label className="block text-xs font-medium text-gray-600 mb-1">Filter by project</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
            >
              <option value="all">All projects</option>
              {sortedProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name_en}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Search project name
            </label>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to filter…"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex items-end">
            <span className="text-xs text-gray-500 pb-2">
              Showing <strong className="text-gray-700">{filtered.length}</strong> of{' '}
              <strong className="text-gray-700">{images.length}</strong> images
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={20} className="animate-spin mr-2" /> Loading images…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            <ImageIcon size={32} className="mx-auto mb-2 text-gray-300" />
            {images.length === 0
              ? 'No project images yet. Use the upload form above.'
              : 'No images match the current filter.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((img) => {
              const src = resolveImage(img.image_url);
              const isDeleting = deleting === img.id;
              return (
                <div
                  key={img.id}
                  className="group relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                >
                  <div className="aspect-[4/3]">
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
                  </div>
                  <div className="px-2 py-1.5 border-t border-gray-100 bg-white">
                    <div className="text-xs font-medium text-gray-800 truncate" title={img.project_name}>
                      {img.project_name}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">
                      {img.category_name} · {img.country_name} · #{img.sort_order}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors pointer-events-none">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                      <button
                        type="button"
                        onClick={() => handleDelete(img)}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 disabled:opacity-60"
                      >
                        {isDeleting ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
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
    </div>
  );
}
