/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  Code2,
  Flame,
  Save,
  Sparkles,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const { currentUser, updateStudentProfile } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [gradeLevel, setGradeLevel] = useState(currentUser.gradeLevel || 'Grade 5 · Explorer');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar);
  const [isSaved, setIsSaved] = useState(false);

  const availableAvatars = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=SarahAhmad',
    'https://api.dicebear.com/7.x/bottts/svg?seed=RoboCilik',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Sparky',
    'https://api.dicebear.com/7.x/bottts/svg?seed=PixelKid',
    'https://api.dicebear.com/7.x/bottts/svg?seed=LunaCoder',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherRazak',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      name: name.trim(),
      bio: bio.trim(),
      gradeLevel: gradeLevel.trim(),
      avatar: selectedAvatar,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          My Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your explorer avatar, nickname, and coding interests.
        </p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-lg flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-5">
        {/* Avatar Chooser */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">
            Choose Your Avatar
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {availableAvatars.map((avUrl, i) => (
              <img
                key={i}
                src={avUrl}
                alt="Avatar option"
                onClick={() => setSelectedAvatar(avUrl)}
                className={`w-12 h-12 rounded-full border-2 p-0.5 cursor-pointer transition-transform hover:scale-105 ${
                  selectedAvatar === avUrl ? 'border-sky-500 bg-sky-50 shadow-xs' : 'border-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Display Name / Nickname
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
            required
          />
        </div>

        {/* Grade / Learning Level */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Learning Level
          </label>
          <input
            type="text"
            value={gradeLevel}
            onChange={e => setGradeLevel(e.target.value)}
            className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Explorer Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="submit"
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
