"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import * as api from "@/utils/api";
import type { Note, NoteWithTodos, Todo } from "@/utils/api";

interface NotesContextType {
  notes: Note[];
  currentNote: NoteWithTodos | null;
  loading: boolean;
  error: string | null;
  getAllNotes: () => Promise<void>;
  viewNote: (noteId: number) => Promise<void>;
  createNote: (title: string, content: string) => Promise<Note>;
  updateNote: (noteId: number, title: string, content: string, isFavorite: boolean) => Promise<Note>;
  deleteNote: (noteId: number) => Promise<void>;
  updateFavorite: (noteId: number, isFavorite: boolean) => Promise<Note>;
  clearCurrentNote: () => void;
  setError: (error: string | null) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<NoteWithTodos | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedNotes = await api.getAllNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch notes";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const viewNote = useCallback(async (noteId: number) => {
    setLoading(true);
    setError(null);
    try {
      const note = await api.viewNote(noteId);
      setCurrentNote(note);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch note";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(
    async (title: string, content: string): Promise<Note> => {
      setLoading(true);
      setError(null);
      try {
        const newNote = await api.createNote(title, content);
        setNotes((prevNotes) => [...prevNotes, newNote]);
        return newNote;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create note";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateNote = useCallback(
    async (noteId: number, title: string, content: string, isFavorite: boolean): Promise<Note> => {
      setLoading(true);
      setError(null);
      try {
        const updatedNote = await api.updateNote(noteId, title, content, isFavorite);
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === noteId ? updatedNote : note))
        );
        if (currentNote?.id === noteId) {
          setCurrentNote({ ...currentNote, ...updatedNote });
        }
        return updatedNote;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update note";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentNote]
  );

  const deleteNote = useCallback(async (noteId: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.deleteNote(noteId);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      if (currentNote?.id === noteId) {
        setCurrentNote(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete note";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentNote]);

  const updateFavorite = useCallback(
    async (noteId: number, isFavorite: boolean): Promise<Note> => {
      setError(null);
      try {
        const updatedNote = await api.updateFavorite(noteId, isFavorite);
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === noteId ? updatedNote : note))
        );
        if (currentNote?.id === noteId) {
          setCurrentNote({ ...currentNote, isFavorite });
        }
        return updatedNote;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update favorite";
        setError(errorMessage);
        throw err;
      }
    },
    [currentNote]
  );

  const clearCurrentNote = useCallback(() => {
    setCurrentNote(null);
  }, []);

  const value: NotesContextType = {
    notes,
    currentNote,
    loading,
    error,
    getAllNotes,
    viewNote,
    createNote,
    updateNote,
    deleteNote,
    updateFavorite,
    clearCurrentNote,
    setError,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}
