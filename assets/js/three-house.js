import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas=document.querySelector('#house-canvas');
const story=document.querySelector('.house-story');
if(canvas&&story){
const scene=new THREE.Scene();scene.background=new THREE.Color(0xffffff);
const camera=new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.1,100);camera.position.set(14,10,18);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.enablePan=false;controls.enableZoom=false;controls.minDistance=7;controls.maxDistance=28;controls.maxPolarAngle=Math.PI*.49;controls.target.set(1.2,2.2,0);
scene.add(new THREE.HemisphereLight(0xeafaff,0xbda882,2.6));const sun=new THREE.DirectionalLight(0xfff3d5,4);sun.position.set(-8,15,9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-18;sun.shadow.camera.right=18;sun.shadow.camera.top=18;sun.shadow.camera.bottom=-18;scene.add(sun);
const mat=(color,rough=.82)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness:0});const ivory=mat(0xf8f3e9),wood=mat(0xb77b45),darkWood=mat(0x735137),green=mat(0x69a84f),deepGreen=mat(0x3f7f49),sand=mat(0xead6ad),water=mat(0x65d6df,.3),glass=new THREE.MeshPhysicalMaterial({color:0xb9ecf1,transparent:true,opacity:.3,roughness:.12,transmission:.45}),roof=mat(0xd7754f),ink=mat(0x253a38),white=mat(0xffffff),cyan=mat(0x32bdd0),black=mat(0x071313,.25),lime=new THREE.MeshStandardMaterial({color:0xcaff36,emissive:0x8ecb12,emissiveIntensity:1.1});
const root=new THREE.Group();root.rotation.y=-.14;root.position.set(2,-1.15,0);scene.add(root);const clickables=[];const targets={};
function mesh(g,m,p,s,name,parent=root){const o=new THREE.Mesh(g,m);o.position.set(...p);if(s)o.scale.set(...s);o.castShadow=true;o.receiveShadow=true;o.name=name||'';(parent||root).add(o);return o}
function box(p,s,m=ivory,name='',parent=root){return mesh(new THREE.BoxGeometry(1,1,1),m,p,s,name,parent)}function cyl(p,r,h,m=wood,parent=root,segments=20){return mesh(new THREE.CylinderGeometry(r,r,h,segments),m,p,null,'',parent)}
// island, water and jetty
mesh(new THREE.CylinderGeometry(8.7,8.9,.55,48),sand,[0,0,0],[1,1,.72]);mesh(new THREE.CylinderGeometry(7.9,8.1,.2,48),green,[-.4,.38,-.25],[1,1,.66]);mesh(new THREE.CylinderGeometry(3.9,4,.17,36),water,[5.4,.5,2.7],[1,1,.72]);
for(let i=0;i<5;i++)box([4.3+i*.52,.72,1.2],[.42,.12,2.1],wood);for(let i=0;i<4;i++)cyl([3.8+i*1.3,.15,2.4],.1,1.25,darkWood);
const boat=new THREE.Group();boat.position.set(6,.9,3.5);boat.rotation.y=-.55;root.add(boat);mesh(new THREE.SphereGeometry(1,24,12,0,Math.PI*2,0,Math.PI*.55),white,[0,0,0],[1.35,.45,.55],'',boat);box([0,.27,0],[.9,.12,.38],wood,'',boat);cyl([0,.82,0],.035,1.2,darkWood,boat);box([.25,.85,0],[.42,.45,.02],white,'',boat);
// tree
cyl([-5.6,1.55,-.7],.32,3.2,darkWood);[[-5.6,3.4,-.7],[-6.25,3,-.6],[-5.05,3.05,-.8],[-5.7,3.15,.05]].forEach(p=>mesh(new THREE.SphereGeometry(1.15,20,16),deepGreen,p));
// house slabs and walls, open front
box([0,.78,-.7],[8.7,.3,6.1],ivory);box([0,3.55,-.7],[8.7,.28,6.1],ivory);box([0,6.25,-.7],[8.9,.25,6.25],ivory);box([-4.25,2.15,-.7],[.3,5.45,6.1],ivory);box([4.25,2.15,-.7],[.3,5.45,6.1],ivory);box([0,2.15,-3.62],[8.7,5.45,.28],ivory);box([0,2.15,-.7],[.2,5.45,6.1],ivory);
const roofL=box([-2.25,6.8,-.7],[5.05,.22,6.9],roof);roofL.rotation.z=.18;const roofR=box([2.25,6.8,-.7],[5.05,.22,6.9],roof);roofR.rotation.z=-.18;
// balcony
box([2.2,3.76,2.45],[4.2,.18,1.3],wood);box([2.2,4.3,3.05],[4.15,.08,.08],darkWood);for(let x=.2;x<4.3;x+=.65)box([x,4.05,3.05],[.05,.7,.05],glass);
// ground kitchen
box([-3.45,1.35,-2.8],[.65,1.1,4.7],wood);box([-2,1.35,-2.9],[2.1,1.1,.65],wood);box([-2,1.95,-2.9],[2.1,.08,.75],white);box([-2.1,1.45,-.7],[2.3,1.25,1.05],wood);box([-2.1,2.1,-.7],[2.45,.12,1.18],white);for(let x=-2.9;x<-.9;x+=1)cyl([x,1.15,.2],.22,.9,darkWood);
// dining
cyl([2.2,1.45,-.5],1.15,.14,wood);cyl([2.2,.95,-.5],.18,1,darkWood);[[.4,0],[2,0],[0,-1.5],[0,1.5]].forEach(([x,z],i)=>{const a=i<2?0:Math.PI/2;const ch=new THREE.Group();ch.position.set(1.4+x*.8,.95,-.5+z*.65);ch.rotation.y=a;root.add(ch);box([0,0,0],[.65,.12,.65],ivory,'',ch);box([0,.55,-.28],[.65,1,.1],ivory,'',ch)});
// bedroom
box([-2.25,4.2,-2],[2.5,.45,3.35],white);box([-2.25,4.65,-3.1],[2.55,1.2,.25],wood);box([-2.25,4.52,-1.5],[2.1,.16,1.2],mat(0xb9cfb2));box([-3.45,4.25,-2.8],[.55,.65,.55],wood);cyl([-3.45,4.9,-2.8],.28,.55,white);
// studio
box([2.25,4.3,-1],[3.2,.18,1.3],wood);cyl([1,3.95,-1],.1,.9,darkWood);cyl([3.5,3.95,-1],.1,.9,darkWood);box([2.25,4.85,-1.15],[1.25,.78,.12],ink);box([2.25,4.88,-1.07],[1.08,.62,.04],cyan);cyl([1.15,5.05,-.65],.06,1.1,ink);box([1.4,5.25,-.65],[.6,.07,.07],ink);cyl([1.72,5.25,-.65],.13,.28,black);
// Rick simple avatar
const rick=new THREE.Group();rick.position.set(2.25,4.15,-.1);root.add(rick);cyl([0,.35,0],.35,.9,mat(0x233f63),rick);mesh(new THREE.SphereGeometry(.38,24,16),mat(0xe8b58c),[0,1,0],null,'',rick);cyl([0,1.3,0],.45,.15,mat(0x173257),rick);cyl([0,1.42,0],.25,.32,mat(0x173257),rick);box([0,1.05,.34],[.65,.13,.06],black,'',rick);cyl([-.18,1.05,.39],.12,.05,black,rick);cyl([.18,1.05,.39],.12,.05,black,rick);
// Roz
const roz=new THREE.Group();roz.position.set(5.2,3,-.2);root.add(roz);mesh(new THREE.SphereGeometry(.7,32,24),white,[0,0,0],null,'roz',roz);mesh(new THREE.SphereGeometry(.53,32,20),black,[0,.03,.36],[1,.82,.3],'',roz);cyl([0,.92,0],.62,.06,cyan,roz);cyl([-.22,.08,.56],.08,.18,lime,roz);cyl([.22,.08,.56],.08,.18,lime,roz);clickables.push(roz.children[0]);targets.roz=new THREE.Vector3(5.2,3,-.2);
// hotspots
const spots=[['Studio',new THREE.Vector3(2.2,5.25,.35),2],['Balcony',new THREE.Vector3(2.2,4.15,3.1),1],['Kitchen',new THREE.Vector3(-2.2,2.2,.4),3],['Dining',new THREE.Vector3(2.2,2.1,.7),3],['Meet ROZ',new THREE.Vector3(5.2,3.7,-.2),1]];const spotEls=[];spots.forEach(([label,pos,step])=>{const b=document.createElement('button');b.className='house-hotspot';b.textContent=label;b.dataset.step=step;b.type='button';story.querySelector('.house-sticky').appendChild(b);b.addEventListener('click',()=>goStep(step));spotEls.push({el:b,pos})});
const views=[{p:[15,10.5,20],t:[1.2,2.2,0],title:'THE COAST',copy:'A quiet place to make things.'},{p:[13,8.2,17],t:[2.2,4,1.2],title:'THE BALCONY',copy:'Pause, look out, find the next idea.'},{p:[11,7.2,14],t:[2.2,4.8,-.7],title:'THE STUDIO',copy:'Rick is live — step inside the process.'},{p:[12,6,16],t:[0,1.7,-.7],title:'KITCHEN & DINING',copy:'Where ideas are shared around the table.'}];let desired=0,currentProgress=0,userOrbit=false;
function goStep(i){const top=story.offsetTop+i*(story.offsetHeight-innerHeight)/3;scrollTo({top,behavior:'smooth'})}
document.querySelectorAll('[data-house-step]').forEach(b=>b.addEventListener('click',()=>goStep(Number(b.dataset.houseStep))));document.querySelector('.house-reset').addEventListener('click',()=>goStep(0));controls.addEventListener('start',()=>userOrbit=true);controls.addEventListener('end',()=>setTimeout(()=>userOrbit=false,500));
function updateScroll(){const rect=story.getBoundingClientRect(),max=story.offsetHeight-innerHeight;currentProgress=THREE.MathUtils.clamp(-rect.top/max,0,1);desired=Math.min(3,Math.round(currentProgress*3));document.querySelectorAll('[data-house-step]').forEach((b,i)=>b.classList.toggle('active',i===desired));const s=document.querySelector('.house-status');s.querySelector('b').textContent=views[desired].title;s.querySelector('span').textContent=views[desired].copy}
addEventListener('scroll',updateScroll,{passive:true});updateScroll();
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();canvas.addEventListener('click',e=>{mouse.x=e.clientX/innerWidth*2-1;mouse.y=-(e.clientY/innerHeight)*2+1;ray.setFromCamera(mouse,camera);if(ray.intersectObjects(clickables,true).length)goStep(1)});
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}addEventListener('resize',resize);
const clock=new THREE.Clock();function tick(){const t=clock.getElapsedTime();roz.position.y=3+Math.sin(t*1.5)*.12;boat.rotation.z=Math.sin(t*1.2)*.025;if(!userOrbit){const f=currentProgress*3,i=Math.floor(f),n=Math.min(3,i+1),a=f-i;const vp=views[i],vn=views[n];const target=new THREE.Vector3(...vp.t).lerp(new THREE.Vector3(...vn.t),a);const rawPosition=new THREE.Vector3(...vp.p).lerp(new THREE.Vector3(...vn.p),a);const frameFactor=Math.max(1,.98/camera.aspect);const framed=target.clone().add(rawPosition.sub(target).multiplyScalar(frameFactor));camera.position.lerp(framed,.045);controls.target.lerp(target,.045)}controls.update();spotEls.forEach(o=>{const p=o.pos.clone();root.localToWorld(p);p.project(camera);const visible=p.z<1&&Math.abs(p.x)<1.1&&Math.abs(p.y)<1.1;o.el.style.left=(p.x*.5+.5)*innerWidth+'px';o.el.style.top=(-p.y*.5+.5)*innerHeight+'px';o.el.style.display=visible?'block':'none'});renderer.render(scene,camera);requestAnimationFrame(tick)}tick();story.classList.add('house-ready');
}
