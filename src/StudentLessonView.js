import React, { useState } from 'react';
import { updateLessonProgress } from './api';

export default function StudentLessonView({ courseData = { title: "Curso de Autoestudio", modules: [] }, currentLesson = { title: "Lección 1", video_url: "", audio_url: "", visual_resource_url: "" } }) {
  const [activeTab, setActiveTab] = useState('video');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = async () => {
    try {
      await updateLessonProgress(currentLesson.id || 1, !isCompleted);
      setIsCompleted(!isCompleted);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-80 bg-gray-800 border-r border-gray-700 p-4">
        <h2 className="font-bold text-lg mb-4">{courseData.title}</h2>
        <p className="text-xs text-gray-400">Selecciona una lección para comenzar tu autoestudio.</p>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="p-6 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-bold">{currentLesson.title}</h1>
          <button onClick={handleComplete} className={`px-4 py-2 rounded-lg font-medium ${isCompleted ? 'bg-green-600' : 'bg-blue-600'}`}>
            {isCompleted ? 'Completado ✓' : 'Marcar como completada'}
          </button>
        </header>

        <div className="flex border-b border-gray-700 bg-gray-800/50 px-6">
          <button onClick={() => setActiveTab('video')} className={`py-3 px-4 font-medium border-b-2 ${activeTab === 'video' ? 'border-blue-500 text-blue-400' : 'text-gray-400'}`}>🎥 Video</button>
          <button onClick={() => setActiveTab('audio')} className={`py-3 px-4 font-medium border-b-2 ${activeTab === 'audio' ? 'border-blue-500 text-blue-400' : 'text-gray-400'}`}>🎧 Audio</button>
          <button onClick={() => setActiveTab('visual')} className={`py-3 px-4 font-medium border-b-2 ${activeTab === 'visual' ? 'border-blue-500 text-blue-400' : 'text-gray-400'}`}>📊 Recurso Visual</button>
        </div>

        <div className="p-6 flex-1 flex items-center justify-center">
          {activeTab === 'video' && <video controls className="w-full max-w-4xl aspect-video rounded-xl bg-black" src={currentLesson.video_url} />}
          {activeTab === 'audio' && <audio controls className="w-full max-w-xl" src={currentLesson.audio_url} />}
          {activeTab === 'visual' && <iframe src={currentLesson.visual_resource_url} className="w-full max-w-4xl h-[600px] rounded-xl bg-white" title="Visual" />}
        </div>
      </main>
    </div>
  );
}