import React, { useState, useMemo } from 'react';
import { formatAttendanceDate } from '../../utils/attendanceUtils';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  ArrowUpDown,
  RefreshCw,
  FileText,
  Calendar,
  Check,
  X,
} from 'lucide-react';

const AttendanceHistoryTable = ({
  records = [],
  subjects = [],
  onToggleStatus,
  onEditRecord,
  onDeleteRecord,
}) => {
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' (newest first) or 'asc'

  // Filtered & sorted records
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        if (selectedSubject !== 'ALL' && rec.subject !== selectedSubject) {
          return false;
        }
        if (selectedStatus !== 'ALL' && rec.status !== selectedStatus) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNotes = (rec.notes || '').toLowerCase().includes(q);
          const matchSubject = (rec.subject || '').toLowerCase().includes(q);
          const matchDate = (rec.date || '').includes(q);
          if (!matchNotes && !matchSubject && !matchDate) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [records, selectedSubject, selectedStatus, searchQuery, sortOrder]);

  // Aggregate stats for filtered view
  const filteredAttended = filteredRecords.filter((r) => r.status === 'Present').length;
  const filteredAbsent = filteredRecords.filter((r) => r.status === 'Absent').length;
  const filteredTotal = filteredRecords.length;
  const filteredPct = filteredTotal > 0 ? Math.round((filteredAttended / filteredTotal) * 100) : 0;

  // Find color for a subject
  const getSubjectColor = (subjectName) => {
    const s = subjects.find((sub) => sub.name === subjectName);
    return s ? s.color : 'var(--primary)';
  };

  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Search and Filters Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 360 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search notes, topics, or dates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
          />
        </div>

        {/* Filters & Sorter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Subject Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.825rem', width: 'auto' }}
            >
              <option value="ALL">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id || s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.825rem', width: 'auto' }}
            >
              <option value="ALL">All Status</option>
              <option value="Present">Present Only</option>
              <option value="Absent">Absent Only</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className="btn btn-secondary btn-sm"
            title={`Sort by date: currently ${sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}`}
            style={{ fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowUpDown size={14} />
            {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </button>
        </div>
      </div>

      {/* Filter Summary Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          padding: '0.6rem 0.85rem',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          Showing <strong>{filteredTotal}</strong> class {filteredTotal === 1 ? 'record' : 'records'}
          {selectedSubject !== 'ALL' && ` for ${selectedSubject}`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>
            <strong style={{ color: 'var(--success)' }}>{filteredAttended}</strong> Attended
          </span>
          <span>
            <strong style={{ color: 'var(--danger)' }}>{filteredAbsent}</strong> Absent
          </span>
          <span>
            Rate: <strong style={{ color: 'var(--text-primary)' }}>{filteredPct}%</strong>
          </span>
        </div>
      </div>

      {/* History Records List */}
      {filteredRecords.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: 'var(--text-muted)',
          }}
        >
          <Calendar size={36} style={{ color: 'var(--text-muted)', opacity: 0.6, marginBottom: '0.75rem' }} />
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>No Attendance Records Found</h4>
          <p style={{ fontSize: '0.85rem', margin: 0, maxWidth: 360, marginInline: 'auto' }}>
            No classes match your current search or filter criteria. Try clearing your filters or recording a new class.
          </p>
          {(selectedSubject !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedSubject('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '1rem' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {filteredRecords.map((rec) => {
            const isPresent = rec.status === 'Present';
            const subjectColor = getSubjectColor(rec.subject);

            return (
              <div
                key={rec.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                {/* Left: Date, Subject Badge, Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                  {/* Subject Tag */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: `1px solid ${subjectColor}40`,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      minWidth: 70,
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: subjectColor,
                      }}
                    />
                    {rec.subject}
                  </div>

                  {/* Date */}
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', minWidth: 140 }}>
                    {formatAttendanceDate(rec.date)}
                  </div>

                  {/* Status Pill */}
                  <span
                    className={`badge ${isPresent ? 'badge-success' : 'badge-danger'}`}
                    style={{
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.65rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    {isPresent ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {rec.status}
                  </span>

                  {/* Notes / Topic */}
                  {rec.notes ? (
                    <div
                      style={{
                        fontSize: '0.825rem',
                        color: 'var(--text-secondary)',
                        fontStyle: 'italic',
                        maxWidth: 320,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={rec.notes}
                    >
                      "{rec.notes}"
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No notes</span>
                  )}
                </div>

                {/* Right: Actions for Mistake Correction */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* 1-Click Flip Status Button */}
                  <button
                    onClick={() => onToggleStatus(rec.id)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.3rem 0.65rem',
                      color: isPresent ? 'var(--danger)' : 'var(--success)',
                      borderColor: isPresent ? 'var(--danger-border)' : 'var(--success-border)',
                      gap: '0.3rem',
                    }}
                    title={`Mistake in record? Click to mark as ${isPresent ? 'Absent' : 'Present'}`}
                  >
                    <RefreshCw size={12} />
                    {isPresent ? 'Mark Absent' : 'Mark Present'}
                  </button>

                  {/* Edit Record */}
                  <button
                    onClick={() => onEditRecord(rec)}
                    className="btn-icon"
                    style={{ width: 30, height: 30, color: 'var(--text-secondary)' }}
                    title="Edit record details"
                  >
                    <Edit2 size={13} />
                  </button>

                  {/* Delete Record */}
                  <button
                    onClick={() => onDeleteRecord(rec)}
                    className="btn-icon"
                    style={{ width: 30, height: 30, color: 'var(--danger)' }}
                    title="Delete attendance record"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendanceHistoryTable;
