import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Settings, Navigation, Image, FileText, Briefcase,
  Building2, Users, Globe, GitBranch, Share2, Tag, Package,
  ImageIcon, FolderKanban, Layers, Mail, Link2, LogOut, Menu, X,
  ChevronDown, ChevronRight,
} from 'lucide-react';

const menuGroups = [
  {
    label: 'Dashboard',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Site Settings', icon: Settings, path: '/site-settings' },
      { label: 'Navigation', icon: Navigation, path: '/navigation' },
      { label: 'Carousel Slides', icon: Image, path: '/carousel' },
      { label: 'Page Contents', icon: FileText, path: '/page-contents' },
      { label: 'Services', icon: Briefcase, path: '/services' },
      { label: 'Sectors', icon: Layers, path: '/sectors' },
      { label: 'Team Members', icon: Users, path: '/team-members' },
    ],
  },
  {
    label: 'Regional',
    items: [
      { label: 'Countries', icon: Globe, path: '/countries' },
      { label: 'Branches', icon: GitBranch, path: '/branches' },
      { label: 'Contact Info', icon: Mail, path: '/contact-info' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { label: 'Brands', icon: Tag, path: '/brands' },
      { label: 'Products', icon: Package, path: '/products' },
      { label: 'Banners', icon: ImageIcon, path: '/banners' },
      { label: 'Project Categories', icon: FolderKanban, path: '/project-categories' },
      { label: 'Projects', icon: Building2, path: '/projects' },
    ],
  },
  {
    label: 'Other',
    items: [
      { label: 'Social Links', icon: Share2, path: '/social-links' },
      { label: 'Footer Links', icon: Link2, path: '/footer-links' },
      { label: 'Static Pages', icon: FileText, path: '/static-pages' },
      { label: 'Contact Submissions', icon: Mail, path: '/contact-submissions' },
    ],
  },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsed((p) => ({ ...p, [label]: !p[label] }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} transition-all duration-200 bg-slate-900 text-white flex flex-col flex-shrink-0`}
      >
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-lg font-bold text-amber-400">AL-Burhan CMS</h1>
          <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {menuGroups.map((group) => (
            <div key={group.label} className="mb-1">
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200"
              >
                {group.label}
                {collapsed[group.label] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
              </button>
              {!collapsed[group.label] && group.items.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      active
                        ? 'bg-amber-600/20 text-amber-400 border-r-2 border-amber-400'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="text-sm text-slate-300">{user?.full_name || user?.username}</div>
          <div className="text-xs text-slate-500">{user?.role}</div>
          <button
            onClick={logout}
            className="mt-2 flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-gray-900">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="text-sm text-gray-500">
            {menuGroups.flatMap((g) => g.items).find((i) => i.path === location.pathname)?.label || 'Dashboard'}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
