import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  UserCheck,
  ClipboardList,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Plus,
  Megaphone,
  Clock,
  CheckCircle2,
  ChevronRight,
  Shield,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const AdminOverview = () => {
  const {
    adminStudents,
    adminDepartments,
    adminAnnouncements,
    adminAuditLogs,
    adminAssignments,
    adminExams,
  } = useApp();
  const navigate = useNavigate();

  // Metrics calculations
  const totalStudentsCount = 1248;
  const activeStudentsCount = 1192;
  const totalCoursesCount = adminDepartments.reduce((acc, d) => acc + (d.subjects?.length || 0), 0);
  const shortagesCount = adminStudents.filter((s) => (s.attendancePercentage || 0) < 75).length;
  const avgAttendance = 83.5;

  const kpis = [
    {
      title: 'Total Enrolled Students',
      value: totalStudentsCount.toLocaleString(),
      subtitle: '+12% from previous year',
      trend: '+12%',
      isPositive: true,
      icon: Users,
      color: '#21A67A',
      link: '/admin/students',
    },
    {
      title: 'Active Students',
      value: activeStudentsCount.toLocaleString(),
      subtitle: '95.5% active engagement',
      trend: '+3.2%',
      isPositive: true,
      icon: CheckCircle2,
      color: '#3b82f6',
      link: '/admin/students',
    },
    {
      title: 'Total Active Courses',
      value: `${totalCoursesCount || 14} Subjects`,
      subtitle: `Across ${adminDepartments.length} Departments`,
      trend: '4 Batches',
      isPositive: true,
      icon: GraduationCap,
      color: '#8b5cf6',
      link: '/admin/academics',
    },
    {
      title: 'Aggregate Attendance',
      value: `${avgAttendance}%`,
      subtitle: `${shortagesCount} students below 75% cutoff`,
      trend: shortagesCount > 0 ? `${shortagesCount} Defaulters` : 'Healthy',
      isPositive: shortagesCount === 0,
      icon: UserCheck,
      color: shortagesCount > 0 ? '#ef4444' : '#10b981',
      link: '/admin/attendance',
    },
    {
      title: 'Coursework & Submissions',
      value: '342 Submissions',
      subtitle: `${adminAssignments.length} active assignments`,
      trend: '94% On Time',
      isPositive: true,
      icon: ClipboardList,
      color: '#f59e0b',
      link: '/admin/assignments',
    },
    {
      title: 'Master Examinations',
      value: `${adminExams.length} Scheduled`,
      subtitle: 'Spring 2026 Mid-Terms',
      trend: 'Starts Mar 15',
      isPositive: true,
      icon: Calendar,
      color: '#ec4899',
      link: '/admin/exams',
    },
  ];

  // Enrollment trend data
  const enrollmentData = [
    { month: 'Sep', students: 1120, registrations: 45 },
    { month: 'Oct', students: 1150, registrations: 30 },
    { month: 'Nov', students: 1180, registrations: 30 },
    { month: 'Dec', students: 1205, registrations: 25 },
    { month: 'Jan', students: 1230, registrations: 25 },
    { month: 'Feb', students: 1248, registrations: 18 },
  ];

  // Department attendance comparison
  const departmentAttendanceData = [
    { department: 'CSE', attendance: 88, threshold: 75 },
    { department: 'IT', attendance: 84, threshold: 75 },
    { department: 'ECE', attendance: 79, threshold: 75 },
    { department: 'ME', attendance: 72, threshold: 75 },
  ];

  // CGPA distribution
  const cgpaData = [
    { band: '9.0 - 10.0 (Honors)', count: 28, color: '#21A67A' },
    { band: '8.0 - 8.9 (Distinction)', count: 46, color: '#3b82f6' },
    { band: '7.0 - 7.9 (First Class)', count: 19, color: '#f59e0b' },
    { band: '< 7.0 (Pass / At Risk)', count: 7, color: '#ef4444' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner / Actions */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Welcome back, Administrator
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Comprehensive institutional analytics, student directory and platform operations for Spring 2026.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate('/admin/students')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(33, 166, 122, 0.3)',
            }}
          >
            <Plus size={16} /> Add Student
          </button>
          <button
            onClick={() => navigate('/admin/announcements')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Megaphone size={16} /> Broadcast Circular
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (6 cards) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(kpi.link)}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 150ms ease, border-color 150ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {kpi.title}
                </span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: `${kpi.color}20`,
                    color: kpi.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={18} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {kpi.value}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    {kpi.subtitle}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: kpi.isPositive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: kpi.isPositive ? '#22c55e' : '#ef4444',
                    }}
                  >
                    {kpi.trend}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Grid: Enrollment Trends & Attendance Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Enrollment Trend Area Chart */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Student Enrollment & Growth Trend
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Cumulative active undergraduate registrations (Sep 2025 - Feb 2026)
              </p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>
              1,248 Total
            </span>
          </div>

          <div style={{ height: '230px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#21A67A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#21A67A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[1050, 1300]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  name="Enrolled Students"
                  stroke="#21A67A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#enrollmentGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department-wise Attendance Bar Chart */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Department Attendance vs. 75% Cutoff
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Aggregated departmental percentages across logged lecture sessions
              </p>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#ef4444',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
              }}
            >
              ME Shortage Alert (72%)
            </span>
          </div>

          <div style={{ height: '230px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="department" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[50, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="attendance"
                  name="Avg Attendance %"
                  fill="#21A67A"
                  radius={[6, 6, 0, 0]}
                >
                  {departmentAttendanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.attendance < 75 ? '#ef4444' : '#21A67A'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: CGPA Distribution + Recent Activity Trail + Upcoming Master Events */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px',
        }}
      >
        {/* CGPA Performance Distribution */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Academic CGPA Distribution
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Semester 6 Batch</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cgpaData.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.band}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{item.count}%</span>
                </div>
                <div
                  style={{
                    height: '8px',
                    width: '100%',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${item.count}%`,
                      backgroundColor: item.color,
                      borderRadius: '4px',
                      transition: 'width 300ms ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Activities */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Administrative Action Trail
            </h3>
            <button
              onClick={() => navigate('/admin/audit-logs')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View Full Trail
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {adminAuditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: log.status === 'Warning' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(33, 166, 122, 0.15)',
                    color: log.status === 'Warning' ? '#ef4444' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {log.action}
                    </span>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      {log.timestamp.split(' ')[0]}
                    </span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.details}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Examination & Deadlines Schedule */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Master Academic Deadlines
            </h3>
            <button
              onClick={() => navigate('/admin/exams')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Master Schedule
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {adminExams.slice(0, 3).map((exam) => (
              <div
                key={exam.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {exam.subject} ({exam.code})
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {exam.date} • {exam.venue}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(33, 166, 122, 0.15)',
                    color: 'var(--primary)',
                  }}
                >
                  {exam.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
