import React, { useState } from 'react';
import {
  ArrowDown,
  ShieldCheck,
  Users,
  Building,
  Sparkles,
} from 'lucide-react';
import { Member } from '../types';
import { Avatar } from '../components/common/Avatar';
import { StatusBadge } from '../components/common/StatusBadge';

interface HierarchyPageProps {
  members: Member[];
  onSelectMember: (member: Member) => void;
}

export const HierarchyPage: React.FC<HierarchyPageProps> = ({
  members,
  onSelectMember,
}) => {
  const [filterLevel, setFilterLevel] = useState<
    'All' | 'Executive' | 'DepartmentLeads' | 'Members'
  >('All');

  // Hierarchy levels
  const faculty = members.filter((m) => m.hierarchyRole === 'Faculty Advisor');
  const president = members.filter((m) => m.hierarchyRole === 'President');
  const vp = members.filter((m) => m.hierarchyRole === 'Vice President');
  const deptHeads = members.filter((m) => m.hierarchyRole === 'Department Head');
  const deptCoHeads = members.filter(
    (m) => m.hierarchyRole === 'Department Co-Head'
  );
  const deptMembers = members.filter(
    (m) => m.hierarchyRole === 'Department Member'
  );

  const MemberCard = ({
    member,
    variant = 'default',
  }: {
    member: Member;
    variant?: 'executive' | 'default';
  }) => (
    <div
      onClick={() => onSelectMember(member)}
      className={`bg-white rounded-xl border p-4 shadow-xs hover:shadow-sm transition-all cursor-pointer group text-left max-w-sm w-full mx-auto relative overflow-hidden ${
        variant === 'executive'
          ? 'border-slate-300 ring-1 ring-slate-900/5 hover:border-slate-400'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar
          src={member.avatarUrl}
          name={member.name}
          initials={member.initials}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {member.name}
            </h4>
            <StatusBadge status={member.status} />
          </div>
          <p className="text-xs font-semibold text-slate-700 mt-0.5 truncate">
            {member.role}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {member.department}
          </p>
        </div>
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="font-mono text-slate-500 text-[10px]">
          {member.studentId}
        </span>
        <span className="font-mono tabular-nums text-slate-800 font-semibold">
          {member.attendanceRate}% Attendance
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-slate-900 text-white">
              Governance
            </span>
            <span className="text-xs text-slate-500 font-medium">Chain of Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Organizational Hierarchy
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Institutional leadership structure from University Faculty Advisor down to committee associates.
          </p>
        </div>

        {/* Level Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80 shrink-0 self-start sm:self-auto">
          {(
            [
              { id: 'All', label: 'Complete Tree' },
              { id: 'Executive', label: 'Executive Board' },
              { id: 'DepartmentLeads', label: 'Leads & Co-Heads' },
              { id: 'Members', label: 'General Body' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterLevel(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                filterLevel === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Hierarchy Flow */}
      <div className="space-y-8 py-2">
        {/* Tier 1: Faculty Advisor */}
        {(filterLevel === 'All' || filterLevel === 'Executive') && (
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 text-[11px] font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
              <span>01 · Faculty Governance</span>
            </div>
            <div className="flex justify-center">
              {faculty.map((f) => (
                <MemberCard key={f.id} member={f} variant="executive" />
              ))}
            </div>

            <div className="flex justify-center my-4">
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-slate-200" />
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {/* Tier 2: President */}
        {(filterLevel === 'All' || filterLevel === 'Executive') && (
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 text-[11px] font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <span>02 · Club President</span>
            </div>
            <div className="flex justify-center">
              {president.map((p) => (
                <MemberCard key={p.id} member={p} variant="executive" />
              ))}
            </div>

            <div className="flex justify-center my-4">
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-slate-200" />
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {/* Tier 3: Vice President */}
        {(filterLevel === 'All' || filterLevel === 'Executive') && (
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 text-[11px] font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <span>03 · Vice President & Secretariat</span>
            </div>
            <div className="flex justify-center">
              {vp.map((v) => (
                <MemberCard key={v.id} member={v} variant="executive" />
              ))}
            </div>

            <div className="flex justify-center my-4">
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-slate-200" />
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {/* Tier 4: Department Heads */}
        {(filterLevel === 'All' || filterLevel === 'DepartmentLeads') && (
          <div>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
                <span>04 · Department Heads</span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Directing technical, design, marketing, media & event operations
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptHeads.map((h) => (
                <MemberCard key={h.id} member={h} />
              ))}
            </div>

            <div className="flex justify-center my-6">
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-slate-200" />
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {/* Tier 5: Department Co-Heads */}
        {(filterLevel === 'All' || filterLevel === 'DepartmentLeads') && (
          <div>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
                <span>05 · Department Co-Heads</span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Operational co-leads overseeing daily project execution
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptCoHeads.map((ch) => (
                <MemberCard key={ch.id} member={ch} />
              ))}
            </div>

            <div className="flex justify-center my-6">
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-slate-200" />
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {/* Tier 6: Department Members */}
        {(filterLevel === 'All' || filterLevel === 'Members') && (
          <div>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
                <Users className="w-3.5 h-3.5 text-slate-900" />
                <span>06 · Committee Associates & Members</span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Active student contributors across all functional branches
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptMembers.map((m) => (
                <MemberCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
