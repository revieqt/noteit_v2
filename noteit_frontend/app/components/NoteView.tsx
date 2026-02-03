"use client";

import React, { useState } from "react";
import { useNotes } from "@/context/NotesContext";
import type { NoteWithTodos } from "@/utils/api";
import NoteForm from "./NoteForm";

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
        {/* Header */}
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-900">{note.title}</h1>
              {note.isFavorite && (
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Updated: {new Date(note.updatedAt).toLocaleDateString()} {new Date(note.updatedAt).toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition flex-shrink-0"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto mb-6">
          <div className="prose max-w-none">
            <p className="text-slate-700 whitespace-pre-wrap mb-6">{note.content}</p>

            {/* Todos */}
            {note.todos && note.todos.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Todo Items</h2>
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

        {/* Action Buttons */}
        <div className="flex gap-2 pt-6 border-t">
          <button
            onClick={handleFavoriteToggle}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border font-medium transition ${
              note.isFavorite
                ? "bg-yellow-100 border-yellow-500 text-yellow-700 hover:bg-yellow-200"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
            {note.isFavorite ? "Unfavorite" : "Favorite"}
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 px-4 py-3 rounded-lg bg-blue-500 text-white font-medium transition hover:bg-blue-600"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 rounded-lg bg-red-500 text-white font-medium transition hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteView;