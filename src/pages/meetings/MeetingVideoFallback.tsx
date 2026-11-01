import React from 'react';
import {CameraOff} from 'lucide-react';

/** Visual placeholder ONLY. Never represents another person's live camera feed. */
export function MeetingVideoFallback({otherRole,practice=false}:{otherRole:'teacher'|'student';practice?:boolean}){
 const title=otherRole==='teacher'?'Teacher preview':'Student preview';
 return <div className="meeting-photo-fallback" role="img" aria-label={`${title} portrait; not live video`}>
  <img src={otherRole==='teacher'?'/visuals/teacher-call-preview.webp':'/visuals/student-call-preview.webp'} alt="" aria-hidden="true"/>
  <div className="meeting-photo-caption"><CameraOff size={15}/><strong>{title} · {practice?'Solo practice':'Waiting for video'}</strong></div>
 </div>;
}
