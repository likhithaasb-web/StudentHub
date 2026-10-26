import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import NoteCard from '../components/notes/NoteCard';
import NoteEditorModal from '../components/notes/NoteEditorModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import { FileText, Plus, Search, Pin } from 'lucide-react';

const Notes = () => {
  const { notes, addNote, updateNote, deleteNote, togglePinNote } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // Distinct subjects
  const uniqueSubjects = useMemo(() => {
    const subs = new Set(notes.map((n) => n.subject).filter(Boolean));
    return Array.from(subs);
  }, [notes]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tags && n.tags.some((tag) => tag.toLowerCase().includes(q)));
      const matchesSubject = subjectFilter === 'ALL' || n.subject === subjectFilter;
      return matchesSearch && matchesSubject;
    });
  }, [notes, searchTerm, subjectFilter]);

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const otherNotes = filteredNotes.filter((n) => !n.pinned);

  const handleSaveNote = (formData) => {
    if (editingNote) {
      updateNote(editingNote.id, formData);
    } else {
      addNote(formData);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Notes & Study Materials</h1>
          <p className="page-header-subtitle">
            Organize subject summaries, lecture formulas, and quick revision cheatsheets.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingNote(null);
            setIsEditorOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} /> New Note
        </button>
      </div>

      {/* Search and Filters */}
      <div
        className="card"
        style={{
          padding: '1rem',
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search notes by title, topic, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        <div style={{ minWidth: 160 }}>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="ALL">All Subjects</option>
            {uniqueSubjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={notes.length === 0 ? 'No notes created yet' : 'No matching notes'}
          description={
            notes.length === 0
              ? 'Capture important concepts, summaries, and exam formulas in one clean place.'
              : 'Try clearing your search query or choosing another subject filter.'
          }
          actionLabel={notes.length === 0 ? 'Write Your First Note' : undefined}
          onAction={
            notes.length === 0
              ? () => {
                  setEditingNote(null);
                  setIsEditorOpen(true);
                }
              : undefined
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.85rem',
                }}
              >
                <Pin size={16} style={{ color: 'var(--warning)', transform: 'rotate(45deg)' }} />
                <span>Pinned Notes ({pinnedNotes.length})</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onTogglePin={togglePinNote}
                    onEdit={(n) => {
                      setEditingNote(n);
                      setIsEditorOpen(true);
                    }}
                    onDelete={(n) => setNoteToDelete(n)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Notes Section */}
          {otherNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    marginBottom: '0.85rem',
                  }}
                >
                  All Notes ({otherNotes.length})
                </div>
              )}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {otherNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onTogglePin={togglePinNote}
                    onEdit={(n) => {
                      setEditingNote(n);
                      setIsEditorOpen(true);
                    }}
                    onDelete={(n) => setNoteToDelete(n)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Editor Modal */}
      <NoteEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        noteToEdit={editingNote}
        existingSubjects={uniqueSubjects}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(noteToDelete)}
        onClose={() => setNoteToDelete(null)}
        onConfirm={() => {
          if (noteToDelete) {
            deleteNote(noteToDelete.id);
            setNoteToDelete(null);
          }
        }}
        title="Delete Note"
        message={`Are you sure you want to delete "${noteToDelete?.title}"?`}
        confirmText="Delete Note"
      />
    </div>
  );
};

export default Notes;
