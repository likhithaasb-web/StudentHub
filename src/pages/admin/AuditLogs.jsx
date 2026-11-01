import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Search,
  Filter,
  Download,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Terminal,
} from 'lucide-react';

const AuditLogs = () => {
  const { adminAuditLogs } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredLogs = adminAuditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.targetEntity && log.targetEntity.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesModule = selectedModule === 'All' || log.module === selectedModule;
    const matchesStatus = selectedStatus === 'All' || log.status === selectedStatus;

    return matchesSearch && matchesModule && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Action', 'Module', 'Performed By', 'Role', 'Target Entity', 'Details', 'Status', 'IP Address'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.action}"`,
      `"${l.module}"`,
      `"${l.performedBy}"`,
      `"${l.performerRole}"`,
      `"${l.targetEntity || ''}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.ipAddress || '127.0.0.1'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StudentHub_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
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
            Security Audit Trail & Governance Log
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Immutable administrative activity logs for compliance verification, grade changes, and regulatory reviews.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
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
          <Download size={15} /> Export Audit Trail (CSV)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search action, administrator, target..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-input, rgba(0,0,0,0.2))',
              color: 'var(--text-primary)',
              fontSize: '13px',
            }}
          />
        </div>

        <div style={{ flex: '0 1 160px' }}>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-input, rgba(0,0,0,0.2))',
              color: 'var(--text-primary)',
              fontSize: '13px',
            }}
          >
            <option value="All">All Modules</option>
            <option value="Students">Students</option>
            <option value="Academics">Academics</option>
            <option value="Attendance">Attendance</option>
            <option value="Assignments">Assignments</option>
            <option value="Exams">Exams</option>
            <option value="Announcements">Announcements</option>
            <option value="Settings">Settings</option>
            <option value="Admins">Admins</option>
          </select>
        </div>

        <div style={{ flex: '0 1 140px' }}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-input, rgba(0,0,0,0.2))',
              color: 'var(--text-primary)',
              fontSize: '13px',
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Warning">Warning</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          Total logged events: <strong>{filteredLogs.length}</strong>
        </div>
      </div>

      {/* Logs Table */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
                <th style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)' }}>Timestamp</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)' }}>Action</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)' }}>Module</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)' }}>Administrator</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)' }}>Target Entity</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)' }}>Operational Details</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const isWarn = log.status === 'Warning';
                return (
                  <tr
                    key={log.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {log.timestamp}
                    </td>

                    <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {log.action}
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {log.module}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.performedBy}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.performerRole}</div>
                    </td>

                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 600 }}>
                      {log.targetEntity || '—'}
                    </td>

                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '12px', maxWidth: '320px', lineHeight: '1.4' }}>
                      {log.details}
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          backgroundColor: isWarn ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                          color: isWarn ? '#ef4444' : '#22c55e',
                        }}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
