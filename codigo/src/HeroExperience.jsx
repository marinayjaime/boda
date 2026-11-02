import {useEffect,useRef} from 'react';
import {ArrowDown,ArrowUpRight} from '@phosphor-icons/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);

export default function HeroExperience({motion}){
 const root=useRef(null);
 useEffect(()=>{
  if(!motion)return;
  const ctx=gsap.context(()=>{
   const tl=gsap.timeline({scrollTrigger:{trigger:root.current,start:()=>`top ${innerWidth<=560?74:88}px`,end:'bottom bottom',scrub:.65}});
   tl.to('.invitation-window',{left:'0%',top:'0%',width:'100%',height:'100%',borderRadius:'0px',ease:'none'},0)
    .to('.invitation-title',{y:-130,opacity:0,ease:'none'},0)
    .to('.invitation-opening',{opacity:0,y:40,duration:.25},0)
    .fromTo('.invitation-arrival',{opacity:0,y:40},{opacity:1,y:0,duration:.35},.65);
  },root);return()=>ctx.revert();
 },[motion]);
 const enter=()=>{const el=root.current;const y=el.offsetTop+el.offsetHeight-window.innerHeight;if(motion)gsap.to(window,{scrollTo:{y,autoKill:false},duration:1.4,ease:'power2.inOut'});else window.scrollTo({top:y,behavior:'instant'});};
 return <section ref={root} className={`invitation-hero ${motion?'':'no-motion'}`} id="inicio" aria-labelledby="hero-title">
  <div className="invitation-sticky">
   <div className="invitation-topline"><span>MALLORCA, ESPAÑA</span><span>SÁBADO · 03.07.2027</span></div>
   <h1 id="hero-title" className="invitation-title">Marina <em>&</em> Jaime</h1>
   <div className="invitation-window"><img src="./assets/story-05.jpg" alt="Marina y Jaime en su primera fotografía juntos" fetchPriority="high"/><div className="invitation-arrival"><p className="eyebrow">El siguiente capítulo</p><p>Nos casamos.</p><a href="#confirmar" className="button">Confirmar asistencia <ArrowUpRight size={18}/></a></div></div>
   <div className="invitation-opening"><span>Una fecha.<br/>Todo por celebrar.</span><button onClick={enter} className="invitation-open">Abrir nuestra invitación <ArrowDown size={20}/></button><span>Palma · Alaró<br/>3 de julio de 2027</span></div>
  </div>
 </section>;
}
