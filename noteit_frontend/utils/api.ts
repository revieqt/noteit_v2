// API helper for Django REST API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Get or create unique device identifier
function getDeviceId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    // Generate a unique device ID using UUID v4
    deviceId = "device_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}

export interface Note {
  id: number;
  deviceId: string;
  updatedAt: string;
  title: string;
  content: string;
  isFavorite: boolean;
}

export interface Todo {
  id: number;
  noteId: number;
  title: string;
  completed: boolean;
}

export interface NoteWithTodos extends Note {
  todos?: Todo[];
}

// 1. Get all notes for the device
export async function getAllNotes(): Promise<Note[]> {
  try {
    const deviceId = getDeviceId();
    const response = await fetch(`${API_BASE_URL}/notes/?deviceId=${deviceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notes: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
}

// 2. Get note details including todos
export async function viewNote(noteId: number): Promise<NoteWithTodos> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching note:", error);
    throw error;
  }
}

// 3. Create a new note
export async function createNote(
  title: string,
  content: string,
  isFavorite: boolean = false
): Promise<Note> {
  try {
    const deviceId = getDeviceId();
    const response = await fetch(`${API_BASE_URL}/notes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deviceId,
        title,
        content,
        isFavorite,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
}

// 4. Update a note
export async function updateNote(
  noteId: number,
  title: string,
  content: string,
  isFavorite: boolean
): Promise<Note> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        isFavorite,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
}

// 5. Delete a note
export async function deleteNote(noteId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete note: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
}

// 6. Update favorite status
export async function updateFavorite(noteId: number, isFavorite: boolean): Promise<Note> {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isFavorite,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update favorite: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating favorite:", error);
    throw error;
  }
}

export { getDeviceId };
