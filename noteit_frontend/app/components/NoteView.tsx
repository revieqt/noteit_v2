"use client";

import React, { useState } from "react";
import { useNotes } from "@/context/NotesContext";
import type { NoteWithTodos } from "@/utils/api";
import NoteForm from "./NoteForm";
import { MdFavorite, MdFavoriteBorder, MdEdit, MdDelete, MdClose } from "react-icons/md";

interface NoteViewProps {
  note: NoteWithTodos;
  onClose?: () => void;
}

const NoteView: React.FC<NoteViewProps> = ({ note, onClose }) => {
  const { deleteNote, updateFavorite } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteNote(note.id);
      onClose?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete note";
      setError(errorMessage);
      setIsDeleting(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      await updateFavorite(note.id, !note.isFavorite);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update favorite";
      setError(errorMessage);
    }
  };

  if (isEditing) {
    return (
      <NoteForm
        noteId={note.id}
        onClose={() => {
          setIsEditing(false);
          onClose?.();
        }}
      />
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full z-100 bg-white/10 backdrop-blur-md flex justify-center p-6">
      <div className="p-6 h-auto max-h-[90vh] max-w-2xl w-full bg-white rounded-lg shadow-md flex flex-col overflow-y-auto">
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{note.title}</h1>
            <p className="text-xs text-slate-400 mt-2">
              Updated: {new Date(note.updatedAt).toLocaleDateString()} {new Date(note.updatedAt).toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition flex-shrink-0"
          >
            <MdClose className="w-7 h-7" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto mb-6">
          <div className="prose max-w-none">
            <p className="text-slate-700 whitespace-pre-wrap mb-6">{note.content}</p>

            {note.todos && note.todos.length > 0 && (
              <div className="mb-6">
                <div className="space-y-2">
                  {note.todos.map((todo) => (
                    <div key={todo.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        disabled
                        className="w-5 h-5 rounded border-slate-300 text-indigo-600"
                      />
                      <span
                        className={`flex-1 ${
                          todo.completed
                            ? "line-through text-slate-500"
                            : "text-slate-900"
                        }`}
                      >
                        {todo.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="p-3 rounded-full transition hover:bg-blue-600 hover:text-white"
          >
            <MdEdit className="w-7 h-7"/>
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-3 rounded-full transition hover:bg-red-600 hover:text-white"
          >
            <MdDelete className="w-7 h-7" />
          </button>

          <button
            onClick={handleFavoriteToggle}
            className={`p-3 rounded-full transition hover:bg-yellow-600 hover:text-white`}
          >
            {note.isFavorite ? <MdFavorite className="w-7 h-7 text-yellow-600"/> : <MdFavoriteBorder className="w-7 h-7" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteView;