import React, { useState } from 'react';
import { FolderOpen, Film, Plus, Trash2, Copy, Play, Edit3, Clock, Globe, Search } from 'lucide-react';
import { Project } from '../../types/index.ts';
import { getLanguageByCode } from '../../data/languageRegistry.ts';
import { calculateTotalDuration } from '../../utils/subtitleGenerator.ts';

interface ProjectLibraryProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
}

export const ProjectLibrary: React.FC<ProjectLibraryProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onNewProject,
  onDeleteProject,
  onDuplicateProject
}) => {
  const [search, setSearch] = useState('');

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.config.targetLanguage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FolderOpen className="h-6 w-6 text-purple-400" />
            <span>My Guidance Video Projects</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{projects.length} Saved Projects</span>
            <span aria-hidden="true">·</span>
            <span>Multilingual Storyboards & Video Renders</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects or languages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            onClick={onNewProject}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>New Video Guide</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-400 mb-4 border border-white/10">
            <Film className="h-8 w-8" />
          </div>
          <h3 className="text-base font-semibold text-white">No projects found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Upload your first document or launch one of our ready-to-test templates in Telugu, Hindi, or Tamil.
          </p>
          <button
            onClick={onNewProject}
            className="mt-6 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold shadow-md hover:bg-purple-500 transition-colors"
          >
            Create My First Guide
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => {
            const lang = getLanguageByCode(proj.config.targetLanguage);
            const duration = calculateTotalDuration(proj.scenes);
            const isActive = proj.id === activeProjectId;

            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className={`flex flex-col justify-between p-6 rounded-2xl bg-[#111827] border cursor-pointer transition-all group ${
                  isActive
                    ? 'border-purple-500 ring-1 ring-purple-500/40 bg-[#172033]'
                    : 'border-white/10 hover:border-white/20 hover:bg-[#151e31]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-semibold text-purple-400 bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-500/20">
                      {lang?.name} ({lang?.nativeName})
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="tabular-nums">{Math.round(duration)}s</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                    {proj.originalDocument.rawText.slice(0, 120)}...
                  </p>

                  <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                    <span>{proj.scenes.length} Scenes</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{proj.config.guidanceStyle.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectProject(proj.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-medium transition-colors"
                  >
                    <Play className="h-3 w-3" />
                    <span>Open in Studio</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicateProject(proj.id)}
                      title="Duplicate project"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      title="Delete project"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
