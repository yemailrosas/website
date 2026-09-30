(function(){
  'use strict';
  if (!window.L || !window.YR_PROJECTS) return;
  var el=document.getElementById('home-project-map'); if(!el)return;
  var projects=window.YR_PROJECTS.filter(function(p){return Number.isFinite(p.lat)&&Number.isFinite(p.lng);});
  var map=L.map(el,{scrollWheelZoom:false,zoomControl:true,attributionControl:true}).setView([33.95,-118.18],9);
  L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_442e_1_6897f77d4fd9cbf69fa1f0cb',{maxZoom:19,attribution:'&copy; OpenStreetMap &copy; CARTO'}).addTo(map);
  function pc(p){if(p.phases.indexOf('Construction')>=0)return 'construction';if(p.phases.indexOf('Development')>=0)return 'development';return 'design';}
  function icon(p){var t=p.projectType==='ADU'?'ADU':'⌂';return '<div class="map-marker '+pc(p)+'"><span>'+t+'</span></div>';};
  var bounds=[];projects.forEach(function(p){var m=L.marker([p.lat,p.lng],{icon:L.divIcon({className:'',html:icon(p),iconSize:[40,40],iconAnchor:[20,20]}),title:p.title}).addTo(map);m.bindPopup('<strong>'+p.title+'</strong><br><span>'+p.publicLocation+'</span><br><a href="gallery/#'+p.id+'">View project →</a>');bounds.push([p.lat,p.lng]);});
  if(bounds.length)map.fitBounds(bounds,{padding:[50,50],maxZoom:10});
})();