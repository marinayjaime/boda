import {useState,useRef,useEffect} from 'react';
import {ArrowLeft,ArrowRight,X,ArrowsOutSimple,HandSwipeLeft} from '@phosphor-icons/react';

export default function PhotoReel({photos,motion}){
 const [active,setActive]=useState(0),[opened,setOpened]=useState(false),[dragging,setDragging]=useState(false);
 const track=useRef(null),dialog=useRef(null),start=useRef(null),restore=useRef(null);
 const go=i=>{const next=(i+photos.length)%photos.length;track.current.children[next]?.scrollIntoView({behavior:motion?'smooth':'instant',block:'nearest',inline:'center'});setActive(next);};
 useEffect(()=>{const el=track.current;let frame;const onScroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const center=el.scrollLeft+el.clientWidth/2;let nearest=0,delta=Infinity;[...el.children].forEach((item,i)=>{const d=Math.abs(item.offsetLeft+item.offsetWidth/2-center);if(d<delta){delta=d;nearest=i;}});setActive(nearest);});};el.addEventListener('scroll',onScroll,{passive:true});return()=>{cancelAnimationFrame(frame);el.removeEventListener('scroll',onScroll);};},[]);
 useEffect(()=>{opened?dialog.current.showModal():dialog.current.close();},[opened]);
 const open=(i,target)=>{if(start.current?.moved){start.current=null;return;}restore.current=target;setActive(i);setOpened(true);};
 const close=()=>{setOpened(false);restore.current?.focus();};
 const change=n=>setActive(i=>(i+n+photos.length)%photos.length);
 return <section className="photo-chapter" id="la-boda" aria-labelledby="story-title">
  <div className="photo-heading"><p className="eyebrow">Nosotros · 14 recuerdos</p><h2 id="story-title">Lo que nos<br/>ha traído <em>hasta aquí.</em></h2><div><HandSwipeLeft size={26} weight="thin"/><span>Arrastra los recuerdos.<br/>Abre el que quieras.</span></div></div>
  <div ref={track} className={`photo-reel ${dragging?'is-dragging':''}`} tabIndex={0} role="region" aria-label="Galería de fotografías, arrastra o usa las flechas" onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();go(active+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(active-1);}}}
   onPointerDown={e=>{if(e.pointerType==='mouse'){start.current={x:e.clientX,scroll:track.current.scrollLeft,moved:false};setDragging(true);}}}
   onPointerMove={e=>{if(!start.current||!dragging)return;const dx=e.clientX-start.current.x;if(Math.abs(dx)>6)start.current.moved=true;track.current.scrollLeft=start.current.scroll-dx;}}
   onPointerUp={()=>setDragging(false)} onPointerLeave={()=>{setDragging(false);start.current=null;}}>
   {photos.map((photo,i)=><button key={photo.src} className={`reel-photo ${active===i?'is-active':''}`} aria-label={`Abrir recuerdo ${i+1}`} aria-pressed={active===i} onClick={e=>open(i,e.currentTarget)} style={{'--angle':`${[0,-4,3,-2,4,-3][i%6]}deg`}}>
    <img src={'./'+photo.src} alt={photo.caption==='Texto pendiente.'?`Marina y Jaime, recuerdo ${i+1}`:photo.caption} loading="lazy" draggable="false"/><span className="reel-meta"><em>Marina & Jaime</em><span>{String(i+1).padStart(2,'0')} / 14</span><ArrowsOutSimple size={17}/></span>
   </button>)}
  </div>
  <div className="reel-bottom"><p aria-live="polite">{photos[active].caption}</p><div className="reel-progress" aria-hidden="true"><span style={{width:`${(active+1)/photos.length*100}%`}}/></div><button className="round-button" aria-label="Momento anterior" onClick={()=>go(active-1)}><ArrowLeft size={20}/></button><span className="reel-counter">{String(active+1).padStart(2,'0')} / 14</span><button className="round-button" aria-label="Momento siguiente" onClick={()=>go(active+1)}><ArrowRight size={20}/></button></div>
  <dialog ref={dialog} className="lightbox" aria-label="Fotografía ampliada" onCancel={close} onClose={()=>setOpened(false)} onKeyDown={e=>{if(e.key==='ArrowRight')change(1);if(e.key==='ArrowLeft')change(-1);}} onClick={e=>{if(e.target===dialog.current)close();}}><button className="lightbox-close icon-button" aria-label="Cerrar fotografía" onClick={close}><X size={24}/></button><img src={'./'+photos[active].src} alt={photos[active].caption==='Texto pendiente.'?'Marina y Jaime':photos[active].caption}/><p>{photos[active].caption}</p><div className="lightbox-controls"><button className="round-button" aria-label="Foto ampliada anterior" onClick={()=>change(-1)}><ArrowLeft size={22}/></button><span>{active+1} / 14</span><button className="round-button" aria-label="Foto ampliada siguiente" onClick={()=>change(1)}><ArrowRight size={22}/></button></div></dialog>
 </section>;
}
