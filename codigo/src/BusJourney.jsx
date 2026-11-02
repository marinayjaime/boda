import {useEffect,useRef,useState} from 'react';
import {Play,Pause,ArrowCounterClockwise} from '@phosphor-icons/react';

// Vídeo del trayecto real Palma → Alaró → Palma (codigo/video-trayecto, hecho con onetake).
// Horizontal en pantallas anchas, vertical en móvil. Sin sonido: empieza solo al verse, una vez.
const SOURCES={
 wide:{src:'./video/trayecto.mp4',poster:'./video/trayecto.jpg',w:1280,h:720},
 tall:{src:'./video/trayecto-vertical.mp4',poster:'./video/trayecto-vertical.jpg',w:720,h:1280},
};

export default function BusJourney({motion}){
 const box=useRef(null),vid=useRef(null),started=useRef(false);
 const [tall]=useState(()=>window.matchMedia('(max-aspect-ratio: 4/5)').matches);
 const [state,setState]=useState('idle');            // idle · playing · paused · ended
 const v=tall?SOURCES.tall:SOURCES.wide;

 useEffect(()=>{
  const el=vid.current;
  const io=new IntersectionObserver(([e])=>{
   if(e.intersectionRatio>=.55){
    if(motion&&!started.current){started.current=true;el.play().catch(()=>setState('idle'));}
    else if(motion&&state==='paused-away'){el.play().catch(()=>{});}
   }else if(e.intersectionRatio<.2&&!el.paused){el.pause();setState('paused-away');}
  },{threshold:[0,.2,.55,.8]});
  io.observe(box.current);return()=>io.disconnect();
 },[motion,state]);

 useEffect(()=>{if(!motion&&vid.current&&!vid.current.paused)vid.current.pause();},[motion]);

 const toggle=()=>{
  const el=vid.current;started.current=true;
  if(state==='ended'){el.currentTime=0;el.play();}
  else if(el.paused)el.play();else el.pause();
 };
 const label=state==='ended'?'Volver a ver el trayecto':state==='playing'?'Pausar el vídeo del trayecto':'Reproducir el vídeo del trayecto';

 return <div ref={box} className={`route-video ${tall?'is-tall':''}`}>
  <video ref={vid} muted playsInline preload="metadata" poster={v.poster} width={v.w} height={v.h}
   aria-label="Vídeo del trayecto en autobús sobre fotografía aérea real: de la iglesia de Santa Teresa en Palma a la Finca S'Olivaret en Alaró, llegada a las 18:00, y vuelta de noche a Palma a las 03:00."
   onPlay={()=>setState('playing')} onPause={e=>{if(!e.currentTarget.ended)setState(s=>s==='paused-away'?s:'paused');}} onEnded={()=>setState('ended')}>
   <source src={v.src} type="video/mp4"/>
  </video>
  <button type="button" className="route-video-button" onClick={toggle} aria-label={label}>
   {state==='ended'?<><ArrowCounterClockwise size={18}/><span>Volver a ver</span></>:state==='playing'?<Pause size={18} weight="fill"/>:<Play size={18} weight="fill"/>}
  </button>
 </div>;
}
