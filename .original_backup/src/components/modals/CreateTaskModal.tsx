import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { DepartmentType, Member, Task, TaskPriority } from '../../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  members: Member[];
  departments: DepartmentType[];
  currentUser: Member;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  members,
  departments,
  currentUser,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<DepartmentType>('Technical');
  const [assignedTo, setAssignedTo] = useState(currentUser.name);
  const [deadline, setDeadline] = useState('Oct 20, 2026');
  const [priority, setPriority] = useState<TaskPriority>('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignedMember = members.find((m) => m.name === assignedTo);

    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      department,
      assignedBy: currentUser.name,
      assignedTo,
      assignedToAvatar: assignedMember?.avatarUrl,
      deadline,
      priority,
      status: 'Pending',
      createdAt: 'Today, Oct 12',
      history: [
        {
          id: `h-${Date.now()}-1`,
          action: 'Task created',
          actor: `${currentUser.name} (${currentUser.role.split('&')[0].trim()})`,
          timestamp: 'Just now',
        },
        {
          id: `h-${Date.now()}-2`,
          action: `Assigned to ${assignedTo}`,
          actor: currentUser.name,
          timestamp: 'Just now',
          note: `Assigned in ${department} Department with ${priority} priority`,
        },
      ],
    };

    onAddTask(newTask);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      description="Assign an action item to a department member or yourself."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Task Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Design Hackathon stage backdrop banner"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => {
                const newDept = e.target.value as DepartmentType;
                setDepartment(newDept);
                const firstMember = members.find(
                  (m) => m.department === newDept
                );
                if (firstMember) {
                  setAssignedTo(firstMember.name);
                }
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200/90 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Assign to Member
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200/90 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer"
            >
              <optgroup label={`${department} Department`}>
                {members
                  .filter((m) => m.department === department)
                  .map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} · {m.role}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Other Departments">
                {members
                  .filter((m) => m.department !== department)
                  .map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.department})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200/90 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deadline Target
            </label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="e.g. Oct 25, 2026"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Description & Acceptance Criteria
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide context, required assets, or checklist items..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
};
