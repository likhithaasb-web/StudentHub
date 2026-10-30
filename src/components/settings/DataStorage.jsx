import React, { useState, useEffect, useRef } from 'react';
import {
  Database,
  Download,
  Upload,
  Server,
  RefreshCw,
  HardDrive,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Loader2,
} from 'lucide-react';

const DataStorage = ({
  dbStatus = {},
  onCheckDb,
  onExportFullBackup,
  onImportFullBackup,
  tasks = [],
  notes = [],
  attendance = [],
  studySessions = [],
  onOpenClearConfirm,
  onOpenResetConfirm,
}) => {
  const [testingDb, setTestingDb] = useState(false);
  const [dbNotice, setDbNotice] = useState('');
  const [importNotice, setImportNotice] = useState({ type: '', text: '' });
  const [storageBytes, setStorageBytes] = useState(0);
  const fileInputRef = useRef(null);

  // Compute localStorage byte usage
  useEffect(() => {
    try {
      let total = 0;
      for (let x in localStorage) {
        if (localStorage.hasOwnProperty(x)) {
          total += (localStorage[x].length + x.length) * 2;
        }
      }
      setStorageBytes(total);
    } catch {
      setStorageBytes(184000);
    }
  }, [tasks, notes, attendance, studySessions]);

  const storageKb = Math.round(storageBytes / 1024);
  const maxKb = 5120; // 5MB standard HTML5 localStorage quota
  const storagePercent = Math.min(100, Math.max(1, Math.round((storageKb / maxKb) * 100)));

  const handleTestDatabase = async () => {
    setTestingDb(true);
    setDbNotice('');
    try {
      const isOnline = await onCheckDb();
      if (isOnline) {
        setDbNotice('MongoDB connection verified! Database is healthy and responsive (200 OK).');
      } else {
        setDbNotice('Could not reach Express/MongoDB server. StudentHub is safely operating in offline local browser mode.');
      }
    } catch {
      setDbNotice('Connection check timed out. Running in local browser storage mode.');
    } finally {
      setTestingDb(false);
      setTimeout(() => setDbNotice(''), 5000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const res = onImportFullBackup(event.target.result);
        if (res.success) {
          setImportNotice({ type: 'success', text: 'Backup restored successfully! All data updated.' });
        } else {
          setImportNotice({ type: 'error', text: `Restore failed: ${res.error || 'Invalid format'}` });
        }
      } catch (err) {
        setImportNotice({ type: 'error', text: `Failed to parse JSON file: ${err.message}` });
      }
      setTimeout(() => setImportNotice({ type: '', text: '' }), 5000);
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  // CSV Exporter for Attendance
  const exportAttendanceCSV = () => {
    const headers = ['Subject Code', 'Subject Name', 'Attended Classes', 'Total Held', 'Attendance %'];
    const rows = attendance.map((a) => [
      a.subject || '',
      a.name || a.fullName || a.subject || '',
      a.attended || 0,
      a.held || 0,
      `${a.held ? Math.round((a.attended / a.held) * 100) : 0}%`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    downloadBlob(csvContent, `studenthub-attendance-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
  };

  // CSV Exporter for Tasks
  const exportTasksCSV = () => {
    const headers = ['Title', 'Subject', 'Due Date', 'Priority', 'Status'];
    const rows = tasks.map((t) => [
      t.title || '',
      t.subject || '',
      t.dueDate || '',
      t.priority || 'Medium',
      t.status || 'Pending',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    downloadBlob(csvContent, `studenthub-tasks-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
  };

  // JSON Exporter for Notes
  const exportNotesJSON = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    downloadBlob(dataStr, `studenthub-notes-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
  };

  const downloadBlob = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Backend & Cloud Synchronization Status */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Server size={18} />
            </div>
            <span>Backend API & MongoDB Status</span>
          </div>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: dbStatus.connected ? 'var(--success-bg)' : 'var(--warning-bg)',
              color: dbStatus.connected ? 'var(--success)' : 'var(--warning)',
              border: `1px solid ${dbStatus.connected ? 'var(--success-border)' : 'var(--warning-border)'}`,
            }}
          >
            {dbStatus.connected ? '● Cloud Connected' : '● Local Offline Storage'}
          </span>
        </div>

        {dbNotice && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              fontSize: '0.86rem',
              fontWeight: 600,
              background: dbStatus.connected ? 'var(--success-bg)' : 'var(--bg-secondary)',
              color: dbStatus.connected ? 'var(--success)' : 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {dbNotice}
          </div>
        )}

        <div
          style={{
            padding: '1.15rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
              Service: {dbStatus.service || 'StudentHub Express Engine'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Database Host: {dbStatus.host || '127.0.0.1:27017'} • Status: {dbStatus.connected ? 'Synchronized' : 'Offline Mode'}
            </div>
            {dbStatus.lastChecked && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Last health ping: {dbStatus.lastChecked}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleTestDatabase}
            disabled={testingDb}
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.84rem',
              padding: '0.5rem 1rem',
            }}
          >
            <RefreshCw size={15} className={testingDb ? 'spin' : ''} />
            <span>{testingDb ? 'Checking Service...' : 'Ping Backend'}</span>
          </button>
        </div>
      </div>

      {/* Local Storage Quota Usage */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <HardDrive size={18} />
            </div>
            <span>Local Browser Storage Meter</span>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {storageKb} KB / {maxKb} KB ({storagePercent}%)
          </span>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
          StudentHub stores your timetable, lecture attendance records, tasks, exam countdowns, and notes locally in your browser with zero latency.
        </p>

        <div
          style={{
            height: 8,
            background: 'var(--bg-secondary)',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${storagePercent}%`,
              background: 'var(--primary)',
              borderRadius: 4,
              transition: 'width var(--transition-normal)',
            }}
          />
        </div>
      </div>

      {/* Data Export Center */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Download size={18} />
            </div>
            <span>Export Academic Data & Reports</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Instant download in JSON and CSV formats
          </span>
        </div>

        <div className="grid-2" style={{ gap: '1rem' }}>
          {/* Full JSON Backup */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.85rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Database size={16} style={{ color: 'var(--primary)' }} />
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>Full Application Backup</h4>
              </div>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Comprehensive JSON file containing tasks, timetable, exams, notes, attendance history, and preferences.
              </p>
            </div>
            <button
              type="button"
              onClick={onExportFullBackup}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.84rem',
                alignSelf: 'flex-start',
              }}
            >
              <Download size={15} /> Download Full Backup (JSON)
            </button>
          </div>

          {/* Attendance CSV Report */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.85rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <FileSpreadsheet size={16} style={{ color: 'var(--primary)' }} />
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>Attendance Ledger (CSV)</h4>
              </div>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Spreadsheet report of all courses with attended classes, total classes, and calculated percentages.
              </p>
            </div>
            <button
              type="button"
              onClick={exportAttendanceCSV}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.84rem',
                alignSelf: 'flex-start',
              }}
            >
              <Download size={15} /> Export Attendance (CSV)
            </button>
          </div>

          {/* Tasks & Assignments CSV */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.85rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <FileSpreadsheet size={16} style={{ color: 'var(--primary)' }} />
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>Tasks & Due Dates (CSV)</h4>
              </div>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Export your pending assignments, projects, and deadlines to open in Excel or Google Sheets.
              </p>
            </div>
            <button
              type="button"
              onClick={exportTasksCSV}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.84rem',
                alignSelf: 'flex-start',
              }}
            >
              <Download size={15} /> Export Tasks (CSV)
            </button>
          </div>

          {/* Notes JSON Export */}
          <div
            style={{
              padding: '1.15rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.85rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <FileText size={16} style={{ color: 'var(--primary)' }} />
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>Study Notes Archive (JSON)</h4>
              </div>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Export all study notes, markdown snippets, formula cheat sheets, and tags.
              </p>
            </div>
            <button
              type="button"
              onClick={exportNotesJSON}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.84rem',
                alignSelf: 'flex-start',
              }}
            >
              <Download size={15} /> Export Notes (JSON)
            </button>
          </div>
        </div>
      </div>

      {/* Restore & Import Backup */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <div className="card-title-icon">
              <Upload size={18} />
            </div>
            <span>Restore Backup Archive</span>
          </div>
        </div>

        {importNotice.text && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.86rem',
              fontWeight: 600,
              background: importNotice.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
              color: importNotice.type === 'success' ? 'var(--success)' : 'var(--danger)',
              border: `1px solid ${importNotice.type === 'success' ? 'var(--success-border)' : 'var(--danger-border)'}`,
            }}
          >
            {importNotice.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{importNotice.text}</span>
          </div>
        )}

        <div
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '2px dashed var(--border-subtle)',
            background: 'var(--bg-secondary)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <Upload size={32} style={{ color: 'var(--primary)' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
              Upload StudentHub JSON Backup
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Supports .json files exported from StudentHub
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.86rem',
              padding: '0.5rem 1.15rem',
            }}
          >
            <Upload size={15} /> Select Backup File
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataStorage;
