(() => {
  const STORAGE_KEY = "mlt-revision-hub-progress-v1";
  const $ = id => document.getElementById(id);
  const weekList = $("week-list");
  let questions = [], weeks = [], progress = readProgress();
  function readProgress(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")}catch(_){return {}}}
  function writeProgress(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(progress))}catch(_){}}
  function esc(v){return String(v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]))}
  function weekLabel(n){return n===0?"Foundations & Unassigned":"Week "+n}
  function updateStats(){const done=questions.filter(q=>progress[q.id]).length,pct=questions.length?Math.round(done/questions.length*100):0;$("total-count").textContent=questions.length;$("done-count").textContent=done;$("progress-percent").textContent=pct+"%";$("progress-fill").style.width=pct+"%"}
  function populateFilters(){
    $("week-filter").innerHTML='<option value="all">All weeks</option>'+weeks.map(w=>'<option value="'+w.week+'">'+esc(weekLabel(w.week))+'</option>').join("");
    const topics=Array.from(new Set(weeks.flatMap(w=>w.topics||[]).concat(questions.map(q=>q.topic).filter(Boolean)))).sort((a,b)=>a.localeCompare(b));
    $("topic-filter").innerHTML='<option value="all">All topics</option>'+topics.map(t=>'<option value="'+esc(t)+'">'+esc(t)+'</option>').join("");
  }
  function card(q){const done=!!progress[q.id];return '<article class="question-card"><div class="card-top"><span class="topic-pill">'+esc(q.topic||"General")+'</span><span class="difficulty">'+esc(q.category||"PA")+'</span></div><h3>'+esc(q.title)+'</h3><p>'+esc(q.summary||"")+'</p><div class="tag-row">'+(q.tags||[]).map(t=>'<span class="tag">'+esc(t)+'</span>').join("")+'</div><div class="card-bottom"><a class="text-link" href="'+esc(q.url)+'">Open question ↗</a><span class="status '+(done?"done":"")+'"><span class="status-dot"></span>'+(done?"Revised":"Not revised")+'</span></div></article>'}
  function render(){
    const query=$("search").value.trim().toLowerCase(),selectedWeek=$("week-filter").value,selectedTopic=$("topic-filter").value,category=$("category-filter").value,status=$("status-filter").value;
    const narrowed=!!query||category!=="all"||status!=="all"||selectedTopic!=="all";
    const filtered=questions.filter(q=>{const text=[q.title,q.topic,q.weekTitle,q.category,q.summary,"week "+q.week].concat(q.tags||[]).join(" ").toLowerCase();return(!query||text.includes(query))&&(selectedWeek==="all"||String(q.week==null?0:q.week)===selectedWeek)&&(selectedTopic==="all"||q.topic===selectedTopic)&&(category==="all"||(q.category||"PA")===category)&&(status==="all"||(status==="done"?!!progress[q.id]:!progress[q.id]))});
    $("results-count").textContent=filtered.length+" question"+(filtered.length===1?"":"s");
    const activeWeeks=weeks.filter(w=>selectedWeek==="all"||String(w.week)===selectedWeek);
    weekList.innerHTML=activeWeeks.map(week=>{
      const qs=filtered.filter(q=>Number(q.week==null?0:q.week)===week.week);
      const names=Array.from(new Set((week.topics||[]).concat(qs.map(q=>q.topic||"General"))));
      const shown=narrowed?names.filter(t=>qs.some(q=>(q.topic||"General")===t)):names;
      if(narrowed&&!qs.length)return "";
      const topics=shown.map(topic=>{const topicQs=qs.filter(q=>(q.topic||"General")===topic);const content=topicQs.length?'<div class="question-grid">'+topicQs.map(card).join("")+'</div>':'<p class="topic-empty">No questions added yet. Add an AQ, PA, GA, or PYQ for this topic.</p>';return '<details class="topic-panel" '+(topicQs.length?'open':'')+'><summary><span>'+esc(topic)+'</span><span class="topic-question-count">'+topicQs.length+' question'+(topicQs.length===1?"":"s")+'</span></summary><div class="topic-content">'+content+'</div></details>'}).join("");
      return '<details class="week-panel" '+((query||selectedWeek!=="all"||selectedTopic!=="all"||qs.length>0)?"open":"")+'><summary><span class="week-number">'+(week.week===0?"★":String(week.week).padStart(2,"0"))+'</span><span class="week-summary"><strong>'+esc(weekLabel(week.week))+' · '+esc(week.weekTitle)+'</strong><span class="muted small">'+(week.topics||[]).length+' topics · '+qs.length+' questions</span></span><span class="week-count">'+qs.length+'</span></summary><div class="week-content">'+(topics||'<p class="topic-empty">No topics found for this filter.</p>')+'</div></details>'
    }).filter(Boolean).join("");
    $("empty-state").classList.toggle("hidden",filtered.length!==0||!narrowed);
    if(narrowed&&!filtered.length)weekList.innerHTML="";
    updateStats();
  }
  async function init(){try{const r=await Promise.all([fetch("data/questions.json?v=4"),fetch("data/weeks.json?v=4")]);if(!r[0].ok||!r[1].ok)throw Error("Could not load course data");questions=await r[0].json();weeks=await r[1].json();const seen=new Set(weeks.map(w=>Number(w.week)));questions.forEach(q=>{const n=Number(q.week==null?0:q.week);if(!seen.has(n)){weeks.push({week:n,weekTitle:q.weekTitle||"Foundations & Unassigned",topics:[]});seen.add(n)}});weeks.sort((a,b)=>a.week-b.week);populateFilters();render()}catch(e){weekList.innerHTML='<div class="empty-state"><h3>Course library could not load</h3><p>The question data could not be fetched. Refresh once; if it persists, check the GitHub Pages deployment and the data files.</p><p><a class="text-link" href="questions/pixel-memory.html">Open image-memory question ↗</a></p><p><a class="text-link" href="questions/line-data-compression.html">Open line-compression question ↗</a></p><p><a class="text-link" href="questions/unit-representative-coefficients.html">Open unit-vector question ↗</a></p><p><a class="text-link" href="questions/projection-proxies-error.html">Open projection question ↗</a></p></div>';console.error(e)}}
  ["search","week-filter","topic-filter","category-filter","status-filter"].forEach(id=>$(id).addEventListener(id==="search"?"input":"change",render));
  $("clear-filters").addEventListener("click",()=>{$("search").value="";["week-filter","topic-filter","category-filter","status-filter"].forEach(id=>$(id).value="all");render()});
  $("recall-options").addEventListener("click",e=>{const b=e.target.closest("[data-answer]");if(!b)return;$("recall-options").querySelectorAll("button").forEach(x=>x.classList.toggle("selected",x===b));const ok=b.dataset.answer==="40 MB",f=$("recall-feedback");f.textContent=ok?"Correct: 1,000 × 100 × 100 × 4 = 40,000,000 bytes ≈ 40 MB (decimal units).":"Not quite. Find pixels per image first, then multiply by 4 bytes and by 1,000 images.";f.className="feedback "+(ok?"correct":"incorrect")});
  window.MLTRevision={isDone(id){return!!progress[id]},setDone(id,value){if(value)progress[id]=true;else delete progress[id];writeProgress();render()},getProgress(){return {...progress}}};init();
})();
