1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
185
186
187
188
189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220
221
222
223
224
225
226
227
228
229
230
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
262
263
264
265
266
267
268
269
270
271
272
273
274
275
276
277
278
279
280
281
282
283
284
285
286
287
288
289
290
291
292
293
294
295
296
297
298
299
300
301
302
303
304
305
306
307
308
309
310
311
312
313
314
315
316
317
318
319
320
321
322
//A legújabb openlayers formátumába át kéne írni a js-t.
 
//A proj műveletet egy zárt függvény csinálja.
 
// koordinátát írja ki az egér mozgatásra.
 
 
 
var myProjectionName = "EPSG:23700";
proj4.defs(
myProjectionName,
"+proj=somerc +lat_0=47.14439372222222 +lon_0=19.04857177777778 +k_0=0.99993 +x_0=650000 +y_0=200000 +ellps=GRS67 +towgs84=52.17,-71.82,-14.9,0,0,0,0 +units=m +no_defs "
);
var source = new proj4.Proj("EPSG:23700");
var dest = new proj4.Proj("EPSG:4326");
 
 
var osmLayer = new ol.layer.Tile({
          source: new ol.source.OSM(),
          opacity: 1,
         });
 
        var view = new ol.View({
          center: ol.proj.transform([19.3, 47.2], 'EPSG:4326', 'EPSG:3857'),
          zoom: 8
        });
 
        var map = new ol.Map({
          target: "map"
        });
 
        map.addLayer(osmLayer);
        map.setView(view);
 
 
//A gombra kattintás során elindul az átalakítás a beírt Polygon((x1 y1, x2 y2, x3 y3,....)) érték alapján
document.getElementById('gomb').addEventListener("click", alakito) /*   var value =  
  //Javítva getelementbyID-ra és addeventlistenerrel megoldva natív JS
 
/*--------------------------------------------------------------------------------*/
 
$("#uname").on("change keyup paste", function() {
});
$("#refresh").on("click", function() {
   /*var elem = document.getElementById('map');
 elem.parentNode.removeChild(elem);*/
   window.location.reload(true);
});
 
//$('[data-toggle="tooltip"]').tooltip().animate(fadeIn(1500));  //bootstrap tooltip js
$(".map").on('mousemove', function (e){
            str="Északi-szélesség: "+e.latlng.lat.toFixed(5)+" Keleti-hosszúság: "+e.latlng.lng.toFixed(5)+" Nagyítás szint: "+mymap.getZoom();
          $("#coord").html(str);
document.getElementById("#coord").innerHTML = str});
 
 
var url="https://raw.githubusercontent.com/endre88/eov_wkt_to_map_grid/master/telepulesek_WKT_no_geometry_full.json";
var $select = $('#telepulesek');
$.getJSON(url,//     https://api.myjson.com/bins/15sl2k     abc sorrendű json (http://novicelab.org/jsonabc/) https://api.myjson.com/bins/8ss1c
function (data) {
  $select.html('');
    var result = data.features;
        for (var i = 0; i < result.length; i++) {
           //console.log(result[i].properties);
           $select.append('<option id="'+result[i].properties.GEOM+ '">' +result[i].properties.NAME+'</option>');
          }
      });
 
function valogat(){ //geom kinyerése
   console.clear();
   var ch=document.getElementById("telepulesek").value
   console.log(ch);
    
   var url="https://raw.githubusercontent.com/endre88/eov_wkt_to_map_grid/master/telepulesek_WKT_no_geometry_full.json";
$.getJSON(url,//     https://api.myjson.com/bins/15sl2k     abc sorrendű json (http://novicelab.org/jsonabc/) https://api.myjson.com/bins/8ss1c
 function (data) {
   var geom="";
    var result = data.features;
        for (var i = 0; i < result.length; i++) {
           //console.log(result[i].properties);
           if (ch===result[i].properties.NAME){
           geom += result[i].properties.GEOM;}
          }
   document.getElementById("uname").value=geom;
   alakito();
   //$("#convert").html(geom);
      });
}
 
//szűrés kialakítása
function filter() {
    var keyword = document.getElementById("search").value;
    var fleet = document.getElementById("telepulesek");
    for (var i = 0; i < fleet.length; i++) {
        var txt = fleet.options[i].text;
        if (txt.substring(0, keyword.length).toLowerCase() !== keyword.toLowerCase() && keyword.trim() !== "") {
            fleet.options[i].style.display = 'none';
        } else {
            fleet.options[i].style.display = 'list-item';
        }
    }
}
 
function alakito(){
   var value = document.getElementById("uname").value;
   var s = value.replace(/\n/g, " ");
   var t = s.replace(/,/g, "\n");
   var z = t.substring(9, t.length - 2);
   console.log(s);
   console.log(z);
   var str = s.substring(9, s.length - 2);
   var coord1 = str.split(",");
   // for ciklus szétszedés
   for (var i = 0; i < coord1.length; i++) {
      coord1[i] = coord1[i].split(" ");
      console.log(coord1[i]); //új
   }
   var text = "";
   $("#convert").html(z);
   //POLYGON((493707.2 251150.2,493654 250833.8,493967.6 250822.6,494012.4 251060.6,493707.2 251150.2)) teszt WKT
   var ossz;
   var ossz1;
   var kis="";
   var nagy="";
   var s = "POLYGON((";
   for (var j = 0; j < coord1.length; j++) {
      nagy+= parseInt(coord1[j][0])+" ";
      console.log(nagy.substring(0, nagy.length-1));
      kis+= parseInt(coord1[j][1])+" ";
      console.log(kis.substring(0, kis.length-1));
        // text += coord1[i] + ","
      //text=array.push(coord1[i]);
      var p = new proj4.Point(
         parseFloat(coord1[j][0]),
         parseFloat(coord1[j][1])
      );
      var nagyarray=nagy.split(" ").map(Number);
      console.log(nagyarray);
      ossz=nagyarray.slice(0,nagyarray.length-1);
      console.log(ossz);
      var kisarray=kis.split(" ").map(Number);
      console.log(kisarray);
      ossz1=kisarray.slice(0,kisarray.length-1);
      console.log(ossz1);
         proj4.transform(source, dest, p);
      s += "," + p.x + " " + p.y;
   }
   s += "))";
   var f=Math.max.apply(null,ossz); //új
   var g=Math.max.apply(null,ossz1); //új
   var h=Math.min.apply(null,ossz); //új
   var i=Math.min.apply(null,ossz1); //új
   var kknagy=(f+h)/2;
   var kkkis=(g+i)/2;
   var kk = new proj4.Point(
         parseFloat(kknagy),
         parseFloat(kkkis)
   );
   proj4.transform(source, dest, kk);
   var kkk="";   
   kkk+= kk.x +"," +kk.y;
   console.log(kkk);
   var wkt = s.replace(",", "");
   console.log(wkt);
    
   //polygon hozzáadása a már meglévő térképhez
   var format = new ol.format.WKT();
   var feature = format.readFeature(wkt, { //wkt input
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857"
   });
   var hun = [kk.x, kk.y];
   console.log(hun);
   var countryStyle = new ol.style.Style({
        fill: new ol.style.Fill({
          color: [Math.floor((Math.random() * 254) + 1), Math.floor((Math.random() * 254) + 1), Math.floor((Math.random() * 254) + 1), 0.5]
        }),
      stroke: new ol.style.Stroke({
          color: [Math.floor((Math.random() * 254) + 1), Math.floor((Math.random() * 254) + 1), Math.floor((Math.random() * 254) + 1), 1],
          width: 3
      })
      });
   var hunweb = ol.proj.fromLonLat(hun);
   var vector = new ol.layer.Vector({
      source: new ol.source.Vector({
         features: [feature],
         target: "map"
      }),
      style: countryStyle
   });
     var view2= new ol.View({
          center: hunweb,
          zoom: 12
     });
    
   map.addLayer(vector);
   map.setView(view2);
}
 
 
/*
   var source2 = new VectorSource({wrapX: false});
   var vector2 = new VectorLayer({
        source: source2
      });
    
      var typeSelect = document.getElementById('type');
 
      var draw; // global so we can remove it later
      function addInteraction() {
        var value = typeSelect.value;
        if (value !== 'None') {
          draw = new Draw({
            source: source2,
            type: typeSelect.value
          });
          map.addInteraction(draw);
        }
      }
 
 
      /**
       * Handle change event.
        
      typeSelect.onchange = function() {
        map.removeInteraction(draw);
        addInteraction();
      };
 
      addInteraction();
*/
/*Átírni sima js-be addeventlistenerekkel
Jobb oldali menük beúszása*/
 
 
$( document ).ready(function() {
 
 
function toleft1(){
   $(".filter").animate({"right":"0px"},{duration:1000})
   $("#searching").animate({"right":"160px"},{duration:1000});
   $('#toleft2').attr('data-click-state', 0);
   $("#search").animate({"right":"0px"},{duration:1000})
 
}
function toleftdone(){
   $(".filter").animate({"right":"-165px"},{duration:1000})
   $("#searching").animate({"right":"0px"},{duration:1000})
   $("#filter").css({"display":"none"});
   $("#telepulesek").css({"display":"none"});
   $('#search').val('');
}
function toleft2(){
   $("#EOV").animate({"right":"-450px"},{duration:1000})
   $("#gombok").animate({"right":"-450px"},{duration:1000})
   $("#e-k").animate({"right":"-450px"},{duration:1000})
   $("#EOV_slide").animate({"right":"0px"},{duration:1000});
   $('#toleft').attr('data-click-state', 0);
 
}
function toleft2done(){
   $("#EOV").animate({"right":"0px"},{duration:1000})
   $("#e-k").animate({"right":"0px"},{duration:1000})
   $("#gombok").animate({"right":"75px"},{duration:1000})
   $("#EOV_slide").animate({"right":"280px"},{duration:1000})
   }
    
$("#toleft").on('click',function(){/*Települése kereső funkciói*/
   if($(this).attr('data-click-state') == 1) {
      $(this).attr('data-click-state', 0)
      toleft1();
      /*document.querySelector("#search").focus();*/
      $("#search").css({"position":"absolute"});
      $("#search").css({"position":"absolute"});
 
 
   }
   else {
   $(this).attr('data-click-state', 1)
      toleftdone();
   }
});
 
 
    
$("#toleft2").on('click',function(){
    
   if($(this).attr('data-click-state') == 1) {
      $(this).attr('data-click-state', 0)
      /*$(#toleft2).attr('data-click-state', 0)*/
      toleft2();
   }
   else {
      $(this).attr('data-click-state', 1)
      toleft2done();
   }
});
 
    
    
    
    
$("#search").on('change keyup paste',function(){
   $("#valogat").css({"display":"block"});
});
 
    
$("#search").on('change keyup paste',function(){
   $("#valogat").css({"display":"block"});
   $("#telepulesek").css({"display":"block"});
     
});
$("#telepulesek").on('change keyup paste',function(){
   $("#filter").css({"display":"block"});
});   
    
    
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});
    
});
