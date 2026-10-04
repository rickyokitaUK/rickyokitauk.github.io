import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildHouse } from './house-model.js';

const canvas=document.querySelector('#house-canvas'),story=document.querySelector('.house-story'),stage=document.querySelector('.house-sticky');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
try {
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  const scene=new THREE.Scene();scene.background=new THREE.Color('white');scene.add(new THREE.HemisphereLight(0xf3faff,0xbbaa86,2));
  const sun=new THREE.DirectionalLight(0xffefda,3);sun.position.set(-7,14,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14,near:.5,far:45});sun.shadow.normalBias=.035;sun.shadow.bias=-.0001;sun.shadow.radius=4;scene.add(sun);
  const fill=new THREE.DirectionalLight(0xe3f5ff,.8);fill.position.set(10,7,-4);scene.add(fill);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.14}));ground.rotation.x=-Math.PI/2;ground.position.y=-.25;ground.receiveShadow=true;scene.add(ground);
  const model=buildHouse();scene.add(model.root);
  const camera=new THREE.PerspectiveCamera(33,1,.1,150),controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.09;controls.enablePan=false;controls.enableZoom=false;controls.minPolarAngle=.25;controls.maxPolarAngle=Math.PI*.49;
  const views=[
    {name:'The coast',copy:'A little space for big ideas.',target:[0,2.6,0],offset:[8,7.5,24],span:20},
    {name:'Balcony',copy:'A sea breeze. A new perspective.',target:[0,4,1.7],offset:[3,3,14],span:13},
    {name:'Studio',copy:'AI experiments, code and creative work.',target:[2,4.9,-.1],offset:[1,1.4,10],span:8},
    {name:'Kitchen & dining',copy:'A place to gather and share.',target:[0,2,.2],offset:[2,1.8,12],span:12}
  ];
  const roomViews={bedroom:{name:'Bedroom',copy:'Room to rest and recharge.',target:[-2,4.8,-.2],offset:[0,1.5,10],span:8},roz:{name:'Meet ROZ',copy:'Rick’s curious little creative companion.',target:[-5.35,4.8,.65],offset:[0,1,8],span:6}};
  let progress=0,manual=false,selected=null,width=1,height=1,active=-1;
  const status=document.querySelector('.house-status'),range=document.querySelector('#house-zoom');
  function describe(v){status.querySelector('b').textContent=v.name;status.querySelector('span').textContent=v.copy;}
  function go(i){manual=false;selected=reduced.matches?views[i]:null;window.scrollTo({top:story.offsetTop+(story.offsetHeight-innerHeight)*i/3,behavior:reduced.matches?'instant':'smooth'});describe(views[i]);}
  function focus(key){if(typeof key==='number'){go(key);return;}manual=false;selected=roomViews[key];describe(selected);if(key==='roz')model.greet();}
  const hotspots=model.hotspots.map(({label,point,key})=>{const el=document.createElement('button');el.type='button';el.className='house-hotspot';el.textContent=label;el.setAttribute('aria-label',`Explore ${label}`);stage.append(el);el.addEventListener('click',()=>focus(key));return {el,point};});
  document.querySelectorAll('[data-house-step]').forEach(el=>el.addEventListener('click',()=>go(+el.dataset.houseStep)));
  document.querySelector('.house-reset').addEventListener('click',()=>{selected=null;manual=false;go(0);});
  range.addEventListener('input',()=>{manual=false;selected=null;const v=+range.value/100;if(reduced.matches){selected=views[Math.round(v*3)];describe(selected);}else window.scrollTo({top:story.offsetTop+v*(story.offsetHeight-innerHeight),behavior:'instant'});});
  function onScroll(){progress=THREE.MathUtils.clamp((scrollY-story.offsetTop)/Math.max(1,story.offsetHeight-innerHeight),0,1);manual=false;selected=null;range.value=String(Math.round(progress*100));const i=Math.round(progress*3);if(i!==active){active=i;describe(views[i]);document.querySelectorAll('[data-house-step]').forEach((b,j)=>{b.classList.toggle('active',i===j);b.setAttribute('aria-pressed',String(i===j));});}}
  addEventListener('scroll',onScroll,{passive:true});onScroll();controls.addEventListener('start',()=>{manual=true;selected=null;});
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null;
  canvas.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});canvas.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(model.interactive,true)[0];if(hit){let o=hit.object;while(o&&!Object.hasOwn(o.userData,'room'))o=o.parent;if(o)focus(o.userData.room);}});
  function pose(v){const target=new THREE.Vector3(...v.target),offset=new THREE.Vector3(...v.offset);const h=2*Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect);offset.setLength(Math.max(offset.length(),v.span/(2*Math.tan(h/2))));return {target,position:target.clone().add(offset)};}
  function desired(){if(selected)return pose(selected);const f=progress*3,i=Math.min(2,Math.floor(f)),a=THREE.MathUtils.smoothstep(f-i,0,1),p=pose(views[i]),q=pose(views[i+1]);return {target:p.target.lerp(q.target,a),position:p.position.lerp(q.position,a)};}
  function resize(){width=stage.clientWidth;height=stage.clientHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();if(!manual){const p=desired();camera.position.copy(p.position);controls.target.copy(p.target);}}
  new ResizeObserver(resize).observe(stage);resize();
  const clock=new THREE.Clock(),p=new THREE.Vector3();let visible=true;new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(stage);
  function render(){requestAnimationFrame(render);const dt=Math.min(clock.getDelta(),.05);if(!visible||document.hidden)return;if(!manual){const d=desired(),speed=reduced.matches?1:1-Math.exp(-dt*7);camera.position.lerp(d.position,speed);controls.target.lerp(d.target,speed);}controls.update();model.animate(clock.elapsedTime,!reduced.matches&&!document.body.classList.contains('motion-paused'));hotspots.forEach(({el,point})=>{p.copy(point).project(camera);el.hidden=p.z>1||Math.abs(p.x)>.96||Math.abs(p.y)>.84;el.style.left=`${(p.x*.5+.5)*width}px`;el.style.top=`${(-p.y*.5+.5)*height}px`;});renderer.render(scene,camera);}
  render();story.classList.add('house-ready');document.querySelector('.house-loading').hidden=true;
}catch(error){console.error('House scene:',error);document.querySelector('.house-loading').textContent='The 3D scene could not load. Please refresh in a WebGL-enabled browser.';}
