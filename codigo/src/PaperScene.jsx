import { useEffect, useRef, useState } from 'react';

export default function PaperScene({ motion = true }) {
  const host = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!motion) return;
    let disposed = false, renderer, scene, camera, group, frame, observer, visibility;
    let active = true, targetX = 0, targetY = 0, scroll = 0;
    let textures = [];
    const pointer = e => { const box = host.current?.getBoundingClientRect(); if (!box) return; targetX = (e.clientX-box.left)/box.width-.5; targetY = (e.clientY-box.top)/box.height-.5; };
    const onScroll = () => { scroll = Math.min(1, window.scrollY / window.innerHeight); };
    const pageVisibility = () => { active = !document.hidden && visibility; if (active && !frame) animate(); };
    let animate = () => {};
    (async () => {
      const T = await import('three');
      if (disposed || !host.current) return;
      const probe=document.createElement('canvas'); const context=probe.getContext('webgl2',{alpha:true,antialias:true});
      if(context){renderer=new T.WebGLRenderer({canvas:probe,context,antialias:true,alpha:true,powerPreference:'low-power'});}else{const {makeSoftwarePaperRenderer}=await import('./SoftwarePaperRenderer');if(disposed)return;renderer=makeSoftwarePaperRenderer(T);}
      host.current.dataset.renderer=renderer.isSoftware?'software-3d':'webgl';
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setClearColor(0xf4f0e7, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.22;
      host.current.appendChild(renderer.domElement);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      scene = new T.Scene();
      camera = new T.PerspectiveCamera(37, 1, .1, 100);
      camera.position.set(0, .3, 11.7); camera.lookAt(0, .1, 0);
      scene.add(new T.HemisphereLight(0xfffbef, 0x9b927c, 3));
      const sun = new T.DirectionalLight(0xfff4db, 4.1);
      sun.position.set(-4, 7, 6); sun.castShadow = true;
      sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left=-6;sun.shadow.camera.right=6;sun.shadow.camera.top=6;sun.shadow.camera.bottom=-6;sun.shadow.normalBias=.04;sun.shadow.bias=-.0001;
      scene.add(sun);
      const fill = new T.DirectionalLight(0xffffff, 1.4); fill.position.set(5,1,5);scene.add(fill);
      group = new T.Group();group.rotation.set(-.13,-.25,-.18); group.position.set(.2,.25,0);scene.add(group);
      const sheet = new T.PlaneGeometry(3.5, 7.25, 14, 58);
      const pos=sheet.attributes.position;
      for(let i=0;i<pos.count;i++){
        let x=pos.getX(i), y=pos.getY(i), z=0;
        if(y>1.65){const d=y-1.65,a=d*1.18,twist=d*.23;const ox=x;y=1.65+Math.sin(a)/1.18;z=(1-Math.cos(a))/1.18-ox*Math.sin(twist)*.45;x=ox*Math.cos(twist)+d*.25;}
        if(y<-1.85){const d=-y-1.85,a=d*1.4,twist=d*.6,ox=x;y=-1.85-Math.sin(a)/1.05+ox*.22*d/1.775;z=(1-Math.cos(a))/.95+ox*Math.sin(twist)*.6;x=ox*Math.cos(twist)+d*.65;}
        z+=.05*Math.sin(x*1.3+y*.3);pos.setXYZ(i,x,y,z);
      }
      sheet.computeVertexNormals();
      const image = await new Promise((resolve,reject)=>{const img = new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src='./assets/story-01.jpg';});
      if(disposed){sheet.dispose();return;}
      const texCanvas = document.createElement('canvas');texCanvas.width=1024;texCanvas.height=2048;
      const ctx=texCanvas.getContext('2d');ctx.fillStyle='#f4efe2';ctx.fillRect(0,0,1024,2048);
      // La fotografía original se imprime con su proporción; no se genera ni modifica su identidad.
      const scale=Math.max(920/image.width,1170/image.height),iw=image.width*scale,ih=image.height*scale;
      ctx.save();ctx.beginPath();ctx.rect(52,439,920,1170);ctx.clip();ctx.drawImage(image,(1024-iw)/2,(2048-ih)/2,iw,ih);ctx.restore();
      const texture=new T.CanvasTexture(texCanvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);textures.push(texture);
      const mat=new T.MeshStandardMaterial({map:texture,roughness:.94,metalness:0,side:T.DoubleSide});
      const paper=new T.Mesh(sheet,mat);paper.castShadow=true;paper.receiveShadow=true;group.add(paper);
      const floor=new T.Mesh(new T.PlaneGeometry(30,30),new T.ShadowMaterial({color:0x75664b,opacity:.16}));floor.rotation.x=-Math.PI/2;floor.position.y=-3.3;floor.receiveShadow=true;scene.add(floor);
      const resize=()=>{if(!host.current||disposed)return;const w=host.current.clientWidth,h=host.current.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.render(scene,camera);};
      observer=new ResizeObserver(resize);observer.observe(host.current);resize();
      let ticks=0,lastFrame=0;
      animate=()=>{frame=null;if(disposed||!active)return;const now=performance.now();if(renderer.isSoftware&&now-lastFrame<90){frame=requestAnimationFrame(animate);return;}lastFrame=now;const t=now*.00035;group.rotation.y+=(-.25+targetX*.19+scroll*.15-group.rotation.y)*.035;group.rotation.x+=(-.13+targetY*.09-group.rotation.x)*.035;group.rotation.z=-.18+Math.sin(t)*.016;group.position.y=.25+Math.sin(t*.8)*.045;renderer.render(scene,camera);if(++ticks===2)setReady(true);frame=requestAnimationFrame(animate);};
      visibility=true;
      const io=new IntersectionObserver(entries=>{visibility=entries[0].isIntersecting;active=visibility&&!document.hidden;if(active&&!frame)animate();},{rootMargin:'80px'});io.observe(host.current);host.current._io=io;
      host.current.addEventListener('pointermove',pointer,{passive:true});window.addEventListener('scroll',onScroll,{passive:true});document.addEventListener('visibilitychange',pageVisibility);animate();
    })().catch(()=>{if(!disposed)setReady(false);});
    return()=>{disposed=true;cancelAnimationFrame(frame);observer?.disconnect();host.current?._io?.disconnect();host.current?.removeEventListener('pointermove',pointer);window.removeEventListener('scroll',onScroll);document.removeEventListener('visibilitychange',pageVisibility);scene?.traverse(o=>{o.geometry?.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});textures.forEach(t=>t.dispose());renderer?.dispose();renderer?.domElement.remove();};
  }, [motion]);
  return <div ref={host} className={`paper-scene ${ready && motion ? 'is-ready' : ''}`} data-testid="paper-scene"><img className="paper-fallback" src="./assets/story-01.jpg" alt="Marina y Jaime" width="900" height="1200" fetchPriority="high"/><span className="scene-caption" aria-hidden="true">M&J</span></div>;
}
