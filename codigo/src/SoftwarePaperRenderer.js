// Render de la misma malla Three.js por CPU cuando el navegador no tiene WebGL.
// Mantiene la perspectiva y la fotografía original; no es una imagen de la maqueta.
export function makeSoftwarePaperRenderer(T){
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');let width=1,height=1,ratio=1;
 const projected=new T.Vector3(),worldA=new T.Vector3(),worldB=new T.Vector3(),worldC=new T.Vector3(),normal=new T.Vector3(),ab=new T.Vector3(),ac=new T.Vector3();
 const light=new T.Vector3(-4,7,6).normalize();
 const renderer={domElement:canvas,isSoftware:true,shadowMap:{},capabilities:{getMaxAnisotropy:()=>1},setPixelRatio:r=>ratio=Math.min(r,1.25),setClearColor:()=>{},setSize(w,h){width=w;height=h;canvas.width=w*ratio;canvas.height=h*ratio;canvas.style.width=w+'px';canvas.style.height=h+'px';},dispose(){},render(scene,camera){
 scene.updateMatrixWorld();camera.updateMatrixWorld();ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);
 const items=[],shadowPoints=[];scene.traverse(mesh=>{if(!mesh.isMesh||!mesh.material.map)return;const p=mesh.geometry.attributes.position,uv=mesh.geometry.attributes.uv,idx=mesh.geometry.index;const image=mesh.material.map.image;if(!image)return;
 const verts=[];for(let i=0;i<p.count;i++){projected.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);const k=(projected.y+3.3)/light.y;worldA.set(projected.x-light.x*k,-3.3,projected.z-light.z*k).project(camera);shadowPoints.push({x:(worldA.x*.5+.5)*width,y:(-.5*worldA.y+.5)*height});projected.project(camera);verts.push({x:(projected.x*.5+.5)*width,y:(-.5*projected.y+.5)*height,z:projected.z,u:uv.getX(i)*image.width,v:(1-uv.getY(i))*image.height});}
 for(let i=0;i<idx.count;i+=3){const ia=idx.getX(i),ib=idx.getX(i+1),ic=idx.getX(i+2);worldA.fromBufferAttribute(p,ia).applyMatrix4(mesh.matrixWorld);worldB.fromBufferAttribute(p,ib).applyMatrix4(mesh.matrixWorld);worldC.fromBufferAttribute(p,ic).applyMatrix4(mesh.matrixWorld);normal.crossVectors(ab.subVectors(worldB,worldA),ac.subVectors(worldC,worldA)).normalize();const shade=.04+(1-Math.abs(normal.dot(light)))*.18;items.push({a:verts[ia],b:verts[ib],c:verts[ic],image,shade,z:(verts[ia].z+verts[ib].z+verts[ic].z)/3});}});
 if(shadowPoints.length){const sorted=shadowPoints.sort((a,b)=>a.x-b.x||a.y-b.y),cross=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x),lower=[],upper=[];for(const p of sorted){while(lower.length>1&&cross(lower.at(-2),lower.at(-1),p)<=0)lower.pop();lower.push(p);}for(const p of sorted.slice().reverse()){while(upper.length>1&&cross(upper.at(-2),upper.at(-1),p)<=0)upper.pop();upper.push(p);}const hull=lower.slice(0,-1).concat(upper.slice(0,-1));ctx.save();ctx.filter='blur(16px)';ctx.fillStyle='rgba(91,75,47,.17)';ctx.beginPath();hull.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill();ctx.restore();}
 items.sort((a,b)=>b.z-a.z);
 for(const {a,b,c,image,shade} of items){const den=a.u*(c.v-b.v)+b.u*(a.v-c.v)+c.u*(b.v-a.v);if(Math.abs(den)<.001)continue;
 const aa=(a.x*(c.v-b.v)+b.x*(a.v-c.v)+c.x*(b.v-a.v))/den;
 const bb=(a.y*(c.v-b.v)+b.y*(a.v-c.v)+c.y*(b.v-a.v))/den;
 const cc=(a.x*(b.u-c.u)+b.x*(c.u-a.u)+c.x*(a.u-b.u))/den;
 const dd=(a.y*(b.u-c.u)+b.y*(c.u-a.u)+c.y*(a.u-b.u))/den;
 const ee=(a.x*(c.u*b.v-b.u*c.v)+b.x*(a.u*c.v-c.u*a.v)+c.x*(b.u*a.v-a.u*b.v))/den;
 const ff=(a.y*(c.u*b.v-b.u*c.v)+b.y*(a.u*c.v-c.u*a.v)+c.y*(b.u*a.v-a.u*b.v))/den;
 const mx=(a.x+b.x+c.x)/3,my=(a.y+b.y+c.y)/3;const grow=p=>{const dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy)||1;return {x:p.x+dx/d*.7,y:p.y+dy/d*.7};};const ca=grow(a),cb=grow(b),ccp=grow(c);ctx.save();ctx.beginPath();ctx.moveTo(ca.x,ca.y);ctx.lineTo(cb.x,cb.y);ctx.lineTo(ccp.x,ccp.y);ctx.closePath();ctx.clip();ctx.transform(aa,bb,cc,dd,ee,ff);ctx.drawImage(image,0,0);ctx.fillStyle=`rgba(68,53,27,${shade})`;ctx.fillRect(0,0,image.width,image.height);ctx.restore();
 }
 }};return renderer;
}
