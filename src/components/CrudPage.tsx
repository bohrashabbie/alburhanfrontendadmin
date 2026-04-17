import { useState, useEffect } from 'react';
import { getAll, create, update, remove } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

export interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'checkbox' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
  width?: string;
  hideInTable?: boolean;
}

interface CrudPageProps {
  title: string;
  endpoint: string;
  fields: FieldDef[];
  idField?: string;
  queryParams?: Record<string, any>;
}

export default function CrudPage({ title, endpoint, fields, idField = 'id', queryParams }: CrudPageProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getAll(endpoint, { active_only: false, ...queryParams });
      setItems(data);
    } catch {
      toast.error('Failed to fetch data');
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [endpoint]);

  const handleNew = () => {
    const defaults: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === 'checkbox') defaults[f.key] = true;
      else if (f.type === 'number') defaults[f.key] = 0;
      else defaults[f.key] = '';
    });
    setEditItem(defaults);
    setIsNew(true);
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditItem({ ...item });
    setIsNew(false);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    try {
      await remove(endpoint, id);
      toast.success('Deleted');
      fetchItems();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleSave = async () => {
    try {
      const payload = { ...editItem };
      delete payload[idField];
      delete payload.created_at;
      delete payload.updated_at;
      // Remove nested relations from payload
      delete payload.items;
      delete payload.branches;
      delete payload.contact_infos;
      delete payload.projects;
      delete payload.images;
      delete payload.category;
      delete payload.country;

      if (isNew) {
        await create(endpoint, payload);
        toast.success('Created');
      } else {
        await update(endpoint, editItem[idField], payload);
        toast.success('Updated');
      }
      setShowForm(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Save failed');
    }
  };

  const handleChange = (key: string, value: any) => {
    setEditItem((prev: any) => ({ ...prev, [key]: value }));
  };

  const tableFields = fields.filter((f) => !f.hideInTable);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Modal Form */}
      {showForm && editItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4 mb-10">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-semibold">{isNew ? 'Create' : 'Edit'} {title}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={editItem[field.key] ?? ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                    />
                  ) : field.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      checked={!!editItem[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.checked)}
                      className="h-4 w-4 text-amber-600 rounded"
                    />
                  ) : field.type === 'number' ? (
                    <input
                      type="number"
                      value={editItem[field.key] ?? 0}
                      onChange={(e) => handleChange(field.key, parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={editItem[field.key] ?? ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                    >
                      <option value="">-- Select --</option>
                      {field.options?.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={editItem[field.key] ?? ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                    />
                  )}
                </div>
              ))}
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                {tableFields.map((f) => (
                  <th key={f.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={tableFields.length + 2} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={tableFields.length + 2} className="px-4 py-8 text-center text-gray-400">No items found</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item[idField]} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{item[idField]}</td>
                    {tableFields.map((f) => (
                      <td key={f.key} className="px-4 py-3 text-gray-700 max-w-xs truncate">
                        {f.type === 'checkbox'
                          ? (item[f.key] ? '✓' : '✗')
                          : String(item[f.key] ?? '').substring(0, 80)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item[idField])}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
