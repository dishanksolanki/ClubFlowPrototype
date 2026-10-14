import React, { useState } from 'react';
import { NavTab, Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { EventsPage } from './pages/EventsPage';
import { TasksPage } from './pages/TasksPage';
import { AttendancePage } from './pages/AttendancePage';
import { WorkingHoursPage } from './pages/WorkingHoursPage';
import { MembersPage } from './pages/MembersPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { HierarchyPage } from './pages/HierarchyPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ProfilePage } from './pages/ProfilePage';

// Modals
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { LogHoursModal } from './components/modals/LogHoursModal';
import { CreateAnnouncementModal } from './components/modals/CreateAnnouncementModal';
import { CreateEventModal } from './components/modals/CreateEventModal';
import { MemberDetailModal } from './components/modals/MemberDetailModal';
import { TaskDetailModal } from './components/modals/TaskDetailModal';
import { EventDetailModal } from './components/modals/EventDetailModal';
import { AnnouncementDetailModal } from './components/modals/AnnouncementDetailModal';

// Mock Data
import {
  CURRENT_USER,
  MEMBERS,
  DEPARTMENTS,
  TASKS,
  EVENTS,
  ATTENDANCE_HISTORY,
  WORKING_HOURS_LOG,
  ANNOUNCEMENTS,
  NOTIFICATIONS,
  INITIAL_ACTIVITIES,
} from './data/mockData';

import {
  DepartmentType,
  Member,
  Task,
  TaskStatus,
  ClubEvent,
  AttendanceRecord,
  AttendanceStatus,
  WorkingHourRecord,
  Announcement,
  ClubNotification,
  ActivityItem,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('Dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Core application states
  const [currentUser, setCurrentUser] = useState<Member>(CURRENT_USER);
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [events, setEvents] = useState<ClubEvent[]>(EVENTS);
  const [workingHours, setWorkingHours] = useState<WorkingHourRecord[]>(WORKING_HOURS_LOG);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(ATTENDANCE_HISTORY);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<ClubNotification[]>(NOTIFICATIONS);

  // Modal visibility states
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isLogHoursOpen, setIsLogHoursOpen] = useState(false);
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<ClubEvent | null>(null);
  const [selectedAnnouncementForDetail, setSelectedAnnouncementForDetail] = useState<Announcement | null>(null);

  const departmentsList: DepartmentType[] = [
    'Technical',
    'Design',
    'Marketing',
    'Event Management',
    'Media',
    'Content',
  ];

  // Helper to record an activity
  const recordActivity = (action: string, member: string, relatedItem: string, category: 'task' | 'event' | 'attendance' | 'hours') => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      action,
      member,
      relatedItem,
      timestamp: 'Just now',
      category,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Actions
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    if (updatedTask.status === 'Submitted') {
      recordActivity('Task submitted', currentUser.name, updatedTask.title, 'task');
    } else if (updatedTask.status === 'Completed' || updatedTask.status === 'Approved') {
      recordActivity('Task completed', currentUser.name, updatedTask.title, 'task');
    }
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newEvent = {
            id: `act-${Date.now()}`,
            action: `Status changed to ${newStatus}`,
            actor: currentUser.name,
            timestamp: 'Just now',
          };
          if (newStatus === 'Submitted') {
            recordActivity('Task submitted', currentUser.name, t.title, 'task');
          } else if (newStatus === 'Completed' || newStatus === 'Approved') {
            recordActivity('Task completed', currentUser.name, t.title, 'task');
          }

          // Push notifications for task approvals/rejections
          if (newStatus === 'Approved') {
            const notif: ClubNotification = {
              id: `notif-${Date.now()}`,
              title: 'Task Approved',
              message: `Dr. Evelyn Hayes approved "${t.title}".`,
              timestamp: 'Just now',
              read: false,
              type: 'task',
              linkTab: 'Tasks',
              itemId: t.id,
            };
            setNotifications((prevNotifs) => [notif, ...prevNotifs]);
          } else if (newStatus === 'Rejected') {
            const notif: ClubNotification = {
              id: `notif-${Date.now()}`,
              title: 'Task Needs Revision',
              message: `"${t.title}" was marked as needing changes.`,
              timestamp: 'Just now',
              read: false,
              type: 'task',
              linkTab: 'Tasks',
              itemId: t.id,
            };
            setNotifications((prevNotifs) => [notif, ...prevNotifs]);
          }

          return {
            ...t,
            status: newStatus,
            history: [...(t.history || []), newEvent],
          };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    recordActivity('Task assigned', currentUser.name, `${newTask.title} → ${newTask.assignedTo}`, 'task');
    // Also push a notification
    const notif: ClubNotification = {
      id: `notif-${Date.now()}`,
      title: 'Task Assigned',
      message: `"${newTask.title}" assigned to ${newTask.assignedTo}.`,
      timestamp: 'Just now',
      read: false,
      type: 'task',
      linkTab: 'Tasks',
      itemId: newTask.id,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleLogHours = (record: WorkingHourRecord) => {
    setWorkingHours((prev) => [record, ...prev]);
    recordActivity('Work record added', record.member, `${record.project} (${record.hours}h)`, 'hours');
    // update member working hours in members list
    setMembers((prev) =>
      prev.map((m) => {
        if (m.name.toLowerCase() === record.member.toLowerCase()) {
          return {
            ...m,
            workingHours: parseFloat((m.workingHours + record.hours).toFixed(1)),
          };
        }
        return m;
      })
    );
    // update current user if matching
    if (record.member.toLowerCase() === currentUser.name.toLowerCase()) {
      setCurrentUser((prev) => ({
        ...prev,
        workingHours: parseFloat((prev.workingHours + record.hours).toFixed(1)),
      }));
    }
  };

  const handleUpdateWorkingHourStatus = (recordId: string, status: 'Verified' | 'Pending Verification') => {
    setWorkingHours((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          if (status === 'Verified') {
            recordActivity('Work record added', currentUser.name, `Verified ${r.member}'s ${r.hours}h for ${r.project}`, 'hours');
          }
          return { ...r, status, verifiedBy: currentUser.name };
        }
        return r;
      })
    );
  };

  const handleUpdateAttendanceStatus = (recordId: string, newStatus: AttendanceStatus) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          recordActivity('Attendance marked', currentUser.name, `${r.member} marked ${newStatus} for ${r.eventName}`, 'attendance');
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
  };

  const handleAddAttendanceRecord = (newRecord: AttendanceRecord) => {
    setAttendanceRecords((prev) => [newRecord, ...prev]);
    recordActivity('Attendance marked', currentUser.name, `${newRecord.member} marked ${newRecord.status} for ${newRecord.eventName}`, 'attendance');
  };

  const handleAddAnnouncement = (newAnnouncement: Announcement) => {
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    recordActivity('Announcement posted', currentUser.name, newAnnouncement.title, 'event');
    const notif: ClubNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Announcement',
      message: `${newAnnouncement.postedBy} posted "${newAnnouncement.title}"`,
      timestamp: 'Just now',
      read: false,
      type: 'announcement',
      linkTab: 'Announcements',
      itemId: newAnnouncement.id,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleNotificationClick = (notif: ClubNotification) => {
    if (notif.linkTab) {
      setActiveTab(notif.linkTab as NavTab);
    }
    if (notif.itemId) {
      if (notif.type === 'task') {
        const found = tasks.find((t) => t.id === notif.itemId);
        if (found) setSelectedTaskForDetail(found);
      } else if (notif.type === 'event') {
        const found = events.find((e) => e.id === notif.itemId);
        if (found) setSelectedEventForDetail(found);
      } else if (notif.type === 'announcement') {
        const found = announcements.find((a) => a.id === notif.itemId);
        if (found) setSelectedAnnouncementForDetail(found);
      }
    }
  };

  const handleAddEvent = (newEvent: ClubEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    recordActivity('Event created', currentUser.name, newEvent.title, 'event');
    const notif: ClubNotification = {
      id: `notif-${Date.now()}`,
      title: 'Upcoming Event',
      message: `"${newEvent.title}" on ${newEvent.date} at ${newEvent.venue}.`,
      timestamp: 'Just now',
      read: false,
      type: 'event',
      linkTab: 'Events',
      itemId: newEvent.id,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleUpdateEvent = (updatedEvent: ClubEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
    if (selectedEventForDetail?.id === updatedEvent.id) {
      setSelectedEventForDetail(updatedEvent);
    }
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleUpdateCurrentUser = (updated: Partial<Member>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectMemberById = (id: string) => {
    const found = members.find((m) => m.id === id || m.name.includes(id));
    if (found) setSelectedMember(found);
  };

  // Pending counts for sidebar badges
  const pendingTasksCount = tasks.filter(
    (t) => t.status === 'Pending' || t.status === 'In Progress' || t.status === 'Rejected'
  ).length;

  const unreadAnnouncementsCount = notifications.filter(
    (n) => !n.read && n.type === 'announcement'
  ).length;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        pendingTasksCount={pendingTasksCount}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
      />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        pendingTasksCount={pendingTasksCount}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          currentUser={currentUser}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onClearAllNotifications={handleClearAllNotifications}
          onNotificationClick={handleNotificationClick}
          onGlobalSearchSelect={(type, id) => {
            if (type === 'event') {
              const found = events.find((e) => e.id === id);
              if (found) setSelectedEventForDetail(found);
            } else if (type === 'task') {
              const found = tasks.find((t) => t.id === id);
              if (found) setSelectedTaskForDetail(found);
            } else if (type === 'member') {
              const found = members.find((m) => m.id === id);
              if (found) setSelectedMember(found);
            } else if (type === 'announcement') {
              const found = announcements.find((a) => a.id === id);
              if (found) setSelectedAnnouncementForDetail(found);
            }
          }}
          searchQuery={globalSearchQuery}
          onSearchQueryChange={setGlobalSearchQuery}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'Dashboard' && (
            <DashboardPage
              currentUser={currentUser}
              tasks={tasks}
              events={events}
              workingHours={workingHours}
              attendanceRecords={attendanceRecords}
              activities={activities}
              announcements={announcements}
              onNavigate={setActiveTab}
              onOpenCreateTask={() => setIsCreateTaskOpen(true)}
              onOpenLogHours={() => setIsLogHoursOpen(true)}
              onOpenCreateAnnouncement={() => setIsCreateAnnouncementOpen(true)}
              onOpenCreateEvent={() => setIsCreateEventOpen(true)}
              onSelectMember={handleSelectMemberById}
              onSelectEvent={(event) => setSelectedEventForDetail(event)}
              onSelectAnnouncement={(ann) => setSelectedAnnouncementForDetail(ann)}
            />
          )}

          {activeTab === 'Events' && (
            <EventsPage
              events={events}
              onOpenCreateEvent={() => setIsCreateEventOpen(true)}
              departments={departmentsList}
              members={members}
              tasks={tasks}
              currentUser={currentUser}
              onUpdateEvent={handleUpdateEvent}
              onSelectTask={(task) => {
                setSelectedEventForDetail(null);
                setSelectedTaskForDetail(task);
              }}
              onSelectMember={(member) => {
                setSelectedEventForDetail(null);
                setSelectedMember(member);
              }}
              onSelectEvent={(event) => setSelectedEventForDetail(event)}
            />
          )}

          {activeTab === 'Tasks' && (
            <TasksPage
              tasks={tasks}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onUpdateTask={handleUpdateTask}
              onOpenCreateTask={() => setIsCreateTaskOpen(true)}
              departments={departmentsList}
              members={members}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'Attendance' && (
            <AttendancePage
              records={attendanceRecords}
              members={members}
              events={events}
              currentUser={currentUser}
              onUpdateAttendanceStatus={handleUpdateAttendanceStatus}
              onAddAttendanceRecord={handleAddAttendanceRecord}
              onSelectMember={(m) => setSelectedMember(m)}
            />
          )}

          {activeTab === 'Working Hours' && (
            <WorkingHoursPage
              records={workingHours}
              members={members}
              currentUser={currentUser}
              onOpenLogHours={() => setIsLogHoursOpen(true)}
              onSelectMember={(m) => setSelectedMember(m)}
              onUpdateRecordStatus={handleUpdateWorkingHourStatus}
            />
          )}

          {activeTab === 'Members' && (
            <MembersPage
              members={members}
              departments={departmentsList}
              tasks={tasks}
              onSelectMember={(m) => setSelectedMember(m)}
            />
          )}

          {activeTab === 'Departments' && (
            <DepartmentsPage
              departments={DEPARTMENTS}
              members={members}
              tasks={tasks}
              events={events}
              onNavigate={setActiveTab}
              onSelectMember={(m) => setSelectedMember(m)}
              onSelectTask={(task) => setSelectedTaskForDetail(task)}
              onSelectEvent={(event) => setSelectedEventForDetail(event)}
            />
          )}

          {activeTab === 'Hierarchy' && (
            <HierarchyPage
              members={members}
              onSelectMember={(m) => setSelectedMember(m)}
            />
          )}

          {activeTab === 'Announcements' && (
            <AnnouncementsPage
              announcements={announcements}
              onOpenCreateAnnouncement={() => setIsCreateAnnouncementOpen(true)}
              departments={departmentsList}
              onSelectAnnouncement={(ann) => setSelectedAnnouncementForDetail(ann)}
            />
          )}

          {activeTab === 'Profile' && (
            <ProfilePage
              currentUser={currentUser}
              onUpdateCurrentUser={handleUpdateCurrentUser}
              myTasks={tasks.filter((t) => t.assignedTo === currentUser.name || t.assignedTo.includes('Dishank'))}
              myHours={workingHours}
            />
          )}
        </main>
      </div>

      {/* Interactive Global Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onAddTask={handleAddTask}
        members={members}
        departments={departmentsList}
        currentUser={currentUser}
      />

      <LogHoursModal
        isOpen={isLogHoursOpen}
        onClose={() => setIsLogHoursOpen(false)}
        onLogHours={handleLogHours}
        currentUser={currentUser}
        departments={departmentsList}
        members={members}
      />

      <CreateAnnouncementModal
        isOpen={isCreateAnnouncementOpen}
        onClose={() => setIsCreateAnnouncementOpen(false)}
        onAddAnnouncement={handleAddAnnouncement}
        currentUser={currentUser}
        departments={departmentsList}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onAddEvent={handleAddEvent}
        currentUser={currentUser}
        departments={departmentsList}
        members={members}
      />

      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        tasks={tasks}
        attendanceRecords={attendanceRecords}
        workingHours={workingHours}
        events={events}
        onSelectTask={(task) => {
          setSelectedMember(null);
          setSelectedTaskForDetail(task);
        }}
      />

      <TaskDetailModal
        task={selectedTaskForDetail}
        isOpen={Boolean(selectedTaskForDetail)}
        onClose={() => setSelectedTaskForDetail(null)}
        currentUser={currentUser}
        onUpdateTask={(updatedTask) => {
          handleUpdateTask(updatedTask);
          setSelectedTaskForDetail(updatedTask);
        }}
      />

      <EventDetailModal
        event={selectedEventForDetail}
        isOpen={Boolean(selectedEventForDetail)}
        onClose={() => setSelectedEventForDetail(null)}
        members={members}
        tasks={tasks}
        currentUser={currentUser}
        attendanceRecords={attendanceRecords}
        onUpdateEvent={handleUpdateEvent}
        onUpdateAttendanceStatus={handleUpdateAttendanceStatus}
        onAddAttendanceRecord={handleAddAttendanceRecord}
        onSelectTask={(task) => {
          setSelectedEventForDetail(null);
          setSelectedTaskForDetail(task);
        }}
        onSelectMember={(member) => {
          setSelectedEventForDetail(null);
          setSelectedMember(member);
        }}
      />

      <AnnouncementDetailModal
        announcement={selectedAnnouncementForDetail}
        isOpen={Boolean(selectedAnnouncementForDetail)}
        onClose={() => setSelectedAnnouncementForDetail(null)}
      />
    </div>
  );
}
