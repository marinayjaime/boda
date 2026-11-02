import {useEffect,useRef,useState,lazy,Suspense} from 'react';
import {Pause,Play,ArrowCounterClockwise,ArrowDown,ArrowsOutSimple} from '@phosphor-icons/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
const CarModel=lazy(()=>import('./CarModel.jsx'));
gsap.registerPlugin(ScrollTrigger);
export default function BusJourney({motion}){
 const root=useRef(null),film=useRef(null),car=useRef(null),position=useRef(0),manual=useRef(false),timer=useRef(null),scroll=useRef(null),visible=useRef(false);
 const [value,setValue]=useState(0),[playing,setPlaying]=useState(false),[zoom,setZoom]=useState(false),[seen,setSeen]=useState(false),[gpu,setGpu]=useState(false);
 const draw=p=>{position.current=p;const first=Math.min(p/.72,1),second=Math.max(0,(p-.72)/.28);const x=.68-.12*first-.065*second,y=.94-.225*first-.046*second,size=.25-.205*first-.032*second;if(car.current){car.current.style.left=`${x*100}%`;car.current.style.top=`${y*100}%`;car.current.style.width=`${size*100}%`;car.current.style.opacity=p>.98?Math.max(0,(1-p)*50):1;}setValue(Math.round(p*100));};
 useEffect(()=>{const io=new IntersectionObserver(([e])=>{visible.current=e.isIntersecting;if(e.isIntersecting)setSeen(true);},{rootMargin:'200px'});io.observe(root.current);return()=>io.disconnect();},[]);
 useEffect(()=>{draw(0);if(!motion){manual.current=true;draw(.2);return;}manual.current=false;const st=ScrollTrigger.create({trigger:root.current,start:()=>`top ${innerWidth<=560?74:88}px`,end:'bottom bottom',onUpdate:self=>{if(!manual.current)draw(self.progress);}});scroll.current=st;return()=>{st.kill();scroll.current=null;};},[motion]);
 useEffect(()=>{if(!playing||!motion)return;let last=performance.now();const tick=now=>{const dt=Math.min((now-last)/1000,.1);last=now;if(!document.hidden&&visible.current){draw(Math.min(1,position.current+dt/16));if(position.current>=1){setPlaying(false);return;}}timer.current=requestAnimationFrame(tick);};timer.current=requestAnimationFrame(tick);return()=>cancelAnimationFrame(timer.current);},[playing,motion]);
 const play=()=>{manual.current=true;if(position.current>=.99)draw(0);setPlaying(v=>!v);};
 return <div ref={root} className={`road-chapter ${motion?'':'road-static'}`} data-testid="journey-chapter"><div className="road-sticky">
  <div className={`road-view ${zoom?'is-close':''}`} onPointerMove={e=>{if(!motion||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();film.current?.style.setProperty('--look-x',`${((e.clientX-r.left)/r.width-.5)*-7}px`);film.current?.style.setProperty('--look-y',`${((e.clientY-r.top)/r.height-.5)*-5}px`);}}>
   <div ref={film} className="road-film"><img className="road-landscape" src="./scenes/forest-road-v2.webp" alt="Recreación fotorealista de una carretera entre árboles y montañas" loading="lazy"/><div ref={car} className={`road-car ${gpu?'has-model':''}`} data-testid="road-car"><img src="./scenes/car-photo-v2.webp" alt="Coche marfil avanzando hacia el bosque"/>{seen&&motion&&<Suspense fallback={null}><CarModel progress={position} onReady={setGpu}/></Suspense>}</div></div>
   <div className="road-heading"><p className="eyebrow">De la ciudad a la sierra</p><h3>El camino<br/>también <em>cuenta.</em></h3><span>Palma <span aria-hidden="true">→</span> Alaró</span></div>
   <div className="road-scroll-hint"><ArrowDown size={16}/><span>{value>96?'Nos vemos en Alaró.':'Avanza para recorrerlo'}</span></div><button className="road-zoom" aria-pressed={zoom} aria-label={zoom?'Alejar paisaje':'Acercar paisaje'} onClick={()=>setZoom(v=>!v)}><ArrowsOutSimple size={21}/></button>
  </div><div className="road-console"><button className="round-button" onClick={play} aria-label={playing?'Pausar recorrido':'Reproducir recorrido'} disabled={!motion}>{playing?<Pause size={18}/>:<Play size={18}/>}</button><span className="road-origin">PALMA</span><input aria-label="Posición del coche en el recorrido" type="range" min="0" max="100" value={value} onChange={e=>{manual.current=true;setPlaying(false);draw(Number(e.target.value)/100);}}/><span className="road-destination">ALARÓ</span><button className="icon-button" aria-label="Volver al recorrido con scroll" onClick={()=>{setPlaying(false);manual.current=false;ScrollTrigger.refresh();draw(scroll.current?.progress??.2);}}><ArrowCounterClockwise size={21}/></button></div>
 </div></div>;
}
