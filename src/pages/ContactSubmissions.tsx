import { useState, useEffect } from 'react';
import { getAll, remove, markAsRead } from '../services/api';
import toast from 'react-hot-toast';
import { Trash2, Eye, Mail, MailOpen } from 'lucide-react';

interface Submission {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  country_id: number | null;
  is_read: boolean;
  created_at: string | null;
}

export default function ContactSubmissions() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      setItems(await getAll('contact-submissions'));
    } catch {
      toast.error('Failed to fetch submissions');
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleView = async (item: Submission) => {
    setSelected(item);
    if (!item.is_read) {
      try {
        await markAsRead(item.id);
        setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, is_read: true } : i));
      } catch { /* ignore */ }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this submission?')) return;
    try {
      await remove('contact-submissions', id);
      toast.success('Deleted');
      setSelected(null);
      fetchItems();
    } catch {
      toast.error('Delete failed');
    }
  };

  const unreadCount = items.filter((i) => !i.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-amber-600 mt-1">{unreadCount} unread message(s)</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-400">Loading...</div>
            ) : items.length === 0 ? (
              <div className="p-6 text-center text-gray-400">No submissions</div>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleView(item)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selected?.id === item.id ? 'bg-amber-50 border-l-2 border-amber-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.is_read ? (
                      <MailOpen size={14} className="text-gray-400" />
                    ) : (
                      <Mail size={14} className="text-amber-500" />
                    )}
                    <span className={`text-sm font-medium ${item.is_read ? 'text-gray-600' : 'text-gray-900'}`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 truncate">{item.subject || item.email}</div>
                  {item.created_at && (
                    <div className="text-xs text-gray-300 mt-1">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{selected.subject || 'No Subject'}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div><span className="font-medium text-gray-500">Name:</span> <span className="text-gray-900">{selected.name}</span></div>
                <div><span className="font-medium text-gray-500">Email:</span> <span className="text-gray-900">{selected.email}</span></div>
                {selected.phone && <div><span className="font-medium text-gray-500">Phone:</span> <span className="text-gray-900">{selected.phone}</span></div>}
                {selected.country_id && <div><span className="font-medium text-gray-500">Country ID:</span> <span className="text-gray-900">{selected.country_id}</span></div>}
                {selected.created_at && <div><span className="font-medium text-gray-500">Date:</span> <span className="text-gray-900">{new Date(selected.created_at).toLocaleString()}</span></div>}
                <div className="pt-3 border-t">
                  <span className="font-medium text-gray-500 block mb-2">Message:</span>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">{selected.message || 'No message'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Eye size={40} className="mx-auto mb-2 opacity-50" />
                <p>Select a submission to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
