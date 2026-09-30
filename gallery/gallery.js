(function(){
  'use strict';
  var projects=(window.YR_PROJECTS||[]).slice();
  var state={status:'all',phase:'all',type:'all',scope:'all'};
  var map,markers=[];

  function phaseClass(p){
    if(p.phases.indexOf('Construction')>=0)return 'construction';
    if(p.phases.indexOf('Development')>=0)return 'development';
    return 'design';
  }
  function typeIcon(p){
    return p.projectType==='ADU'?'ADU':(p.projectType==='Multi-Family'?'MF':'⌂');
  }
  function matches(p){
    return (state.status==='all'||p.status===state.status) &&
           (state.phase==='all'||p.phases.indexOf(state.phase)>=0) &&
           (state.type==='all'||p.projectType===state.type) &&
           (state.scope==='all'||p.scope.indexOf(state.scope)>=0);
  }
  function pills(p){
    return [p.status,p.projectType].concat(p.phases).concat(p.scope).map(function(x){
      return '<span class="tag-pill">'+x+'</span>';
    }).join('');
  }
  function visual(p,cls){
    if(p.image){
      return '<img class="'+cls+'" src="'+p.image+'" alt="'+p.title+'" loading="lazy">';
    }
    return '<div class="'+cls+' project-placeholder"><span>'+p.projectNumber+'</span><strong>'+p.projectType+'</strong></div>';
  }
  function projectAction(p){
    return p.page ? '<a class="project-link" href="'+p.page+'">View project →</a>' : '<span class="project-link project-link-muted">Active project</span>';
  }
  function selected(p){
    var card=document.getElementById(p.id);
    if(!card)return;

    document.querySelectorAll('.gallery-card.map-selected').forEach(function(c){
      c.classList.remove('map-selected');
    });

    card.classList.add('map-selected');
    card.scrollIntoView({behavior:'smooth',block:'center'});

    window.setTimeout(function(){
      card.classList.remove('map-selected');
    },2200);
  }
  function cards(){
    var e=document.getElementById('gallery-grid'),f=projects.filter(matches);
    e.innerHTML=f.map(function(p){
      return '<article class="gallery-card" id="'+p.id+'">'+visual(p,'gallery-card-visual')+
        '<div class="gallery-card-body"><span class="gallery-city">'+p.publicLocation+'</span>'+
        '<span class="project-number">'+p.projectNumber+'</span><h3>'+p.title+'</h3>'+
        '<div class="card-tags">'+pills(p)+'</div>'+projectAction(p)+'</div></article>';
    }).join('');
    document.getElementById('project-count').textContent=f.length+' project'+(f.length===1?'':'s');
  }
  function markersRender(){
    markers.forEach(function(m){map.removeLayer(m.marker)});markers=[];
    var b=[];
    projects.filter(matches).forEach(function(p){
      if(!Number.isFinite(p.lat)||!Number.isFinite(p.lng))return;
      var m=L.marker([p.lat,p.lng],{
        icon:L.divIcon({className:'',html:'<div class="map-marker '+phaseClass(p)+'"><span>'+typeIcon(p)+'</span></div>',iconSize:[40,40],iconAnchor:[20,20]}),
        title:p.title
      }).addTo(map);
      m.on('click',function(){selected(p)});
      markers.push({project:p,marker:m});
      b.push([p.lat,p.lng]);
    });
    if(b.length)map.fitBounds(b,{padding:[48,48],maxZoom:10});
  }
  function apply(){cards();if(map)markersRender();}

  document.querySelectorAll('.filter-row').forEach(function(r){
    r.querySelectorAll('.gallery-filter').forEach(function(bt){
      bt.addEventListener('click',function(){
        r.querySelectorAll('.gallery-filter').forEach(function(b){b.classList.toggle('active',b===bt)});
        state[r.dataset.group]=bt.dataset.value;
        apply();
      });
    });
  });

  var q=new URLSearchParams(location.search),aliases={
    'active':'Active','completed':'Completed',
    'single-family':'Single-Family Residence','adu':'ADU','multi-family':'Multi-Family',
    'new-construction':'New Construction','addition':'Addition','remodel':'Remodel','conversion':'Conversion','reconstruction':'Reconstruction'
  };
  function activate(group,value){
    if(!value)return;
    var r=document.querySelector('.filter-row[data-group="'+group+'"]');if(!r)return;
    var bt=[].slice.call(r.querySelectorAll('.gallery-filter')).find(function(b){return b.dataset.value===value});
    if(bt){r.querySelectorAll('.gallery-filter').forEach(function(b){b.classList.toggle('active',b===bt)});state[group]=value;}
  }
  activate('status',aliases[q.get('status')]);
  activate('type',aliases[q.get('type')]);
  activate('scope',aliases[q.get('scope')]);

  if(window.L){
    map=L.map('gallery-map',{scrollWheelZoom:false,zoomControl:true,attributionControl:true}).setView([33.95,-118.18],9);
    L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_442e_1_6897f77d4fd9cbf69fa1f0cb',{
      maxZoom:19,attribution:'&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);
  }
  apply();
})();
