import React, { useState, useEffect } from 'react';
import { getAdminMetrics } from './api';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({ total_courses: 0, total_users: 0, total_completed_lessons: 0 });
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    getAdminMetrics().then(setMetrics).catch(console.error);
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonContent = JSON.parse(e.target.result);
        if (jsonContent.duration_hours > 12) {
          setUploadStatus({ success: false, message: "Error: El curso excede el límite de 12 horas." });
          return;
        }

        const res = await fetch("http://localhost:8000/admin/courses/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          },
          body: JSON.stringify(jsonContent)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.detail);

        setUploadStatus({ success: true, message: `¡Curso cargado con éxito!` });
      } catch (err) {
        setUploadStatus({ success: false, message: `Error al subir: ${err.message}` });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <span className="text-sm text-gray-400">Cursos</span>
          <h3 className="text-3xl font-bold text-blue-400">{metrics.total_courses}</h3>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <span className="text-sm text-gray-400">Usuarios</span>
          <h3 className="text-3xl font-bold text-green-400">{metrics.total_users}</h3>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <span className="text-sm text-gray-400">Lecciones Completadas</span>
          <h3 className="text-3xl font-bold text-purple-400">{metrics.total_completed_lessons}</h3>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center space-y-4">
        <h3 className="text-lg font-bold">Carga Masiva de Curso (JSON)</h3>
        <input type="file" accept=".json" onChange={handleFileUpload} className="block mx-auto text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
        {uploadStatus && <p className={`text-sm ${uploadStatus.success ? 'text-green-400' : 'text-red-400'}`}>{uploadStatus.message}</p>}
      </div>
    </div>
  );
}