import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  PieChart as PieIcon,
  CheckCircle2,
  Users,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const AdminAnalytics = () => {
  const { adminStudents, adminDepartments } = useApp();

  const [timeRange, setTimeRange] = useState('Spring 2026');

  // Academic trends data
  const monthlyData = [
    { month: 'Sep', cse: 450, it: 340, ece: 290, me: 210 },
    { month: 'Oct', cse: 460, it: 345, ece: 295, me: 215 },
    { month: 'Nov', cse: 470, it: 350, ece: 300, me: 218 },
    { month: 'Dec', cse: 475, it: 355, ece: 305, me: 220 },
    { month: 'Jan', cse: 480, it: 360, ece: 310, me: 220 },
  ];

  const departmentAttendance = [
    { name: 'Computer Science (CSE)', average: 88, threshold: 75 },
    { name: 'Information Tech (IT)', average: 84, threshold: 75 },
    { name: 'Electronics (ECE)', average: 79, threshold: 75 },
    { name: 'Mechanical (ME)', average: 72, threshold: 75 },
  ];

  const performanceDistribution = [
    { grade: 'Grade S (>9.0)', students: 348, color: '#21A67A' },
    { grade: 'Grade A (8.0-8.9)', students: 574, color: '#3b82f6' },
    { grade: 'Grade B (7.0-7.9)', students: 236, color: '#f59e0b' },
    { grade: 'Grade C (<7.0)', students: 90, color: '#ef4444' },
  ];

  const taskCompletionData = [
    { subject: 'CN', onTime: 92, late: 8 },
    { subject: 'MFEF', onTime: 85, late: 15 },
    { subject: 'ML', onTime: 78, late: 22 },
    { subject: 'OT', onTime: 95, late: 5 },
    { subject: 'API', onTime: 89, late: 11 },
  ];

  const handleExportAnalyticsCSV = () => {
    const headers = ['Department', 'Active Students', 'Avg Attendance %', 'Pass Rate %'];
    const rows = [
      ['Computer Science & Engineering', 480, 88, 97.5],
      ['Information Technology', 360, 84, 96.2],
      ['Electronics & Communication', 310, 79, 93.8],
      ['Mechanical Engineering', 220, 72, 88.5],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StudentHub_Analytics_Summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
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
            Executive Analytics & Academic Reports
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            High-level metrics, enrollment trajectory, grade point trends, and coursework compliance.
          </p>
        </div>

        <button
          onClick={handleExportAnalyticsCSV}
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
          <Download size={15} /> Export Analytical Report (CSV)
        </button>
      </div>

      {/* Top 2 Charts: Department Trajectory & Attendance by Department */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Department Trajectory */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
            Department Cohort Growth Trajectory
          </h3>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[180, 500]} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="cse" name="CSE" stroke="#21A67A" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="it" name="IT" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="ece" name="ECE" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="me" name="ME" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Distribution */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
            Department Attendance Standing
          </h3>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentAttendance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[50, 100]} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="average" name="Attendance %" fill="#21A67A" radius={[6, 6, 0, 0]}>
                  {departmentAttendance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.average < 75 ? '#ef4444' : '#21A67A'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom 2 Charts: CGPA Pie Distribution & Task Completion Rate */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: '20px',
        }}
      >
        {/* CGPA Distribution */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
            Undergraduate Honors & CGPA Distribution
          </h3>
          <div style={{ height: '240px', width: '100%', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="students"
                  nameKey="grade"
                >
                  {performanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task On-time Rate */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '22px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
            Coursework On-Time Submission Rates (%)
          </h3>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskCompletionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="subject" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 100]} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="onTime" name="On Time %" fill="#21A67A" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="late" name="Late %" fill="#f59e0b" stackId="a" radius={[6, 6, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
