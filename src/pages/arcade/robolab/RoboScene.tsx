import React,{useEffect,useRef} from 'react';
import type {Mission} from './levels';
import type {Frame,RobotState} from './engine';

/** Actual WebGL 3D renderer, deliberately dependency-free for the existing Vite project. */
const vshader=`attribute vec3 aPos;attribute vec3 aNormal;uniform mat4 uMVP;uniform mat4 uModel;varying vec3 vNormal;varying vec3 vWorld;void main(){vec4 p=uModel*vec4(aPos,1.0);vWorld=p.xyz;vNormal=mat3(uModel)*aNormal;gl_Position=uMVP*vec4(aPos,1.0);}`;
const fshader=`precision mediump float;varying vec3 vNormal;varying vec3 vWorld;uniform vec3 uColor;uniform vec3 uEye;uniform vec3 uFog;uniform float uEmission;void main(){vec3 n=normalize(vNormal);float lit=max(dot(n,normalize(vec3(-0.55,1.5,0.8))),0.0);float rim=pow(1.0-max(dot(n,normalize(uEye-vWorld)),0.0),2.0);vec3 col=uColor*(0.35+0.65*lit)+uColor*(uEmission*0.95)+vec3(0.09,0.19,0.23)*rim;float fog=clamp(length(uEye-vWorld)/46.0,0.0,0.52);gl_FragColor=vec4(mix(col,uFog,fog),1.0);}`;
const cube:number[]=[];
function face(a:number[],b:number[],c:number[],d:number[],n:number[]){for(const p of [a,c,b,a,d,c])cube.push(...p,...n);}
const P=(x:number,y:number,z:number)=>[x,y,z];
face(P(-.5,.5,-.5),P(.5,.5,-.5),P(.5,.5,.5),P(-.5,.5,.5),[0,1,0]);
face(P(-.5,-.5,.5),P(.5,-.5,.5),P(.5,-.5,-.5),P(-.5,-.5,-.5),[0,-1,0]);
face(P(-.5,-.5,.5),P(-.5,.5,.5),P(.5,.5,.5),P(.5,-.5,.5),[0,0,1]);
face(P(.5,-.5,-.5),P(.5,.5,-.5),P(-.5,.5,-.5),P(-.5,-.5,-.5),[0,0,-1]);
face(P(.5,-.5,.5),P(.5,.5,.5),P(.5,.5,-.5),P(.5,-.5,-.5),[1,0,0]);
face(P(-.5,-.5,-.5),P(-.5,.5,-.5),P(-.5,.5,.5),P(-.5,-.5,.5),[-1,0,0]);
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const rgba=(hex:string):[number,number,number]=>{const h=hex.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255) as [number,number,number];};
const shade=(color:[number,number,number],s:number):[number,number,number]=>color.map(c=>clamp(c*s,0,1)) as [number,number,number];
const add=(a:number[],b:number[])=>a.map((v,i)=>v+b[i]);const sub=(a:number[],b:number[])=>a.map((v,i)=>v-b[i]);const dot=(a:number[],b:number[])=>a.reduce((s,v,i)=>s+v*b[i],0);const cross=(a:number[],b:number[])=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];const normalize=(v:number[])=>{const len=Math.hypot(...v)||1;return v.map(a=>a/len);};
function multiply(a:number[],b:number[]){const out=new Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)out[c*4+r]+=a[k*4+r]*b[c*4+k];return out;}
function perspective(fov:number,aspect:number,near:number,far:number){const f=1/Math.tan(fov/2);return [f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0];}
function lookAt(eye:number[],target:number[]){const f=normalize(sub(target,eye)),side=normalize(cross(f,[0,1,0])),up=cross(side,f);return [side[0],up[0],-f[0],0,side[1],up[1],-f[1],0,side[2],up[2],-f[2],0,-dot(side,eye),-dot(up,eye),dot(f,eye),1];}
function model(x:number,y:number,z:number,sx:number,sy:number,sz:number,rotation=0){const c=Math.cos(rotation),s=Math.sin(rotation);return [sx*c,0,-sx*s,0,0,sy,0,0,sz*s,0,sz*c,0,x,y,z,1];}
type Box={x:number;y:number;z:number;sx:number;sy:number;sz:number;color:[number,number,number];glow?:number;rot?:number};
function compileShader(gl:WebGLRenderingContext,type:number,src:string){const sh=gl.createShader(type)!;gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh)||'Shader failed');return sh;}
function makeGL(gl:WebGLRenderingContext){const shader=gl.createProgram()!;const v=compileShader(gl,gl.VERTEX_SHADER,vshader),f=compileShader(gl,gl.FRAGMENT_SHADER,fshader);gl.attachShader(shader,v);gl.attachShader(shader,f);gl.linkProgram(shader);if(!gl.getProgramParameter(shader,gl.LINK_STATUS))throw Error('WebGL program cannot link');gl.useProgram(shader);gl.deleteShader(v);gl.deleteShader(f);
 const buffer=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(cube),gl.STATIC_DRAW);const ap=gl.getAttribLocation(shader,'aPos'),an=gl.getAttribLocation(shader,'aNormal');gl.vertexAttribPointer(ap,3,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(an,3,gl.FLOAT,false,24,12);gl.enableVertexAttribArray(an);
 const names=['uMVP','uModel','uColor','uEye','uFog','uEmission'];const uniforms=Object.fromEntries(names.map(n=>[n,gl.getUniformLocation(shader,n)]));return {shader,buffer,uniforms};
}
interface Props{level:Mission;frame:Frame;robotColor:string;quality:'low'|'high';sound:boolean;onAudio?:()=>void;}
export function RoboScene({level,frame,robotColor,quality}:Props){
 const canvasRef=useRef<HTMLCanvasElement|null>(null);const latest=useRef({level,frame,robotColor,quality});latest.current={level,frame,robotColor,quality};
 const orbit=useRef({yaw:.7,pitch:.79,zoom:21,drag:false,lastX:0,lastY:0});
 useEffect(()=>{const canvas=canvasRef.current;if(!canvas)return;let gl=canvas.getContext('webgl',{antialias:true,alpha:true,powerPreference:'high-performance'});if(!gl){canvas.dataset.unsupported='true';return;}
  let program:ReturnType<typeof makeGL>;try{program=makeGL(gl);}catch(err){canvas.dataset.unsupported='true';return;}
  let raf=0,last=0;const colorCache=new Map<string,[number,number,number]>();const color=(hex:string)=>{if(!colorCache.has(hex))colorCache.set(hex,rgba(hex));return colorCache.get(hex)!;};
  const renderBoxes:Box[]=[];
  let current= {...latest.current.frame.state};let visualX=current.x,visualZ=current.y,visualHeading=current.dir*Math.PI/2;
  let sceneLevel='';let terrain:Box[]=[];
  function makeTerrain(L:Mission){const result:Box[]=[];const accent=color(L.accent);const floor:Box={x:(L.map[0].length-1)/2,y:-.4,z:(L.map.length-1)/2,sx:L.map[0].length+.5,sy:.62,sz:L.map.length+.5,color:shade(accent,.17)};result.push(floor);
    for(let z=0;z<L.map.length;z++)for(let x=0;x<L.map[z].length;x++){
     const c=L.map[z][x];const wall=c==='#';const alt=(x*17+z*13)%7;
     if(wall){const height=(x===0||z===0||x===L.map[z].length-1||z===L.map.length-1)?1.3:.9;
      result.push({x,y:height/2-.02,z,sx:.94,sy:height,sz:.94,color:shade(accent,.16+alt*.019)});
      result.push({x,y:height+.02,z,sx:.94,sy:.065,sz:.94,color:shade(accent,.48),glow:.4});
      if((x+z)%3===0)result.push({x,y:height*.66,z,sx:.98,sy:.06,sz:.99,color:shade(accent,1.1),glow:1.1});
     }else{
      result.push({x,y:-.06,z,sx:.94,sy:.13,sz:.94,color:alt%3===0?[.17,.24,.32]:[.105,.16,.23]});
      result.push({x,y:.015,z,sx:.78,sy:.018,sz:.78,color:shade(accent,.07+(alt%3)*.014),glow:.15});
     }
     if(c==='~')result.push({x,y:.05,z,sx:.67,sy:.02,sz:.67,color:color('#ff5876'),glow:1.1});
     if('>^<v'.includes(c)&&c!=='.'){result.push({x,y:.045,z,sx:.78,sy:.065,sz:.78,color:color('#2c7280'),glow:.2});
       const horiz=c==='>'||c==='<';const sign=c==='>'||c==='v'?1:-1;
       result.push({x:x+(horiz?sign*.15:0),y:.087,z:z+(horiz?0:sign*.15),sx:horiz?.48:.12,sy:.05,sz:horiz?.12:.48,color:color('#4bffee'),glow:1.2});}

     if(c==='d'){result.push({x,y:.75,z,sx:.22,sy:1.55,sz:.87,color:color('#ef5971'),glow:.45});result.push({x,y:1.53,z,sx:.8,sy:.12,sz:.94,color:shade(accent,.86),glow:.7});}
     if(c==='T'){result.push({x,y:.16,z,sx:.65,sy:.3,sz:.65,color:color('#34536a')});result.push({x,y:.36,z,sx:.4,sy:.1,sz:.4,color:color('#ffc471'),glow:1.5});}
     if(c==='B'){result.push({x,y:.03,z,sx:.85,sy:.08,sz:.85,color:color('#ffd367'),glow:.7});result.push({x,y:.12,z,sx:.32,sy:.24,sz:.32,color:color('#805b42')});}
     if(c==='G'){result.push({x,y:.02,z,sx:.85,sy:.11,sz:.85,color:color('#1dddc7'),glow:1.2});result.push({x,y:.09,z,sx:.56,sy:.035,sz:.56,color:color('#f7ffff'),glow:1.8});}
     if(c==='+')result.push({x,y:.02,z,sx:.85,sy:.11,sz:.85,color:color('#ffc146'),glow:1.1});
    }
    // Architectural props around the playable arena give each world scale and depth.
    const w=L.map[0].length,h=L.map.length;const extra= L.world==='city'?16:L.world==='jungle'?21:12;
    for(let k=0;k<extra;k++){const edge=k%4,x=edge<2?-2-k%3:w+1+k%3,z=edge%2===0?(k*7)%h:((k*5)%h);
     const xx=edge>=2?(k*3)%w:x,zz=edge>=2?(edge===2?-2-k%3:h+1+k%3):z;
     const height=(L.world==='city'?2.2:L.world==='jungle'?1.5:1.2)+(k*3%7)*.48;
     result.push({x:xx,y:height/2-.25,z:zz,sx:L.world==='jungle'?.37:.9,sy:height,sz:L.world==='jungle'?.37:.9,color:shade(accent,.17+(k%4)*.055)});
     if(L.world==='jungle')result.push({x:xx,y:height+.1,z:zz,sx:1.5,sy:.65,sz:1.5,color:color('#2a905c')});
     else for(let j=1;j<height;j+=.67)result.push({x:xx,y:j,z:zz+.47,sx:.52,sy:.065,sz:.038,color:shade(accent,.93),glow:.8});
    }
    return result;
  }
  const draw=(box:Box,viewProj:number[],eye:number[],fog:[number,number,number])=>{
    if(!gl)return;const mat=model(box.x,box.y,box.z,box.sx,box.sy,box.sz,box.rot||0),u=program.uniforms;
    gl.uniformMatrix4fv(u.uModel,false,new Float32Array(mat));gl.uniformMatrix4fv(u.uMVP,false,new Float32Array(multiply(viewProj,mat)));
    gl.uniform3fv(u.uColor,box.color);gl.uniform3fv(u.uEye,new Float32Array(eye));gl.uniform3fv(u.uFog,fog);gl.uniform1f(u.uEmission,box.glow||0);gl.drawArrays(gl.TRIANGLES,0,36);
  };
  const loop=(now:number)=>{raf=requestAnimationFrame(loop);if(now-last<1000/(latest.current.quality==='low'?25:42))return;const dt=Math.min(.065,(now-last)/1000||.016);last=now;
    const {level:L,frame:F,robotColor:R}=latest.current;if(sceneLevel!==L.id){sceneLevel=L.id;terrain=makeTerrain(L);visualX=F.state.x;visualZ=F.state.y;visualHeading=F.state.dir*Math.PI/2;orbit.current.zoom=Math.max(15,Math.max(L.map[0].length,L.map.length)*1.52);}
    if(!gl||!canvas)return;
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,latest.current.quality==='low'?1:1.6);const cw=Math.max(1,Math.round(rect.width*dpr)),ch=Math.max(1,Math.round(rect.height*dpr));if(canvas.width!==cw||canvas.height!==ch){canvas.width=cw;canvas.height=ch;}gl.viewport(0,0,cw,ch);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);
    const s=F.state;visualX+=(s.x-visualX)*Math.min(1,dt*8);visualZ+=(s.y-visualZ)*Math.min(1,dt*8);
    const targetHeading=s.dir*Math.PI/2;let diff=(targetHeading-visualHeading+Math.PI*3)%(Math.PI*2)-Math.PI;visualHeading+=diff*Math.min(1,dt*9);
    const o=orbit.current, center=[(L.map[0].length-1)/2,.5,(L.map.length-1)/2];const eye=[center[0]+Math.sin(o.yaw)*Math.cos(o.pitch)*o.zoom,center[1]+Math.sin(o.pitch)*o.zoom,center[2]+Math.cos(o.yaw)*Math.cos(o.pitch)*o.zoom];const vp=multiply(perspective(Math.PI/3.9,cw/ch,.12,120),lookAt(eye,center));const fog=shade(color(L.accent),.08);
    gl.useProgram(program.shader);gl.bindBuffer(gl.ARRAY_BUFFER,program.buffer);
    for(const b of terrain){if(b.sx===.22&&b.color[0]>.8&&s.switchOn)continue;draw(b,vp,eye,fog);}
    for(const p of L.crystals){if(s.crystals.includes(`${p.x},${p.y}`))continue;const bob=Math.sin(now*.004+p.x)*.14;
      draw({x:p.x,y:.38+bob,z:p.y,sx:.33,sy:.48,sz:.33,color:color('#d49aff'),glow:1.1,rot:now*.0012},vp,eye,fog);
      draw({x:p.x,y:.09,z:p.y,sx:.53,sy:.03,sz:.53,color:color('#874eff'),glow:.8},vp,eye,fog);
    }
    if(L.item&&!s.picked){const p=L.item;draw({x:p.x,y:.3,z:p.y,sx:.52,sy:.51,sz:.52,color:color('#e8a45d')},vp,eye,fog);draw({x:p.x,y:.57,z:p.y,sx:.54,sy:.075,sz:.55,color:color('#ffdf96'),glow:.5},vp,eye,fog);}
    if(s.switchOn&&L.switch){draw({x:L.switch.x,y:.35,z:L.switch.y,sx:.4,sy:.12,sz:.4,color:color('#5cfdb6'),glow:1.4},vp,eye,fog);}
    // Robot model: articulated joints, LED face, chest light, wheels and twin antennae.
    const rx=visualX,rz=visualZ,bob=Math.sin(now*.004)*.024,primary=color(R),forward=(x:number,y:number,z:number)=>({x:rx+x*Math.cos(visualHeading)+z*Math.sin(visualHeading),y,z:rz-x*Math.sin(visualHeading)+z*Math.cos(visualHeading)});
    const part=(ox:number,y:number,oz:number,sx:number,sy:number,sz:number,c:[number,number,number],glow=0)=>{const p=forward(ox,y+bob,oz);draw({x:p.x,y:p.y,z:p.z,sx,sy,sz,color:c,glow,rot:visualHeading},vp,eye,fog);};
    part(0,.22,0,.65,.28,.8,color('#26394d'));part(-.34,.18,.0,.2,.32,.5,color('#142b3e'));part(.34,.18,.0,.2,.32,.5,color('#142b3e'));
    part(0,.67,0,.69,.7,.6,primary,.2);part(0,.69,.315,.42,.31,.055,color('#e0feff'),.55);
    part(0,1.22,0,.83,.58,.63,color('#f1f7ff'),.15);part(0,1.26,.326,.72,.42,.07,color('#173451'));
    part(-.18,1.29,.368,.15,.15,.045,color('#4ef7ef'),1.8);part(.18,1.29,.368,.15,.15,.045,color('#4ef7ef'),1.8);
    part(-.53,.78,0,.26,.59,.32,primary);part(.53,.78,0,.26,.59,.32,primary);
    part(-.54,.43,.04,.32,.18,.3,color('#e3f1fb'));part(.54,.43,.04,.32,.18,.3,color('#e3f1fb'));
    part(0,1.64,0,.09,.26,.09,color('#b7e6f6'));part(0,1.8,0,.16,.16,.16,color('#ffca72'),1.2);
    if(s.carrying){part(0,.53,.52,.43,.38,.4,color('#e9af5b'));part(0,.75,.52,.42,.06,.4,color('#ffe3a1'),.5);}
    if(s.failed)part(0,1.31,.37,.42,.08,.055,color('#ff5c6e'),1.5);
  };
  raf=requestAnimationFrame(loop);
  const down=(e:PointerEvent)=>{orbit.current.drag=true;orbit.current.lastX=e.clientX;orbit.current.lastY=e.clientY;canvas.setPointerCapture(e.pointerId);};
  const up=()=>{orbit.current.drag=false;};
  const drag=(e:PointerEvent)=>{if(!orbit.current.drag)return;const o=orbit.current;o.yaw+=(e.clientX-o.lastX)*.007;o.pitch=clamp(o.pitch+(e.clientY-o.lastY)*.005,.24,1.34);o.lastX=e.clientX;o.lastY=e.clientY;};
  const zoom=(e:WheelEvent)=>{e.preventDefault();orbit.current.zoom=clamp(orbit.current.zoom+e.deltaY*.016,8,33);};
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('pointermove',drag);canvas.addEventListener('wheel',zoom,{passive:false});
  return ()=>{cancelAnimationFrame(raf);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('pointermove',drag);canvas.removeEventListener('wheel',zoom);gl?.deleteBuffer(program.buffer);gl?.deleteProgram(program.shader);};
 },[]);
 return <div className="robolab-world-view"><div className="robolab-atmosphere" style={{background:`radial-gradient(ellipse at 48% 8%,${level.accent}29, transparent 52%), linear-gradient(155deg, ${level.world==='space'?'#070a29':'#091b2b'}, ${level.world==='jungle'?'#143d36':'#152342'} 65%, #050b18)`}}/><div className="robolab-stars" aria-hidden="true"/><canvas ref={canvasRef} className="robolab-canvas" aria-label={`Interactive 3D ${level.title} world. Drag to orbit, scroll to zoom.`}/><div className="robolab-render-fallback"><strong>3D graphics unavailable</strong><span>Enable WebGL in your browser and try again.</span></div><span className="robolab-view-label">● LIVE 3D WORLD <small>DRAG TO ORBIT · SCROLL TO ZOOM</small></span><span className="robolab-view-compass">N ↑</span></div>;
}
