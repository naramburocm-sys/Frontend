const API_URL = "http://localhost:8000"; // Cambiar por tu URL en producción

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

export async function loginUser(loginIdentifier, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login_identifier: loginIdentifier, password }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al iniciar sesión");
  }
  
  const data = await response.json();
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("user_role", data.user.role);
  localStorage.setItem("username", data.user.username);
  return data;
}

export async function updateLessonProgress(lessonId, isCompleted) {
  const response = await fetch(`${API_URL}/progress/update`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ lesson_id: lessonId, is_completed: isCompleted }),
  });
  if (!response.ok) throw new Error("Error al actualizar el progreso");
  return await response.json();
}

export async function getAdminMetrics() {
  const response = await fetch(`${API_URL}/admin/metrics`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("No autorizado");
  return await response.json();
}