import {useCallback,useEffect,useRef,useState} from 'react';
import type {RefObject} from 'react';
/** User-initiated tab/window/screen presentation using the room's existing WebRTC peer.
 * Replaces the outgoing video track, retaining microphone and signaling state. */
export function useClassroomScreenShare(peer:RefObject<RTCPeerConnection|null>,camera:RefObject<MediaStream|null>,preview:RefObject<HTMLVideoElement|null>,status:(message:string)=>void){
 const capture=useRef<MediaStream|null>(null);
 const [presenting,setPresenting]=useState(false);
 const stop=useCallback(async()=>{
  const active=capture.current;if(!active)return;
  capture.current=null;
  for(const track of active.getTracks()){track.onended=null;track.stop()}
  const sender=peer.current?.getSenders().find(s=>s.track?.kind==='video')||peer.current?.getTransceivers().find(t=>t.receiver.track.kind==='video')?.sender;
  try {await sender?.replaceTrack(camera.current?.getVideoTracks()[0]||null)}catch{status('Screen sharing stopped, but the camera could not be restored. Rejoin the room if necessary.')}
  if(preview.current)preview.current.srcObject=camera.current;
  setPresenting(false);status('Screen sharing stopped.');
 },[peer,camera,preview,status]);
 const start=useCallback(async()=>{
  if(capture.current){await stop();return}
  if(!navigator.mediaDevices?.getDisplayMedia){status('Screen sharing is not supported. Use a desktop browser on HTTPS or localhost.');return}
  const connection=peer.current;
  if(!connection||connection.signalingState==='closed'){status('Join the live video room before presenting your screen.');return}
  try {
   // Browser-owned picker: the user must explicitly select a tab, window or screen.
   const display=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:15},audio:false});
   const track=display.getVideoTracks()[0];
   const sender=connection.getSenders().find(s=>s.track?.kind==='video')||connection.getTransceivers().find(t=>t.receiver.track.kind==='video')?.sender;
   if(!sender||!track){display.getTracks().forEach(t=>t.stop());status('This room cannot send video. Rejoin and try again.');return}
   try{await sender.replaceTrack(track)}catch(e){display.getTracks().forEach(t=>t.stop());throw e}
   capture.current=display;
   track.onended=()=>{void stop()};
   if(preview.current)preview.current.srcObject=display;
   setPresenting(true);status('You are presenting your screen. Stop sharing when finished.');
  }catch(e){if((e as Error).name!=='NotAllowedError')status(`Screen sharing could not start: ${(e as Error).message}`);else status('Screen sharing was cancelled or denied.');}
 },[peer,camera,preview,status,stop]);
 useEffect(()=>()=>{capture.current?.getTracks().forEach(t=>{t.onended=null;t.stop()});capture.current=null},[]);
 return {presenting,startScreenShare:start,stopScreenShare:stop};
}
