import {useEffect,useRef} from 'react';
// Modelo volumétrico con materiales físicos. Sin WebGL, conserva el recorte fotográfico.
export default function CarModel({progress,onReady}){
 const host=useRef(null);
 useEffect(()=>{
  const target=host.current;let dead=false,renderer,scene,observer,frame,draco,environment,active=true;
  const disposeScene=s=>s?.traverse(o=>{o.geometry?.dispose();const materials=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];materials.forEach(m=>{Object.values(m).forEach(v=>{if(v?.isTexture)v.dispose();});m.dispose();});});
  (async()=>{
   const canvas=document.createElement('canvas'),context=canvas.getContext('webgl2',{alpha:true,antialias:true});if(!context)return;
   const T=await import('three');const [{GLTFLoader},{DRACOLoader},{RoomEnvironment}]=await Promise.all([import('three/addons/loaders/GLTFLoader.js'),import('three/addons/loaders/DRACOLoader.js'),import('three/addons/environments/RoomEnvironment.js')]);if(dead)return;
   renderer=new T.WebGLRenderer({canvas,context,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.outputColorSpace=T.SRGBColorSpace;renderer.setSize(540,360,false);target.appendChild(renderer.domElement);
   scene=new T.Scene();const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment();environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;room.dispose();pmrem.dispose();scene.add(new T.HemisphereLight(0xfff5e0,0x41412b,2));const sun=new T.DirectionalLight(0xffe6b4,3.5);sun.position.set(-5,8,3);scene.add(sun);
   const camera=new T.PerspectiveCamera(35,1.5,.1,60);camera.position.set(2,1.8,6.5);camera.lookAt(0,.55,0);
   draco=new DRACOLoader();draco.setDecoderPath('./models/draco/');const loader=new GLTFLoader();loader.setDRACOLoader(draco);const gltf=await loader.loadAsync('./models/ferrari.glb');if(dead){disposeScene(gltf.scene);return;}
   const model=gltf.scene.children[0];const body=model.getObjectByName('body');if(body)body.material=new T.MeshPhysicalMaterial({color:0xe8e1d1,metalness:.62,roughness:.25,clearcoat:1,clearcoatRoughness:.12});const glass=model.getObjectByName('glass');if(glass)glass.material=new T.MeshPhysicalMaterial({color:0x333c35,metalness:.12,roughness:.12,transparent:true,opacity:.85});scene.add(model);
   const wheels=['wheel_fl','wheel_fr','wheel_rl','wheel_rr'].map(n=>model.getObjectByName(n)).filter(Boolean);const ao=await new T.TextureLoader().loadAsync('./models/ferrari_ao.png');if(dead){ao.dispose();return;}const shadow=new T.Mesh(new T.PlaneGeometry(2.62,5.2),new T.MeshBasicMaterial({map:ao,transparent:true,depthWrite:false,opacity:.55}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.005;model.add(shadow);
   let previous=-1;const render=()=>{if(dead)return;frame=requestAnimationFrame(render);if(document.hidden||!active)return;const p=progress.current;if(Math.abs(previous-p)<.001)return;previous=p;model.rotation.y=-.18+p*.34;wheels.forEach(w=>w.rotation.x=-p*100);renderer.render(scene,camera);onReady(true);};render();observer=new IntersectionObserver(([e])=>{active=e.isIntersecting;if(active)previous=-1;},{rootMargin:'100px'});observer.observe(target);
  })().catch(()=>onReady(false));
  return()=>{dead=true;cancelAnimationFrame(frame);observer?.disconnect();onReady(false);disposeScene(scene);environment?.dispose();draco?.dispose();renderer?.dispose();target?.replaceChildren();};
 },[]);
 return <div ref={host} className="car-model" aria-hidden="true"/>;
}
