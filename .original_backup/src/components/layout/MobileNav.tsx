import React from 'react';
import {
  X,
  LayoutDashboard,
  Calendar,
  CheckSquare,
  ClipboardCheck,
  Clock,
  Users,
  FolderKanban,
  GitFork,
  Megaphone,
  User,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Member } from '../../types';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentUser: Member;
  pendingTasksCount: number;
  unreadAnnouncementsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  currentUser,
  pendingTasksCount,
  unreadAnnouncementsCount,
}) => {
  if (!isOpen) return null;

  const groups = [
    {
      title: 'Core Workspace',
      items: [
        { id: 'Dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'Events' as NavTab, label: 'Events & Calendar', icon: Calendar },
        { id: 'Tasks' as NavTab, label: 'Tasks & Deliverables', icon: CheckSquare, badge: pendingTasksCount },
      ],
    },
    {
      title: 'Operations & Roster',
      items: [
        { id: 'Attendance' as NavTab, label: 'Attendance Records', icon: ClipboardCheck },
        { id: 'Working Hours' as NavTab, label: 'Working Hours', icon: Clock },
        { id: 'Members' as NavTab, label: 'Members Directory', icon: Users },
        { id: 'Departments' as NavTab, label: 'Departments', icon: FolderKanban },
        { id: 'Hierarchy' as NavTab, label: 'Leadership Hierarchy', icon: GitFork },
      ],
    },
    {
      title: 'Communications',
      items: [
        { id: 'Announcements' as NavTab, label: 'Announcements', icon: Megaphone, badge: unreadAnnouncementsCount },
        { id: 'Profile' as NavTab, label: 'Personal Profile', icon: User },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[82vw] bg-white h-full shadow-2xl flex flex-col z-10">
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base leading-none">ClubFlow</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Campus Workspace</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onTabChange(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-indigo-400' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-mono tabular-nums font-semibold rounded-md ${
                          isActive
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <button
            type="button"
            onClick={() => {
              onTabChange('Profile');
              onClose();
            }}
            className="flex items-center gap-3 w-full text-left"
          >
            <Avatar
              src={currentUser.avatarUrl}
              name={currentUser.name}
              initials={currentUser.initials}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {currentUser.role} · {currentUser.department}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
