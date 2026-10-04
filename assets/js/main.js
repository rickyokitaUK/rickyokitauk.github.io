const copy={
  'zh-hk':{navWork:'作品',navNotes:'文章',navAbout:'關於',available:'接受工作及合作',role:'產品工程師 · 創意科技人',headline:'我讓科技感覺更有人性。',lead:'我是 Rick——一位跨領域創作者，將複雜系統、玩味想法及 AI 新可能，轉化為人們真正用得上的產品。',seeWork:'探索精選作品 ↘',cv:'履歷 ↗',rozStatus:'AI 拍檔 / 聆聽中',years:'年數碼創作經驗',worlds:'個世界：產品、程式與玩樂',perspective:'一種跨文化視野',selected:'精選作品',workTitle:'遊走於系統、屏幕與想像世界之間。',workIntro:'精選產品工程與視覺實驗。共同點是：把複雜概念變得清晰、實用而吸引。',p1:'為高要求工作而設的可靠系統',p1d:'為香港公共服務及企業團隊交付人面追蹤、文件擷取及 OCR 工具。',p2:'從遊戲中學習',p2d:'以 Unity、Unreal 及遊戲設計思維，製作教育遊戲與獨立實驗。',p3:'想像世界的實驗',p3d:'一本涵蓋生成影像、voxel 空間、Maya 場景與人機協作方式的視覺筆記。',fieldNotes:'創作筆記',notesTitle:'把學習過程公開分享。',allNotes:'閱讀全部文章 →',n1:'設計一位值得信任的 AI 隊友',n2:'先為問題做原型，而不只為答案',n3:'遊戲引擎教我的產品回饋課',cms:'未來文章可透過 REST 或 GraphQL API，從 WordPress 自動顯示於此。',aboutMe:'關於我',aboutTitle:'工程師的訓練，<br><em>探索者的本能。</em>',aboutText:'我的歷程由 C++ 圖像、教育遊戲，走到全端產品、公共服務系統及 AI。當技術深度遇上視覺思維，就是我最能發揮的地方——將模糊想法變成實在成果。',aboutText2:'現居英國、根在香港。我正尋找產品工程職位、創意科技項目，以及與好奇團隊合作的機會。',talk:'一起做有用的東西 ↗',footerPrompt:'有職位、項目或古怪想法？',sayHello:'找我聊聊 ↗'},
  'zh-cn':{navWork:'作品',navNotes:'文章',navAbout:'关于',available:'接受工作及合作',role:'产品工程师 · 创意科技人',headline:'我让科技感觉更有人性。',lead:'我是 Rick——一位跨领域创作者，把复杂系统、玩味想法和 AI 新可能，转化为人们真正用得上的产品。',seeWork:'探索精选作品 ↘',cv:'履历 ↗',rozStatus:'AI 搭档 / 聆听中',years:'年数字创作经验',worlds:'个世界：产品、代码与玩乐',perspective:'一种跨文化视野',selected:'精选作品',workTitle:'游走于系统、屏幕与想象世界之间。',workIntro:'精选产品工程与视觉实验。共同点是：把复杂概念变得清晰、实用而吸引。',p1:'为高要求工作而设的可靠系统',p1d:'为香港公共服务及企业团队交付人脸追踪、文档采集及 OCR 工具。',p2:'从游戏中学习',p2d:'以 Unity、Unreal 及游戏设计思维，制作教育游戏与独立实验。',p3:'想象世界的实验',p3d:'一本涵盖生成图像、voxel 空间、Maya 场景与人机协作方式的视觉笔记。',fieldNotes:'创作笔记',notesTitle:'把学习过程公开分享。',allNotes:'阅读全部文章 →',n1:'设计一位值得信任的 AI 队友',n2:'先为问题做原型，而不只为答案',n3:'游戏引擎教我的产品反馈课',cms:'未来文章可通过 REST 或 GraphQL API，从 WordPress 自动显示于此。',aboutMe:'关于我',aboutTitle:'工程师的训练，<br><em>探索者的本能。</em>',aboutText:'我的历程由 C++ 图形、教育游戏，走到全栈产品、公共服务系统及 AI。当技术深度遇上视觉思维，就是我最能发挥的地方——将模糊想法变成实际成果。',aboutText2:'现居英国、根在香港。我正寻找产品工程职位、创意科技项目，以及与好奇团队合作的机会。',talk:'一起做有用的东西 ↗',footerPrompt:'有职位、项目或奇怪想法？',sayHello:'找我聊聊 ↗'}
};
const english={};document.querySelectorAll('[data-t]').forEach(el=>english[el.dataset.t]=el.innerHTML);copy.en=english;
document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>{const lang=btn.dataset.lang;document.documentElement.lang=lang;document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active',b===btn));document.querySelectorAll('[data-t]').forEach(el=>{const value=copy[lang]?.[el.dataset.t];if(value)el.innerHTML=value});document.body.classList.remove('reveal');void document.body.offsetWidth;document.body.classList.add('reveal')}));

// Headless WordPress adapter. The designed sample notes remain as a graceful fallback.
const postList=document.querySelector('#latest-posts');
if(postList){
  fetch(postList.dataset.api,{headers:{Accept:'application/json'}})
    .then(response=>{if(!response.ok)throw new Error('WordPress unavailable');return response.json()})
    .then(posts=>{if(!posts.length)return;postList.innerHTML=posts.map(post=>{
      const date=new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'2-digit',year:'2-digit'}).format(new Date(post.date));
      const category=post._embedded?.['wp:term']?.[0]?.[0]?.name||'FIELD NOTE';
      return `<a href="${post.link}"><time>${date}</time><span>${category}</span><h3>${post.title.rendered}</h3><i>↗</i></a>`;
    }).join('')})
    .catch(()=>{});
}

const progress=document.querySelector('.scroll-progress span');
const glow=document.querySelector('.cursor-glow');
const parallaxItems=[...document.querySelectorAll('[data-parallax]')];
let ticking=false;
function animateScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.transform=`scaleX(${max?scrollY/max:0})`;
  const hero=document.querySelector('.hero');
  if(hero&&!document.body.classList.contains('motion-paused')){
    const rect=hero.getBoundingClientRect();
    const distance=Math.max(1,hero.offsetHeight-innerHeight);
    const heroProgress=Math.min(1,Math.max(0,-rect.top/distance));
    hero.style.setProperty('--hero-p',heroProgress.toFixed(4));
  }
  parallaxItems.forEach(item=>{
    const rect=item.getBoundingClientRect();
    item.style.setProperty('--drift',`${(rect.top-innerHeight*.5)*(Number(item.dataset.parallax)||0)}px`);
  });
  ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(animateScroll);ticking=true}},{passive:true});
addEventListener('pointermove',event=>{if(glow){glow.style.left=`${event.clientX}px`;glow.style.top=`${event.clientY}px`}}, {passive:true});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('in-view')}),{threshold:.18});
document.querySelectorAll('[data-reveal-card]').forEach(card=>observer.observe(card));
const motionToggle=document.querySelector('.motion-toggle');
motionToggle?.addEventListener('click',()=>{
  const paused=document.body.classList.toggle('motion-paused');
  motionToggle.setAttribute('aria-pressed',String(paused));
  motionToggle.setAttribute('aria-label',paused?'Resume animations':'Pause animations');
  motionToggle.textContent=paused?'▶':'Ⅱ';
});
animateScroll();
