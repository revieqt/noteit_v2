"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { useNotes } from "@/context/NotesContext";
import type { NoteWithTodos, Todo } from "@/utils/api";

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

interface NoteFormProps {
  children?: ReactNode;
  onClose?: () => void;
  noteId?: number;
}

const NoteForm: React.FC<NoteFormProps> = ({ children, onClose, noteId }) => {
  const { createNote, updateNote, currentNote } = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [todoCount, setTodoCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (noteId && currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      if (currentNote.todos) {
        setTodos(currentNote.todos.map((todo) => ({
          id: todo.id,
          title: todo.title,
          completed: todo.completed,
        })));
        const maxId = Math.max(...currentNote.todos.map((t) => t.id), 0);
        setTodoCount(maxId);
      }
    }
  }, [noteId, currentNote]);

  const handleAddTodo = () => {
    const newTodoCount = todoCount + 1;
    setTodoCount(newTodoCount);
    const newTodo: TodoItem = {
      id: newTodoCount,
      title: "",
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleTodoTitleChange = (id: number, newTitle: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle } : todo
      )
    );
  };

  const handleTodoCompletedChange = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!title.trim() || !content.trim()) {
        setError("Title and content are required");
        setIsLoading(false);
        return;
      }

      if (noteId && currentNote) {
        await updateNote(noteId, title, content, currentNote.isFavorite, todos as Todo[]);
      } else {
        // Create new note
        await createNote(title, content, todos as Todo[]);
      }

      // Close form
      onClose?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save note";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-100 bg-white/10 backdrop-blur-md flex justify-center p-6">
      <div className="p-5 h-auto min-h-[95vh] max-w-2xl w-full bg-white rounded-lg shadow-md flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {noteId ? "Edit Note" : "Create New Note"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
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

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <input
              type="text"
              id="title"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 mb-5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
            <textarea
              id="content"
              placeholder="Enter note content..."
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 mb-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
              required
            />

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Todo Items</h3>
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div key={todo.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleTodoCompletedChange(todo.id)}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Enter todo item..."
                      value={todo.title}
                      onChange={(e) => handleTodoTitleChange(todo.id, e.target.value)}
                      className="flex-1 px-4 py-2 rounded border border-slate-300 bg-white text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-3 mt-auto border-t">
            <button
              type="button"
              onClick={handleAddTodo}
              className="px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-700 font-medium transition hover:bg-gray-50"
            >
              + Add Todo Item
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-lg bg-teal-500 text-white font-medium transition hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : noteId ? "Update Note" : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;