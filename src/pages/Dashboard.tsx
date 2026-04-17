import { useEffect, useState } from 'react';
import { getAll } from '../services/api';
import {
  Settings, Navigation, Image, FileText, Briefcase, Layers,
  Users, Globe, GitBranch, Mail, Tag, Package, ImageIcon,
  FolderKanban, Building2, Share2, Link2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCard {
  label: string;
  endpoint: string;
  path: string;
  icon: any;
  color: string;
}

const cards: StatCard[] = [
  { label: 'Site Settings', endpoint: 'site-settings', path: '/site-settings', icon: Settings, color: 'bg-blue-500' },
  { label: 'Navigation', endpoint: 'navigation', path: '/navigation', icon: Navigation, color: 'bg-indigo-500' },
  { label: 'Carousel Slides', endpoint: 'carousel', path: '/carousel', icon: Image, color: 'bg-purple-500' },
  { label: 'Page Contents', endpoint: 'page-contents', path: '/page-contents', icon: FileText, color: 'bg-pink-500' },
  { label: 'Services', endpoint: 'services', path: '/services', icon: Briefcase, color: 'bg-red-500' },
  { label: 'Sectors', endpoint: 'sectors', path: '/sectors', icon: Layers, color: 'bg-orange-500' },
  { label: 'Team Members', endpoint: 'team-members', path: '/team-members', icon: Users, color: 'bg-amber-500' },
  { label: 'Countries', endpoint: 'countries', path: '/countries', icon: Globe, color: 'bg-yellow-500' },
  { label: 'Branches', endpoint: 'branches', path: '/branches', icon: GitBranch, color: 'bg-lime-500' },
  { label: 'Contact Info', endpoint: 'contact-info', path: '/contact-info', icon: Mail, color: 'bg-green-500' },
  { label: 'Brands', endpoint: 'brands', path: '/brands', icon: Tag, color: 'bg-emerald-500' },
  { label: 'Products', endpoint: 'products', path: '/products', icon: Package, color: 'bg-teal-500' },
  { label: 'Banners', endpoint: 'banners', path: '/banners', icon: ImageIcon, color: 'bg-cyan-500' },
  { label: 'Project Categories', endpoint: 'projects/categories', path: '/project-categories', icon: FolderKanban, color: 'bg-sky-500' },
  { label: 'Projects', endpoint: 'projects', path: '/projects', icon: Building2, color: 'bg-blue-600' },
  { label: 'Social Links', endpoint: 'social-links', path: '/social-links', icon: Share2, color: 'bg-violet-500' },
  { label: 'Footer Links', endpoint: 'footer-links', path: '/footer-links', icon: Link2, color: 'bg-fuchsia-500' },
  { label: 'Contact Submissions', endpoint: 'contact-submissions', path: '/contact-submissions', icon: Mail, color: 'bg-rose-500' },
];

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    cards.forEach((card) => {
      getAll(card.endpoint, { active_only: false })
        .then((data: any[]) => setCounts((p) => ({ ...p, [card.endpoint]: data.length })))
        .catch(() => setCounts((p) => ({ ...p, [card.endpoint]: 0 })));
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.endpoint}
              to={card.path}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-3">
                <div className={`${card.color} p-2.5 rounded-lg text-white`}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {counts[card.endpoint] ?? '...'}
                  </div>
                  <div className="text-sm text-gray-500 group-hover:text-gray-700">
                    {card.label}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
