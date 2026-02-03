"use client";
import { useEffect, useState } from "react";
import GlassmorphicButton from "./components/GlassmorphicButton";
import { useNotes } from "@/context/NotesContext";
import NoteForm from "./components/NoteForm";
import NoteView from "./components/NoteView";
import type { Note } from "@/utils/api";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

export default function Home() {
  const { notes, getAllNotes, loading, viewNote, currentNote } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showNoteView, setShowNoteView] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | undefined>();

  useEffect(() => {
    getAllNotes();
  }, [getAllNotes]);

  const handleReadMore = async (noteId: number) => {
    await viewNote(noteId);
    setShowNoteView(true);
  };

  const handleEdit = async (noteId: number) => {
    await viewNote(noteId);
    setEditingNoteId(noteId);
    setShowNoteForm(true);
  };

  const handleCreateNew = () => {
    setEditingNoteId(undefined);
    setShowNoteForm(true);
  };

  const handleCloseForm = () => {
    setShowNoteForm(false);
    setEditingNoteId(undefined);
    getAllNotes();
  };

  const handleCloseView = () => {
    setShowNoteView(false);
    getAllNotes();
  };

  const filteredNotes = [...notes]
    .filter((note) => {
      if (showFavoritesOnly && !note.isFavorite) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) {
        return b.isFavorite ? 1 : -1;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const sortedNotes = filteredNotes;

  return (
    <div className='bg-zinc-100 min-h-screen'>
      <header id="headerPattern" className="sticky top-0 z-10">
        <div className="mx-auto pt-20 pb-20 max-w-6xl px-6 flex flex-col items-center justify-center h-full">
          <a href="/" className="text-4xl font-bold text-white">NoteIt</a>
          <p className="text-l text-slate-100">Your Personal Note Taking App</p>
          <div className="mt-2 flex space-x-2">
            <GlassmorphicButton onClick={handleCreateNew}>
              Create New Note
            </GlassmorphicButton>
          </div>
        </div>
      </header>

      {showNoteForm && <NoteForm noteId={editingNoteId} onClose={handleCloseForm} />}
      {showNoteView && currentNote && <NoteView note={currentNote} onClose={handleCloseView} />}

      <main className="mx-auto w-full">
        <div className="max-w-4xl mx-auto pb-20">
          <div className="bg-white rounded-lg shadow-lg p-5 mt-[-50px] z-20 relative">
            <div className="w-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 relative">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes..." 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border font-medium transition whitespace-nowrap ${
                    showFavoritesOnly
                      ? "bg-yellow-100 border-yellow-500 text-yellow-700 hover:bg-yellow-200"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-indigo-500 hover:text-indigo-600"
                  }`}
                >
                  {showFavoritesOnly ? <MdFavorite className="w-5 h-5" /> : <MdFavoriteBorder className="w-5 h-5" />}
                  Favorites
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-slate-600">Loading notes...</p>
                </div>
              ) : sortedNotes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600">No notes yet. Create one to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedNotes.map((note) => (
                    <button key={note.id} className="p-3 rounded-lg border w-full border-slate-200 hover:bg-slate-100 transition"
                      type="button"
                      onClick={() => handleReadMore(note.id)}>
                      <div className="flex items-start justify-between gap-4 text-left">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg font-semibold text-slate-900">{note.title}</h2>
                            {note.isFavorite && (
                              <MdFavorite className="w-5 h-5 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-slate-600 mt-1 text-sm line-clamp-2 mb-2">
                            {note.content}
                          </p>
                          <p className="text-xs text-slate-400">
                            Updated: {new Date(note.updatedAt).toLocaleDateString()} {new Date(note.updatedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
