


window.addEventListener('load',function(){
	const DEFAULT_SCALE_DELTA = 1.1;
	const MIN_SCALE = 0.25;
	const MAX_SCALE = 10.0;
	const DEFAULT_SCALE_VALUE = "auto";
	var isHighlighting = false;
	var highlightColor = '255,255,0';
	var annotations = [];
	var pdfName = '';
	var _viewMark = '';
	var selectAnnotate = null;
	var rangesDom = [];
	var selectColor = 'rgba(0,0,255,0.3)';
	var interval=null;
	var waitPdfId ='';
	var coordinates=[];
    var viewPoints=[];
	var doCreateRect = false;
	var _dragAnnotate = null;

	var mdId='';

	var isTempHighlight = false;

	var drag = false,startX=0,startY=0,dx=0,dy=0;
	var rectDom = null;
    var textLayer=null;
	var top = 0 ,bottom =0;

	var path="",basename='',mdPath='';

    var setTime = null;
    var openProtocol = null;
    var firstExport=1;
    var isMobile = false;
    var isFirst = true;
    var imageFolder = '';

	var pdfFactory = null;

	var useOldVersion = false;

    var cacheRects = null , cacheRect = null,cacheOst = null ,cacheCoordinates = null , cacheText='',cacheTime = null;

	var  language = '';

	var locale = {
		'zh-cn':{
			'page':'页'
		},
		'zn':{
			'page':'Page'
		}
	};


	function stringToRaw(text){
		let out = [];
		for (let c of text) {
		  c = c.charCodeAt(0);
		  out.push(String.fromCharCode(c >> 8));
		  out.push(String.fromCharCode(c & 0xFF));
		}
		return 'þÿ' + out.join('');
	  }
	
	
	Element.prototype.hasClass = function (str) {
		return this.classList.contains(str);
	}
	
	let annotateResizeIcon = '<svg t="1629004332697"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3111" width="16" height="16"><path d="M914.56 463.78z m-110.53 0q0 30.34 14.63 55.81 14.63 25.46 40.63 40.09 26 14.63 54.72 14.63t55.26-14.63q26.55-14.63 40.63-40.09 14.09-25.47 14.09-55.27 0-29.8-14.09-55.27-14.08-25.46-40.63-40.63-26.55-15.17-55.26-15.17-28.72 0-54.72 15.17t-40.63 40.63q-14.63 25.47-14.63 54.73z m110.53 358.67z m-110.53 0q0 29.26 14.63 54.72 14.63 25.47 40.63 40.63 26 15.17 54.72 15.17t55.26-15.17q26.55-15.17 40.63-40.63 14.09-25.46 14.09-55.26 0-29.8-14.09-54.73-14.08-24.92-40.63-39.55Q942.72 713 914.01 713q-28.72 0-54.72 14.63t-40.63 39.55q-14.63 24.93-14.63 55.27z m-284.99 0z m-109.44 0q0 46.6 30.88 78.02 30.88 31.42 78.55 32.51 46.6-1.09 78.03-32.51 31.42-31.42 32.5-78.02-1.08-47.68-32.5-78.56-31.43-30.88-78.03-30.88-47.67 0-78.55 30.88-30.88 30.88-30.88 78.56z m109.44-358.67z m-109.44 0q0 47.68 30.88 78.56 30.88 30.88 78.55 31.97 46.6-1.09 78.03-31.97 31.42-30.88 32.5-78.56-1.08-46.59-32.5-77.47-31.43-30.88-78.03-33.06-47.67 2.17-78.55 33.06-30.88 30.88-30.88 77.47z m504.96-353.25z m-110.53 0q0 29.25 14.63 54.72t40.63 40.63q26 15.17 54.72 15.17t55.26-15.17q26.55-15.17 40.63-40.63 14.09-25.47 14.09-55.26 0-29.8-14.09-54.72-14.08-24.93-40.63-40.09Q942.72 0.01 914.01 0.01q-28.72 0-54.72 15.17t-40.63 40.09q-14.63 24.92-14.63 55.27zM109.44 822.45zM0 822.45q1.08 29.26 15.17 54.72 14.09 25.47 40.09 40.63 26 15.17 54.72 15.17t55.27-15.17q26.55-15.17 40.63-40.63 14.09-25.46 15.17-54.72-2.16-47.68-33.05-78.56-30.88-30.88-78.56-30.88-46.59 0-77.47 30.88Q1.09 774.77 0.01 822.45z" p-id="3112"></path></svg>';
    let annotateCommentIcon = '<svg t="1632228228676"  viewBox="0 0 1214 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15810" width="12" height="12"><path d="M964.352982 196.442274H250.01744A53.575166 53.575166 0 0 0 196.442274 250.01744v339.309382A53.575166 53.575166 0 0 0 250.01744 642.901988h214.300663l117.508196 117.508197a35.716777 35.716777 0 0 0 50.717824 0L750.052319 642.901988h214.300663a53.575166 53.575166 0 0 0 53.575166-53.575166V250.01744A53.575166 53.575166 0 0 0 964.352982 196.442274z" fill="#FFC824" p-id="15811"></path><path d="M607.185211 477.53331a35.716777 35.716777 0 0 1-35.716777-35.716777v-53.575166a35.716777 35.716777 0 1 1 71.433554 0v53.575166a35.716777 35.716777 0 0 1-35.716777 35.716777zM383.955354 477.53331a35.716777 35.716777 0 0 1-35.716777-35.716777v-53.575166a35.716777 35.716777 0 1 1 71.433554 0v53.575166a35.716777 35.716777 0 0 1-35.716777 35.716777zM830.415068 477.53331a35.716777 35.716777 0 0 1-35.716777-35.716777v-53.575166a35.716777 35.716777 0 1 1 71.433554 0v53.575166a35.716777 35.716777 0 0 1-35.716777 35.716777zM361.453784 71.433554h-17.858388a35.716777 35.716777 0 0 1 0-71.433554h17.858388a35.716777 35.716777 0 0 1 0 71.433554z" fill="#6B400D" p-id="15812"></path><path d="M607.185211 1024a107.150331 107.150331 0 0 1-75.719567-31.430764l-153.224974-153.224974H142.867108a142.867108 142.867108 0 0 1-142.867108-142.867108V142.867108a142.867108 142.867108 0 0 1 142.867108-142.867108h53.575166a35.716777 35.716777 0 0 1 0 71.433554H142.867108a71.433554 71.433554 0 0 0-71.433554 71.433554v553.610046a71.433554 71.433554 0 0 0 71.433554 71.433554h250.01744a35.716777 35.716777 0 0 1 25.358912 10.357865l163.582839 163.940007a35.716777 35.716777 0 0 0 50.717824 0l163.582839-163.940007a35.716777 35.716777 0 0 1 25.358912-10.357865h250.01744a71.433554 71.433554 0 0 0 71.433554-71.433554V142.867108a71.433554 71.433554 0 0 0-71.433554-71.433554H535.751657a35.716777 35.716777 0 0 1 0-71.433554h535.751657a142.867108 142.867108 0 0 1 142.867108 142.867108v553.610046a142.867108 142.867108 0 0 1-142.867108 142.867108h-235.373562l-153.224973 153.224974a107.150331 107.150331 0 0 1-75.719568 31.430764z" fill="#6B400D" p-id="15813"></path></svg>'

	var toggleDom = document.querySelector('.icon-toggle');
	var siderDom = document.querySelector('.viewerSider');
	var zoomInDom = document.querySelector('.icon-zoomIn');
	var zoomOutDom = document.querySelector('.icon-zoomOut');
	var annotateMenu = document.querySelector('.annotate-menu');
	var annotateContainerDom = document.querySelector('.viewerSiderAnnotate');
	var createImageDom = document.querySelector('.icon-createImage');
	var infoDom = document.querySelector('.icon-info');

	let pdfContainer = document.getElementById('viewerContainer');

	var addNoteDom = document.querySelector('.add-comment');

	var textareaDom = addNoteDom.querySelector('textarea');
	


	// zoomInDom.onclick=()=>{
	// 	var ticks = 1;
	// 	let newScale = pdfViewer.currentScale;
	// 	var left = pdfContainer.scrollLeft;
	// 	var top = pdfContainer.scrollTop;
	// 	do {
	// 	  newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
	// 	  newScale = Math.ceil(newScale * 10) / 10;
	// 	  newScale = Math.min(MAX_SCALE, newScale);
	// 	} while (--ticks && newScale < MAX_SCALE);
	// 	pdfViewer.currentScaleValue = newScale;
	// 	setTimeout(()=>{
	// 		pdfContainer.scrollTop = top;
	// 		pdfContainer.scrollLeft = left;
	// 	},0)
	// }

	// zoomOutDom.onclick=()=>{
	// 	var ticks = 1;
	// 	let newScale = pdfViewer.currentScale;
	// 	do {
	// 	newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
	// 	newScale = Math.floor(newScale * 10) / 10;
	// 	newScale = Math.max(MIN_SCALE, newScale);
	// 	} while (--ticks && newScale > MIN_SCALE);
	// 	pdfViewer.currentScaleValue = newScale;
	// }

	// toggleDom.onclick = ()=>{
	// 	 if(!siderDom.style.display||siderDom.style.display=='none'){
	// 		siderDom.style.display = 'flex'
	// 	 }else{
	// 		 siderDom.style.display = 'none'
	// 	 }
	// }


	$('body').on('click','#viewThumbnail',function(){
        $('.viewerSiderAnnotate').addClass('hidden');
		$('#thumbnailView').removeClass('hidden');
		$('#outlineView').addClass('hidden');

		$('#showAnnotation').removeClass('toggled');
	});


	$('body').on('click','#viewOutline',function(){
		$('.viewerSiderAnnotate').addClass('hidden');
		$('#thumbnailView').addClass('hidden');
		$('#outlineView').removeClass('hidden');

		$('#showAnnotation').removeClass('toggled');
	});

	$('body').on('click','#showAnnotation',function(){
		$('.viewerSiderAnnotate').removeClass('hidden');
		$('#thumbnailView').addClass('hidden');
		$('#outlineView').addClass('hidden');

		$('#viewThumbnail').removeClass('toggled');
		$('#viewOutline').removeClass('toggled');
		$(this).addClass('toggled');

		createSiderAnnotations();

	});

	annotateMenu.onclick = (evt)=>{
		var button = evt.target.closest('.annoate-btn');
		if(!button) return;
		var title = button.getAttribute('title');
	
		if(title == 'highlight'){
			highlightColor = button.getAttribute('data-color');
			if(selectAnnotate){
                var id = selectAnnotate.getAttribute('data-id');
				document.querySelectorAll(`.mm-highlight[data-id="${id}"]`).forEach(ele=>{
					if(ele){
						 ele.style.backgroundColor=`rgb(${highlightColor})`;
					}
				});

				annotations.forEach(an=>{
					if(an.id==id){
						var data = JSON.parse(an.text);
						var hcolor = highlightColor.split(',');
						data.color = {
							r:hcolor[0],
							g:hcolor[1],
							b:hcolor[2]
						}
						an.text = JSON.stringify(data)
					}
				});

				saveAnnotations();
			}else{
                 createHighlight();
			}
		}else if(title=='comment'){

		}else if(title=='delete annotate'){
           if(selectAnnotate){
			deleteAnnotate();
		   }
		}else if(title=='copy text'){

			if(selectAnnotate){
				var type = selectAnnotate.getAttribute('data-type');
				var text = '';
				if(type=='highlight'){
					text = selectAnnotate.getAttribute('data-text');
				}
			}else{
				if(useOldVersion||isTempHighlight){
					var text = pointerDownPositionRef.selectText;
				}else{
					var text =selectionRangesRef.current[0].text;
				}
			}

			window.parent.postMessage({
                     type:'copyText',
					 text:text,
					 _viewMark:_viewMark
			},'*');

			pointerDownPositionRef = {};
			selectionRangesRef={}
			if(rangesDom.length){
				rangesDom.forEach(dom=>{
					if(dom.parentElement){
						dom.parentElement.removeChild(dom);
					}
				});
				rangesDom = [];
			}
          
		}else if(title=='add note'){
			if(evt.touches){
				var x = evt.touches[0].pageX;
				var y = evt.touches[0].pageY;
			}else{
				var x = evt.pageX;
				var y = evt.pageY;
			}

			addNoteDom.style.left=`${x - 20}px`;
			addNoteDom.style.top=`${y}px`;
			addNoteDom.style.display=`block`;
			addNoteDom.selectId = selectAnnotate.getAttribute('data-id');

			annotations.forEach(an=>{
				if(an.id==addNoteDom.selectId){
					var data = JSON.parse(an.text);
				    if(data.contents){
						textareaDom.value=data.contents;
					}
				}
			});
			
		}

		annotateMenu.style.display='none';
	
		selectAnnotate = null;
		isHighlighting = false;

		rangesDom=[];
	};




	createImageDom.onclick = () =>{
		doCreateRect = !doCreateRect;

	};

	document.onkeydown=function(e){
		var altKey = e.altKey;
		var ctrlKey = e.ctrlKey||e.metaKey;
		if(altKey&&(e.key=='y'||e.key=='Y')){
			//highlight({r:247,g:255,b:0});
			highlightColor = '247,255,0';
			createHighlight()
		}
  
		if(altKey&&(e.key=='g'||e.key=='G')){
		  //highlight({r:125,g:240,b:102});
		  highlightColor = '125,240,102';
		  createHighlight()
		}
  
		if(altKey&&(e.key=='b'||e.key=='B')){
		  //highlight({r:143,g:222,b:249});
		  highlightColor = '143,222,249';
		  createHighlight()
		}
  
		if(altKey&&(e.key=='p'||e.key=='P')){
		 // highlight({r:247,g:153,b:209});
		  highlightColor = '247,153,209';
		  createHighlight()
		}
  
		if(altKey&&(e.key=='r'||e.key=='R')){
		 // highlight({r:253,g:73,b:73});
		  highlightColor = '253,73,73';
		  createHighlight()
		}

		if(altKey&&(e.key=='i'||e.key=='I')){
			doCreateRect = !doCreateRect;
		}

		if(ctrlKey&&(e.key=='c'||e.key=='C')){
			var btn = document.querySelector('.annoate-btn.copy');
		   if(btn){
			 btn.click();
		   }
		}

		var key =e.key.toLowerCase();
		if(altKey&&(key=='delete'||key=='backspace')){
		   var btn = document.querySelector('.annoate-btn.delete');
		   if(btn){
			 btn.click();
		   }
		}

	
  
	  }


	annotateContainerDom.onclick=(evt)=>{
         var annotateItemDom = evt.target.closest('.annotate-item');
		 if(annotateItemDom){
			   var id = annotateItemDom.getAttribute('data-id');
			   var annoatateItem = document.querySelector('.annotate-item.active');
			   
			   if(annoatateItem){
				   if(evt.target.closest('.annotate-item-note')){
					   return;
				   }
				   annoatateItem.classList.remove('active');
				   annoatateItem.querySelector('.annotate-item-note').blur();
				   annoatateItem.querySelector('.annotate-item-note').setAttribute('contenteditable',false);
				  
			   }

			   var dom  = document.querySelector(`.annotate-item[data-id="${id}"]`);
			   if(dom){
				   dom.classList.add('active');
			   }
			    dom.querySelector('.annotate-item-note').setAttribute('contenteditable',true);
			    annotateMenu.style.display='none';
				addNoteDom.style.display="none";
				selectAnnotate = null;
				isHighlighting = false;

				rangesDom=[];
				selectionRangesRef = {};

			    showAnnotate(id);
		 }
	}


	window.addEventListener('message',function(e){
		 switch (e.data.type){
		   case 'openPDF':
			 if(e.data._viewMark){
			   _viewMark = e.data._viewMark;
			 }

			 try{
				path = e.data.pdfName;
				basename = e.data.basename;
				annotations = e.data.annotations;
				openProtocol = e.data.openProtocol;
				waitPdfId = e.data.id;
				isMobile = e.data.isMobile;
				mdPath = e.data.mdPath;
				imageFolder = e.data.imageFolder;
				language = e.data.language;
				mdId=e.data.mdId;


				
				if(e.data.top){
					top = e.data.top;
				}

				if(e.data.bottom){
					top = e.data.bottom;
				}

				createSiderAnnotations();
			 
				if(isFirst){
				  if(isMobile){
 
					pdfContainer.addEventListener('touchstart',handlePointerDown);
					pdfContainer.addEventListener('touchmove',handlePointerMove);
					pdfContainer.addEventListener('touchend',handlePointerUp);
					
					pdfContainer.addEventListener('mousedown',handlePointerDown);
					pdfContainer.addEventListener('mousemove',handlePointerMove);
					pdfContainer.addEventListener('mouseup',handlePointerUp);
 
				  }else{
 
					pdfContainer.addEventListener('mousedown',handlePointerDown);
					pdfContainer.addEventListener('mousemove',handlePointerMove);
					pdfContainer.addEventListener('mouseup',handlePointerUp);
 
				  }
 
				  isFirst = false;
				}
 
					 setTimeout(function(){  
					//	alert(PDFViewerApplication);  

						 if(!PDFViewerApplication){
							// alert('miss pdf');
						   return
						 }
						 PDFViewerApplication.open(e.data.data).then(()=>{
                            try{
								window.pdfViewer = PDFViewerApplication.pdfViewer;
								window.extractor  = new Extractor(pdfViewer);
								pdfViewer._currentPage = 1;
								
								PDFViewerApplication.pdfDocument.getData().then((d) => {
									if(!isMobile){
										pdfFactory = new pdfAnnotate.AnnotationFactory(d);
									}
									 pdfViewer.currentScaleValue = 'page-width';
								});
								if(e.data.id){
								  showAnnotate(e.data.id)
								}
   
							//	alert('open pdf');

							}catch(err){
								//alert(err);
							}
							
						 }).catch(function(err){
                            // alert(err);
						 })
 
						 PDFViewerApplication.eventBus.on('pagerendered', pageRender);
 
					 },1000);
			   }catch(err){
                    //alert(err);
			   }

			


			   break;
			 case 'closePDF':
	 
			 
			   break;
			 case 'showAnnotate':
			   showAnnotate(e.data.id);
			   break;
			 case 'exportAnnotatePDF':
			   var pageDom = document.querySelector('#viewer .page');
			   var pageWidth = pageDom.clientWidth;
			   var num=0;
		
			   var st = +new Date();
			   var pdfData=null
		   
			   setTimeout(()=>{
				  annotations.forEach(row=>{
						 var json = JSON.parse(row.text);
						 if(!pdfFactory){
							  return;
						 }
						 if(firstExport != 1){
						   pdfFactory.deleteAnnotation(json.id);
						 }

						 var rects =json.relateRect;
						 //console.log(rects);
					
						 var data={
							 page:json.page,
							 rect:json.rect,
							 contents:stringToRaw(json.contents||''),
							 author:'',
							 color:json.color,
							 opacity: 0.8,
							 id:json.id,
							 quadPoints:[],
							 fill:'',
							 font:'Noto Sans CJK SC Medium'
						 }
 
						 rects.forEach((rect)=>{
							   var x =parseInt(rect.x*pageWidth+'');
							   var y = parseInt(rect.y*pageWidth+'');
							   var w = parseInt(rect.width*pageWidth+'');
							   var h = parseInt(rect.height*pageWidth+'');
							   let xy = pdfViewer._pages[json.page].viewport.convertToPdfPoint(x, y);
							   var x2 = xy[0];
							   var y2 = xy[1];
							   let xy1 = pdfViewer._pages[json.page].viewport.convertToPdfPoint(x+w, y+h);
							   var x1 = xy1[0];
							   var y1 = xy1[1];
							   var x0 = x2;
							   var y0 = y1;
							   var x3 = x1;
							   var y3 = y2;
 
							   data.quadPoints.push(x0,y0,x1,y1,x2,y2,x3,y3);
 
						 })
 
						 if(row.type =='highlight'){
							 if(!data.rect){
								 data.rect =  data.quadPoints.slice(0,4);
							 }
							if(data.rect.length<4) return;
							 pdfFactory.createHighlightAnnotation(data);
						 }else{
							data.fill = json.color;
							data.opacity = 0.3;
							if(data.quadPoints.length){
							  data.rect=[data.quadPoints[2],data.quadPoints[3],data.quadPoints[4],data.quadPoints[5]];
							  pdfFactory.createSquareAnnotation(data);
							}
						 }
				 });
 
				var et = +new Date();
 
				pdfData=pdfFactory.write();
				firstExport++;
			
				setTimeout(function(){
				   window.parent.postMessage({
					 type:'exportAnnotatePDF',
					 pdfData:pdfData,
					 _viewMark:_viewMark
				   },"*")
 
				 },200)
 
 
			   },200);
			   break
 
			   case 'getAnnotations':
				 if(pdfFactory){
					  pdfFactory.getAnnotations().then(res=>{
							  window.parent.postMessage({
							   type:"gteAnnotations",
							   _viewMark:_viewMark,
							},"*");
					  });
				 }
				 break;
		
                 case 'saveImagePath':

				   var id = e.data.id;
				   var imagePath = e.data.imagePath;
				   annotations.forEach(an=>{
					   if(an.id==id){
						   var data = JSON.parse(an.text);
						   data.imageAbsolutePath = imagePath;
						   an.text = JSON.stringify(data);
					   }
				   });

				   saveAnnotations();
				   break;
				case 'useOldVersion':
					useOldVersion = true;
					break;
				case 'useNewVersion':
					useOldVersion = false;
					break;
		 }
	 },false);
 



	var colorObject = {
		'yellow':'247,255,0',
		'green':'125,240,102',
		'blue':'143,222,249',
		'pink':'247,153,209',
		'red':'253,73,73'
	};


   var flag = false;

   function handlePointerDown(event) {
	   var target = event.target;

	if(target.hasClass('comment-bar')||target.closest('.comment-bar')){
		if(target.hasClass('comment-bar')){
		   var title = target.getAttribute('data-title');
		}else{
		  var title = target.closest('.comment-bar').getAttribute('data-title');
		}

		var annotateDom = target.closest('.annotate');
		if(annotateDom){
		   var left = parseInt(annotateDom.style.left);
		   var top = parseInt(annotateDom.style.top);
		   var height = parseInt(annotateDom.clientHeight);

		   var pageDom = target.closest('.page');

		   var commentDom = document.createElement('div');
		   commentDom.classList.add('annotate-comment');

		   commentDom.style.left = left +'px';
		   commentDom.style.top = top +height +10 +'px';
		   commentDom.style.minWidth = '100px';
		   commentDom.style.minHeight = '80px';

		   commentDom.style.position = 'absolute';
		   commentDom.style.padding = '10px';
		   commentDom.style.zIndex = 200;
		   commentDom.style.backgroundColor = 'rgb(242 253 184)';
		   commentDom.style.color='#333';
		   commentDom.innerText = title||'';
		  // textLayer.appendChild(commentDom);
		   commentDom.style.paddingTop="4px";
		   pageDom.appendChild(commentDom);
		   var closeBtn = document.createElement('span');
		   closeBtn.innerText="X";
		   closeBtn.style.float="right";
		   closeBtn.style.position="absolute";
		   closeBtn.style.color="red";
		   closeBtn.style.right="10px";
		   closeBtn.style.top="10px";
		   closeBtn.style.fontSize="12px";
		   closeBtn.style.cursor="pointer";
		   commentDom.appendChild(closeBtn);

		   closeBtn.onclick=function(){
			  closeBtn.onclick=null;
			  pageDom.removeChild(commentDom);
			  commentDom.innerText='';
			  commentDom=null;
		   }
		} 
		return
   }

	flag = true;
	let position = pointerEventToPosition(event);
	if (!position) {
		return;
	}

	extractor.getSortIndex(position);


	handleLayerPointerDown(v2p(position), event);
}

var selectionRangesRef = {},pointerDownPositionRef={};


function setSelectionRangesRef(ranges) {
	//setSelectionPositions(ranges.filter(x => !x.collapsed).map(x => x.position));
	selectionRangesRef.current = ranges;
}


function handleLayerPointerDown  (position, event) {
	if(event.touches){
		startX = event.touches[0].pageX;
		startY = event.touches[0].pageY;
	   }else{
		startX = event.pageX;
		startY = event.pageY;
	   }
	if(event.target.closest('.page')){
		var pageDom = event.target.closest('.page');
		var number=pageDom.getAttribute('data-page-number');
		pdfViewer._currentPage=parseInt(number);
		textLayer = pageDom.querySelector('.textLayer');
	 }

	 pointerDownPositionRef.current = position;
	 pointerDownPositionRef.id='';

	 if(rangesDom.length){
		rangesDom.forEach(dom=>{
			if(dom.parentElement){
				dom.parentElement.removeChild(dom);
			}
		});

		selectionRangesRef = {};
		rangesDom= [];
	}

	
	
	document.querySelectorAll(`.annotate.active`).forEach(ele=>{
		if(ele){
			ele.classList.remove('active')
		}
	});
	

	selectAnnotate = null;
	isHighlighting = false;
	isTempHighlight = false;
	annotateMenu.style.display='none';
	addNoteDom.style.display="none";

	if(event.target.closest('.mm-highlight')){
		selectAnnotate = event.target.closest('.mm-highlight');
		var id = selectAnnotate.getAttribute('data-id');
		document.querySelectorAll(`.mm-highlight[data-id="${id}"]`).forEach(ele=>{
			if(ele){
				ele.classList.add('active')
			}
		});

		var annoatateItem = document.querySelector('.annotate-item.active');
		if(annoatateItem){
			annoatateItem.classList.remove('active');
		}

		var dom  = document.querySelector(`.annotate-item[data-id="${id}"]`);
		if(dom){
			dom.classList.add('active');
		}

		var d=null;

		 annotations.forEach(an=>{
			if(an.id==id){
              d = an;
			}
		});


		if(d){
			window.parent.postMessage({
				type:'showMindmapAnnotate',
				id:id,
				data:d,
				annotateType:d.type,
				mdId:mdId,
				_viewMark:_viewMark
			  },'*');
		}

	}


	if(!doCreateRect){
		coordinates=[];
		viewPoints=[];
   }

	if(event.target.hasClass('annotate-head')||event.target.hasClass('.annotate-resize')||event.target.closest('.annotate-resize')){
		var _annotate = event.target.closest('.annotate');
		if(event.target.hasClass('annotate-head')){
			var type = 'move'
		}else{
			var type = 'resize'
		}

		_dragAnnotate = {
			ele:_annotate,
			left:parseInt(_annotate.style.left),
			top:parseInt(_annotate.style.top),
			width:_annotate.clientWidth,
			height:_annotate.clientHeight,
			type:type
		}
		return
	}


	let ost = computePageOffset();

	if(isMobile){
	  var x =  startX - ost.left;
	  var y =  startY - ost.top;
	}else{
	  var x = event.pageX - ost.left;
	  var y = event.pageY - ost.top;
	}

	var left = x;
	var top = y;

	viewPoints.push(x);
	viewPoints.push(y);

	let x_y = pdfViewer._pages[pdfViewer._currentPage - 1].viewport.convertToPdfPoint(x, y)
	x = x_y[0];
	y = x_y[1];

	coordinates.push(x);
	coordinates.push(y);
	if (doCreateRect) {    
			  event.preventDefault();
			  drag =true; 
			  pdfContainer.style.cursor="pointer";
			  rectDom = document.createElement('div');
			  rectDom.classList.add('annotate');
			  rectDom.classList.add('mm-highlight');
		   
			  rectDom.setAttribute('data-type','rect');
			  rectDom.setAttribute('style',`position:absolute;background:#f9e9cc;left:${left - 2}px;top:${top - 2}px`)
		
			  var headDom =document.createElement('div');
			  headDom.classList.add('annotate-head');
			  rectDom.appendChild(headDom);

			  var resizeDom = document.createElement('div');
			  resizeDom.classList.add('annotate-resize');
			  rectDom.appendChild(resizeDom);
			  resizeDom.innerHTML=annotateResizeIcon;
			  if(textLayer.querySelector('annotateLayer-extend')){
				var annotateDom = textLayer.querySelector('annotateLayer-extend');
			 }else{
			   var annotateDom = document.createElement('div');
			   textLayer.appendChild(annotateDom);
			 }

			 annotateDom.appendChild(rectDom);
			
			 for(var i =0 ;i<textLayer.children.length;i++){
					var c = textLayer.children[i];
					if(c.style){
							c.style.userSelect='none';
							c.style.cursor="pointer"
					}
			 }
	  }
}


function handlePointerMove(event) {
	if(!flag){
		return
	}

	
	if(_dragAnnotate){
		event.preventDefault();
		if(event.touches){
		  dx =  event.touches[0].pageX - startX;
		  dy =  event.touches[0].pageY - startY;
		}else{
		  dx = event.pageX - startX;
		  dy = event.pageY - startY;
		}
		if(_dragAnnotate.type=='move'){
		  _dragAnnotate.ele.style.left = _dragAnnotate.left + dx + 'px'; 
		  _dragAnnotate.ele.style.top = _dragAnnotate.top + dy + 'px'; 
		}else{
		  _dragAnnotate.ele.style.width = _dragAnnotate.width + dx + 'px'; 
		  _dragAnnotate.ele.style.height = _dragAnnotate.height + dy + 'px'; 
		}
		return
	  }

	  if(drag && doCreateRect){
				event.preventDefault();
				if(event.touches){
					dx =  event.touches[0].pageX - startX;
					dy =  event.touches[0].pageY - startY;
				}else{
					dx = event.pageX - startX;
					dy = event.pageY - startY;
				}
				rectDom.style.width = dx - 2 +'px';
				rectDom.style.height = dy -2 +'px';
		return
	 }

	if(useOldVersion) return;

	let position = pointerEventToPosition(event);
	if (!position) {
		return;
	}

	handleLayerPointerMove(v2p(position), event);
}



function handleLayerPointerMove (position, event) {

	

	let viewer = document.getElementById('viewer');
		viewer.classList.remove('cursor-pointer');
		viewer.classList.remove('cursor-text');
		viewer.classList.remove('cursor-text-selecting');

	if (pointerDownPositionRef.current ) {
		if (selectionRangesRef.current&&selectionRangesRef.current.length) {
			let selectionRanges = getModifiedSelectionRanges(selectionRangesRef.current, position);
			setSelectionRangesRef(selectionRanges);
		}else {
			let selectionRanges = getSelectionRanges(pointerDownPositionRef.current, position);
			setSelectionRangesRef(selectionRanges);
		}
	}

	
	createSelectionEle(selectionRangesRef);
	deselect();
}

function deselect(){
	document.selection && document.selection.empty && ( document.selection.empty(), 1)
	|| window.getSelection && window.getSelection().removeAllRanges();
}



function createSelectionEle(range){

	if(rangesDom.length){
		rangesDom.forEach(dom=>{
			if(dom.parentElement){
				dom.parentElement.removeChild(dom);
			}
		});
		rangesDom = [];
	}
  

   if(range&&range.current&&range.current.length&&range.current[0].position){
	     range.current[0].position = p2v(range.current[0].position);
	    var rects = range.current[0].position.rects;
		range.current[0].position.rects.map(r=>{
			if(r[1]){
				r[1] = r[1] - top;
			}
			if(r[3]){
				r[3] = r[3] + bottom;
			}
		});
		var pageNumber = range.current[0].position.pageIndex + 1;
		var pageDom = pdfContainer.querySelector(`[data-page-number="${pageNumber}"]`);
		var textLayerDom = pageDom.querySelector('.textLayer');

		if(!textLayerDom){
           return;
		}

		if(textLayerDom.querySelector('.annotateLayer-extend')){
           var annoatetLayerDom = textLayerDom.querySelector('.annotateLayer-extend');
		}else{
			var annoatetLayerDom = document.createElement('div')
			annoatetLayerDom.classList.add('annotateLayer-extend');
			textLayerDom.appendChild(annoatetLayerDom)
		}

		var text = range.current[0].text;
		var id = uuid();
		range.current[0].id = id;
		if(rects&&rects.length){
			createRangeElement(rects,annoatetLayerDom,text,id)
		}
   }

}

function createRangeElement(rects,annoatetLayerDom,text,id){
	rects.forEach(rect=>{
		var ele = document.createElement('div');
		ele.classList.add('mm-highlight');
		ele.classList.add('annotate');
		ele.style.left = rect[0] + 'px';
		ele.style.top = rect[1] + 'px';
		ele.style.width = (rect[2] - rect[0]) + 'px';
		ele.style.height = (rect[3] - rect[1]) + 'px';
		ele.style.backgroundColor = `${selectColor}`;
		ele.setAttribute('data-text',text);
		ele.setAttribute('data-type','highlight');
		ele.setAttribute('data-id',id);
		rangesDom.push(ele);
		annoatetLayerDom.appendChild(ele);
  });
}


function handlePointerUp(event) {


	var pageDom = document.querySelector('#viewer .page');
    var pageWidth = pageDom.clientWidth;

    pdfContainer.style.cursor="auto";

     if(_dragAnnotate&&!doCreateRect){
        var id = _dragAnnotate.ele.getAttribute('data-id');
        var _imagePath = ''
        annotations.forEach((an)=>{
            if(an.id == id){
              var d = JSON.parse(an.text);
              an.width =_dragAnnotate.ele.clientWidth;
              an.height = _dragAnnotate.ele.clientHeight;
              var left = parseInt(_dragAnnotate.ele.style.left);
              var top = parseInt(_dragAnnotate.ele.style.top);
              _imagePath = d.path;
              var relateRect=[{
                x:(left/pageWidth),
                y:(top/pageWidth),
                width:(an.width/pageWidth),
                height:(an.height/pageWidth)
              }];
              d.relateRect = relateRect;
              an.text = JSON.stringify(d);
            }
        });

        _createImage(_imagePath,{
           left:parseInt(_dragAnnotate.ele.style.left),
           top: parseInt(_dragAnnotate.ele.style.top),
           width:_dragAnnotate.ele.clientWidth,
           height:_dragAnnotate.ele.clientHeight
        },false,textLayer,_dragAnnotate.ele,{id:id});


        _dragAnnotate = null;
		drag =false;
		flag = false;
        return
      }


      if(drag && doCreateRect){
            
        doCreateRect = false
		
        var data={
			id:uuid(),
			page: pdfViewer._currentPage - 1,
			rect: coordinates.slice(),
			contents: '',
			author: "",
			color: {r:249,g:233,b:204},
			opacity:1,
			path:'',
			relateRect:null,
			pdfName:path,
			pageWidth:pageWidth
        };
       

        var left = parseInt(rectDom.style.left);
        var top = parseInt(rectDom.style.top);
        var width = dx;
        var height = dy;

  
          var _t = +new Date();

          if(imageFolder){
              var imagePath = imageFolder+'/'+_t+'.png'
          }else{
            if(path.startsWith('file:')){
                 var  i = mdPath.lastIndexOf('/');
                 var route = mdPath.substr(0,i+1);
                 var imagePath = route+_t+'.png';
            }else{
                 var i = path.lastIndexOf('/');
                 var route = path.substr(0,i+1);
                 var imagePath = route+basename+'-'+_t+'.png';
            }
          }

          _createImage(imagePath,{
            left:left,
            top:top,
            width:width,
            height:height
          },true,textLayer,rectDom,data)
		}

		drag = false;
		flag = false;

		if(useOldVersion){
			calcSelections(event);
			deselect();
		}
		//console.log(123);
		// alert(123);
	    popupMenu(event);
}


function calcSelections(evt,flag){
	var selection=window.getSelection();
	if(selection.isCollapsed) return;
	var range = selection.getRangeAt(0);
    var rects = range.getClientRects();
	var selectText = '';
    var doms = range.cloneContents();
    for(var i = 0 ;i <doms.children.length;i++){
      selectText += doms.children[i].textContent+' ';
    }
    selectText = selectText.trim();

    if(!selectText){
      selectText=selection.toString();
    }

	rects = uniqueRects(rects);
	rects = getLines(rects);
	var ost = computePageOffset()

	var doms=[];
	rects.forEach(r=>{
		var x = r.x - ost.left;
		var y = r.y - ost.top;
		doms.push([x,y,x+r.width,y+r.height]);
	});


	var pageIndex = pointerDownPositionRef.current.pageIndex;
	pointerDownPositionRef.rects = doms;
	pointerDownPositionRef.id = uuid()
	pointerDownPositionRef.selectText = selectText;
	
	var pageNumber = pageIndex + 1;
	var pageDom = pdfContainer.querySelector(`[data-page-number="${pageNumber}"]`);
	var textLayerDom = pageDom.querySelector('.textLayer');

	if(!textLayerDom){
		return;
	 }

	 if(textLayerDom.querySelector('.annotateLayer-extend')){
		var annoatetLayerDom = textLayerDom.querySelector('.annotateLayer-extend');
	 }else{
		 var annoatetLayerDom = document.createElement('div')
		 annoatetLayerDom.classList.add('annotateLayer-extend');
		 textLayerDom.appendChild(annoatetLayerDom)
	 }

	 if(rangesDom.length){
		rangesDom.forEach(dom=>{
			if(dom.parentElement){
				dom.parentElement.removeChild(dom);
			}
		});
		rangesDom = [];
	}

	createRangeElement(doms,annoatetLayerDom,selectText,pointerDownPositionRef.id);

	if(flag){
        isTempHighlight = true;
	}
}


function uniqueRects(rects){
	var arr = [];
	for (let i = 0;i<rects.length;i++){
		  for (var j = i ;j<rects.length;j++){
			  if(i!=j){
				 var r1= rects[i];
				 var r2 =rects[j];
				 
				 if(r1.x<=r2.x&&r1.y<=r2.y&&r1.bottom>=r2.bottom&&r1.right>=r2.right){
					arr.push(j);
				 }
			  }
		  }
	}
	var a=[]
	if(arr.length){
	   for(let i =0 ;i<rects.length;i++){
		   if(arr.indexOf(i)==-1){
			   a.push(rects[i])
		   }
	   }
	   return a;
	}else{
	  return rects;
	}
	
  };
  
  function getLines(rects){
	var rows={
	  1:[rects[0]]
	};  //分行
	var line=1;
	var rowBottom = rects[0].bottom;
   
	for (var i=1;i<rects.length;i++){
		  if(!rows[line]){
			   rows[line]=[];
		  }
		  var h = rects[i].height;
		  if(rects[i].top< rowBottom && rects[i].bottom < rowBottom + h/3  ){
			  rows[line].push(rects[i]);
		  }else{
			line++;
			if(!rows[line]){
			   rows[line]=[];
			}
			rowBottom = rects[i].bottom;
			 rows[line].push(rects[i])
		  }
	}
  
	var rect = [];
  
	for (var k in rows){
		let x,y,bottom,right;
		rows[k].forEach((r,i)=>{
		  if(i==0){
			 x = r.x;
			 y=r.y;
			 bottom = r.bottom;
			 right = r.right
		  }else{
			  if(r.x<x){
				x=r.x
			  }
			   if(r.y<y){
				y=r.y
			  }
			  if(r.bottom>bottom){
				 bottom = r.bottom;
			  }
			  if(r.right>right){
				 right = r.right;
			  }
		  }
		});
  
		var d={
		  x:x,
		  y:y,
		  top:x,
		  left:y,
		  bottom:bottom,
		  right:right,
		  width:right - x,
		  height:bottom - y
		}
		rect.push(d)
  
	}
  
  
	return rect;
  
  }
  

function createHighlight(){
	var rs = [];
	if(useOldVersion||isTempHighlight){
		var rects = pointerDownPositionRef.rects;
		var selectText = pointerDownPositionRef.selectText;
		var id  = pointerDownPositionRef.id;
		var pageIndex = pointerDownPositionRef.current.pageIndex;
	}else{

		var rects = selectionRangesRef.current[0].position.rects;
		var selectText =selectionRangesRef.current[0].text;
		var id = selectionRangesRef.current[0].id;
		var pageIndex = selectionRangesRef.current[0].position.pageIndex;

	}

	if(!id) {
		return
	}
	rects.forEach(r=>{
	  rs.push({
		  x:r[0],
		  y:r[1],
		  width:r[2]-r[0],
		  height:r[3]-r[1]
	  })
	});
   var color=`rgb(${highlightColor})`
	rangesDom.forEach(ele=>{
		ele.style.backgroundColor = color
	});

	var hcolor = highlightColor.split(',');
	var pageWidth = document.querySelector('#viewer .page').clientWidth;

	rs = rs.map(r=>{
		return{
			x:r.x/pageWidth,
			y:r.y/pageWidth,
			width:r.width/pageWidth,
			height:r.height/pageWidth
		}
	});

	var data = {
		selectText:selectText,
		id:id,
		relateRect:rs,
		page: pageIndex,
		quadPoints:null,
		color:{r:hcolor[0],g:hcolor[1],b:hcolor[2]},
		pdfName:path
	}

	var newAnnotate = {
		selectText:selectText,
		id:id,
		type:'highlight',
		text:JSON.stringify(data),
		pdfName:path,
		page: pageIndex,
		createTime:+new Date()
		
	}

	annotations.push(newAnnotate);

	saveAnnotations(newAnnotate);
	
	rangesDom = []
	selectionRangesRef={};
	pointerDownPositionRef.id='';
	annotateMenu.style.display='none';
	addNoteDom.style.display="none";
	//selectAnnotate = null;
	isHighlighting = false;
	isTempHighlight = false;
}

function saveAnnotations(newAnnotate){

	  annotations.sort((a,b)=>{
		  return a.page-b.page
	  });

	  createSiderAnnotations();

	  window.parent.postMessage({
		type:'saveAnnotations',
		_viewMark:_viewMark,
		annotations:annotations,
		newAnnotate,
		mdId
	  },"*");
};

function createSiderAnnotations(){

	annotateContainerDom.innerHTML='';
	
	annotations.forEach(data=>{
           var annotateItemDom = document.createElement('div');
		   annotateItemDom.classList.add('annotate-item');
		   annotateItemDom.setAttribute('data-id',data.id);
           
		   var annotateItemContainerDom = document.createElement('div');
		   annotateItemContainerDom.classList.add('annotate-item-container');
		   annotateItemDom.appendChild(annotateItemContainerDom);

		   var annotateItemHeadDom = document.createElement('div');
		   annotateItemHeadDom.classList.add('annotate-item-header');

		   if(language=='zh-cn'){
			   var page = locale[language].page;
		   }else{
			   var page = locale['zn'].page;
		   }

		   annotateItemHeadDom.innerHTML=`${page} ${data.page + 1}`;

		   var annotateItemcontentDom = document.createElement('div');
		   annotateItemcontentDom.classList.add('annotate-item-content');
		   if(data.type=='highlight'){
			   annotateItemcontentDom.innerHTML=`
					<blockquote>
						${data.selectText||''}
					</blockquote>
			   `;
		   }else{
				var textObj = JSON.parse(data.text);
				var img = `<img src="${textObj.imageAbsolutePath||textObj.path}"/>`;
				annotateItemcontentDom.innerHTML = img;
		   }

		   var textObj = JSON.parse(data.text);
		   var annotateItemNoteDom = document.createElement('div');
		   annotateItemNoteDom.classList.add('annotate-item-note');
		   annotateItemNoteDom.innerText=`${textObj.contents||''}`;


		   var color = textObj.color;
		   var colorString = `${color.r},${color.g},${color.b}`;
		   var className = 'mm-highlight-black'
		   for (var k in colorObject){
			   if(colorObject[k]==colorString){
				className = `mm-highlight-${k}`
			   }
		   }

		   annotateItemDom.classList.add(className);

		   annotateItemContainerDom.appendChild(annotateItemHeadDom)
		   annotateItemContainerDom.appendChild(annotateItemcontentDom)
		   annotateItemContainerDom.appendChild(annotateItemNoteDom)
		   annotateContainerDom.appendChild(annotateItemDom);
	});
}

$('body').on('blur','.annotate-item-note',(e)=>{
   var target = e.target;
   var text = target.innerText;
   var id = target.closest('.annotate-item').getAttribute('data-id');
   if(id){
	   annotations.forEach(an=>{
		   if(an.id==id){
			   var data = JSON.parse(an.text);
			   data.contents=text;
			   data.commentTime = +new Date();
			   an.text = JSON.stringify(data);
		   }
	   });

	   updateHighlight(id,text);
   }
});



function popupMenu(evt){
	
	if(evt.changedTouches){
		var x = evt.changedTouches[0].pageX;
		var y = evt.changedTouches[0].pageY;
	}else{
		var x = evt.pageX;
		var y = evt.pageY;
	}
	if(selectAnnotate){
		isHighlighting = false;
	}else{
		isHighlighting = true;
	}

	setTimeout(()=>{
		calcSelections(evt,true);
		deselect();
		if(rangesDom.length||selectAnnotate){
			annotateMenu.style=`left:${x - 20}px;top:${y + 20}px`;
			annotateMenu.style.display='flex';
		}
	},20)

	

}

function updateHighlight(id,text){
	var annotate = pdfContainer.querySelector(`.annotate[data-id="${id}"]`)
	if(!annotate) return;
	var commnetBar = annotate.querySelector('.comment-bar');
	if(text){
		if(commnetBar){
		   commnetBar.setAttribute('data-title',text);
		}else{
			var commentBar = document.createElement('span');
			commentBar.classList.add('comment-bar');
			commentBar.style=`position:abaolute;left:-8px;top:-6px;z-index:120;`;
			commentBar.innerHTML=annotateCommentIcon;
			commentBar.setAttribute('data-title',text);
			annotate.appendChild(commentBar);
			}
     }else{
	 var commentBar = annotate.querySelector('.comment-bar');
	 if(commentBar){
	   annotate.removeChild(commentBar);
	 }
    }

	saveAnnotations();

}

textareaDom.onblur=()=>{

	var id = addNoteDom.selectId;
	if(textareaDom.value){
		annotations.forEach(an=>{
			if(an.id==id){
				var data = JSON.parse(an.text);
				data.contents=textareaDom.value;
				data.commentTime = +new Date();
				an.text = JSON.stringify(data);
			}
		});
		updateHighlight(id,textareaDom.value);
		textareaDom.value='';
		
		addNoteDom.selectId='';
	}

}



function deleteAnnotate(){
	if(selectAnnotate){
		   var id = selectAnnotate.getAttribute('data-id');
		   annotations.forEach((a,i)=>{
			   if(a.id == id){
				   annotations.splice(i,1);
			   }
		   });

		   document.querySelectorAll(`.mm-highlight[data-id="${id}"]`).forEach(ele=>{
			   if(ele){
				   if(ele.parentElement){
					   ele.parentElement.removeChild(ele);
				   }
			   }
		   });

		   saveAnnotations();

	}
}




 function pointerEventToPosition(event) {
	
	let page = getPageFromElement(event.target);
	if (!page) {
		return null;
	}

	let rect = page.node.getBoundingClientRect();
	var clientX = event.touches ? event.touches[0].clientX:event.clientX;
	var clientY = event.touches ? event.touches[0].clientY:event.clientY;

	let x = clientX + page.node.scrollLeft - rect.left - 9;
	let y = clientY + page.node.scrollTop - rect.top - 10;

	return {
		pageIndex: page.number - 1,
		rects: [[x, y, x, y]]
	};
}


function getPageFromElement(target) {
	let node = target.closest('#viewer > .page') || target.closest('#viewer > .spread > .page');
	if (!node) {
		return null;
	}

	let number = parseInt(node.dataset.pageNumber);
	return { node, number };
}



function v2p(position) {
	let viewport = pdfViewer.getPageView(position.pageIndex).viewport;
	return v2pc(position, viewport);
}

function p2v(position) {
	let viewport = pdfViewer.getPageView(position.pageIndex).viewport;
	return p2vc(position, viewport);
}


function v2pc(position, viewport) {
	return {
		pageIndex: position.pageIndex,
		rects: position.rects.map((rect) => {
			let [x1, y2] = viewport.convertToPdfPoint(rect[0], rect[1]);
			let [x2, y1] = viewport.convertToPdfPoint(rect[2], rect[3]);
			return [
				Math.min(x1, x2),
				Math.min(y1, y2),
				Math.max(x1, x2),
				Math.max(y1, y2)
			];
		})
	};
}


function p2vc(position, viewport) {
	if (position.rects) {
		return {
			pageIndex: position.pageIndex,
			rects: position.rects.map((rect) => {
				let [x1, y2] = viewport.convertToViewportPoint(rect[0], rect[1]);
				let [x2, y1] = viewport.convertToViewportPoint(rect[2], rect[3]);
				return [
					Math.min(x1, x2),
					Math.min(y1, y2),
					Math.max(x1, x2),
					Math.max(y1, y2)
				];
			})
		};
	}
	else if (position.paths) {
		return {
			pageIndex: position.pageIndex,
			width: position.width * viewport.scale,
			paths: position.paths.map((path) => {
				let vpath = [];
				for (let i = 0; i < path.length - 1; i += 2) {
					let x = path[i];
					let y = path[i + 1];
					vpath.push(...viewport.convertToViewportPoint(x, y));
				}
				return vpath;
			})
		};
	}
}



const NOTE_DIMENSIONS = 22;

function getModifiedSelectionRanges(selectionRanges, modifier) {
	if (!selectionRanges.length) {
		return [];
	}

	let range = selectionRanges.find(x => x.anchor);
	let anchor = {
		pageIndex: range.position.pageIndex,
		offset: range.anchorOffset
	};

	range = selectionRanges.find(x => x.head);
	let head = {
		pageIndex: range.position.pageIndex,
		offset: range.headOffset
	};
	if (modifier === 'left') {
		head.offset--;
	}
	else if (modifier === 'right') {
		head.offset++;
	}
	else if (modifier === 'up') {
		head.offset = window.extractor.getPrevLineClosestOffset(head.pageIndex, head.offset);
		if (head.offset === null) {
			return [];
		}
	}
	else if (modifier === 'down') {
		head.offset = window.extractor.getNextLineClosestOffset(head.pageIndex, head.offset);
		if (head.offset === null) {
			return [];
		}
	}
	else if (typeof modifier === 'object') {
		let position = modifier;
		head = position;
	}
	return getSelectionRanges(anchor, head);
}

function getWordSelectionRanges(position) {
	let res = window.extractor.getClosestWord(position);
	if (!res) {
		return [];
	}
	let { anchorOffset, headOffset } = res;

	let anchor = {
		pageIndex: position.pageIndex,
		offset: anchorOffset
	};

	let head = {
		pageIndex: position.pageIndex,
		offset: headOffset
	};
	return getSelectionRanges(anchor, head);
}

function getLineSelectionRanges(position) {
	let res = window.extractor.getClosestLine(position);
	if (!res) {
		return [];
	}
	let { anchorOffset, headOffset } = res;

	let anchor = {
		pageIndex: position.pageIndex,
		offset: anchorOffset
	};

	let head = {
		pageIndex: position.pageIndex,
		offset: headOffset
	};
	return getSelectionRanges(anchor, head);
}

function getSelectionRanges(anchor, head) {
	let selectionRanges = [];
	let fromPageIndex = Math.min(anchor.pageIndex, head.pageIndex);
	let toPageIndex = Math.max(anchor.pageIndex, head.pageIndex);
	let reverse = anchor.pageIndex > head.pageIndex;
	for (let i = fromPageIndex; i <= toPageIndex; i++) {
		let a, h;
		if (i === anchor.pageIndex) {
			a = anchor.offset !== undefined ? anchor.offset : [anchor.rects[0][0], anchor.rects[0][1]];
		}

		if (i === head.pageIndex) {
			h = head.offset !== undefined ? head.offset : [head.rects[0][0], head.rects[0][1]];
		}

		let selectionRange = window.extractor.extractRange({
			pageIndex: i,
			anchor: a,
			head: h,
			reverse
		});

		if (!selectionRange) {
			return [];
		}

		if (i === anchor.pageIndex) {
			selectionRange.anchor = true;
		}

		if (i === head.pageIndex) {
			selectionRange.head = true;
		}

		if (!selectionRange.collapsed) {
			// We can synchronously get page viewbox from page view, because it's already loaded when selecting
			let pageHeight = pdfViewer.getPageView(selectionRange.position.pageIndex).viewport.viewBox[3];
			let top = pageHeight - selectionRange.position.rects[0][3];
			if (top < 0) {
				top = 0;
			}

			// TODO: Unify all annotations sort index calculation
			let offset = Math.min(selectionRange.anchorOffset, selectionRange.headOffset);
			selectionRange.sortIndex = [
				i.toString().slice(0, 5).padStart(5, '0'),
				offset.toString().slice(0, 6).padStart(6, '0'),
				Math.floor(top).toString().slice(0, 5).padStart(5, '0')
			].join('|');
		}

		selectionRanges.push(selectionRange);
	}
	return selectionRanges;
}


function uuid() {
	function S4() {
	  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + '-' + S4() + '-' + S4());
};


function pageRender(evt) {
	  var pageNumber = evt.pageNumber;
	  setTimeout(()=>{
		getPdfAnnotation(pageNumber);
	  },10);
   };


   function getPdfAnnotation(pageNumber){
	 if(interval){
	   clearInterval(interval);
	 }
	 interval=null;
	 if(annotations&&annotations.length){
		 createPdfAnnotate(annotations,pageNumber);
	 }
  }


  function createPdfAnnotate(rows,pageNumber){
   var pageDom = document.querySelector('#viewer .page') ;
   var pageWidth = pageDom.clientWidth;
  
  //  if($(`.page[data-page-number='${pageNumber}']`).find('.annotate').length){
  //        $(`.page[data-page-number='${pageNumber}']`).find('.annotate').remove();
  //  }

   document.querySelectorAll(`.page[data-page-number='${pageNumber}'] .mm-highlight`).forEach(ele=>{
		if(ele){
		  var p = ele.parentNode;
		  p.removeChild(ele);
		}
   });

   var annotations = rows;

   annotations.forEach(row=>{

		  var json = JSON.parse(row.text)
		  var rects =json.relateRect;
		  var bg = `rgb(${json.color.r},${json.color.g},${json.color.b})`;
		  if(json.contents){
			var comment = json.contents;
		  }

		 //  if(json.pageWidth){
		 //    var pw = json.pageWidth
		 //  }else{
		 //   var pw = pageWidth
		 //  }
		  

		  if(json.page + 1 != pageNumber) return;
		  
		  if(rects.length>1){
			  rects.forEach((rect,i)=>{
				  var dom=document.createElement('div');
				  dom.classList.add('mm-highlight');
				  dom.classList.add('annotate');
				  dom.setAttribute('data-type',row.type);
				  if(row.type=='highlight'){
					   dom.setAttribute('data-text',json.selectText||'');
				  }
				  dom.style=`background:${bg};width:${rect.width*pageWidth}px;height:${rect.height*pageWidth}px;position:absolute;cursor:pointer;left:${rect.x*pageWidth}px;top:${rect.y*pageWidth}px;`
				  dom.setAttribute('data-id',row.id)
			
				  var textLayer=document.querySelector(`.page[data-page-number='${pageNumber}'] .textLayer`);

				  if(textLayer.querySelector('.annotateLayer-extend')){
					var annoatetLayerDom = textLayer.querySelector('.annotateLayer-extend');
				  }else{
					 var annoatetLayerDom = document.createElement('div')
					 annoatetLayerDom.classList.add('annotateLayer-extend');
					 textLayer.appendChild(annoatetLayerDom)
				 }
				 annoatetLayerDom.appendChild(dom)

				  if(comment&&i==0){
					 var commentBar = document.createElement('span');
					  commentBar.classList.add('comment-bar');
					  var color = dom.style.background;
					  commentBar.style=`position:abaolute;left:-8px;top:-6px;z-index:120;`;
					  commentBar.innerHTML=annotateCommentIcon
					  commentBar.setAttribute('data-title',comment);
					  dom.appendChild(commentBar);
				  }

			  });
		}else{
			  var dom=document.createElement('div');
			  
			  dom.setAttribute('data-id',json.id)
			  dom.setAttribute('data-type',row.type);
			  dom.classList.add('mm-highlight');
			  dom.classList.add('annotate');
			  if(row.type=='highlight'){
				   dom.setAttribute('data-text',json.selectText||'');
			  }
			  if(row.type == 'rect'){
					dom.setAttribute('data-path',json.path);
					var headDom = document.createElement('div');
					headDom.classList.add('annotate-head');
					dom.appendChild(headDom);

					var resizeDom = document.createElement('div');
					resizeDom.classList.add('annotate-resize');
					dom.appendChild(resizeDom);
					resizeDom.innerHTML=annotateResizeIcon;

			  }
			  if(json.relateRect&&json.relateRect.length){
				   dom.style=`background:${bg};width:${json.relateRect[0].width*pageWidth}px;height:${json.relateRect[0].height*pageWidth}px;position:absolute;cursor:pointer;left:${json.relateRect[0].x*pageWidth}px;top:${json.relateRect[0].y*pageWidth}px;`
 
				  var textLayer=document.querySelector(`.page[data-page-number='${pageNumber}'] .textLayer`);
				 // textLayer.appendChild(dom);
				 if(textLayer.querySelector('.annotateLayer-extend')){
					var annoatetLayerDom = textLayer.querySelector('.annotateLayer-extend');
				  }else{
					 var annoatetLayerDom = document.createElement('div')
					 annoatetLayerDom.classList.add('annotateLayer-extend');
					 textLayer.appendChild(annoatetLayerDom)
				 }
				 annoatetLayerDom.appendChild(dom)
			  }

			  if(comment){
			   var commentBar = document.createElement('span');
				commentBar.classList.add('comment-bar');
				var color = dom.style.background;
				commentBar.style=`position:abaolute;left:-8px;top:-6px;z-index:120;`;
  
				commentBar.innerHTML=annotateCommentIcon;
				commentBar.setAttribute('data-title',comment);
				dom.appendChild(commentBar);
			}
			
		}
   });

   //探测待定位的标注
   detachPdfAnnotate(pageNumber);
};


function detachPdfAnnotate(p){

 var me=this,id,pageNumber;
 if(waitPdfId){
	id=waitPdfId;
 }else{
   return;
 }

 if(!annotations||annotations.length==0) return;

 var annotate=annotations.filter(an=>{
		var json = JSON.parse(an.text);
		if(an.id==id){
		  pageNumber = parseInt(json.page) + 1;
		  return true;
		}else{
		  return false;
		}
	 });

	 if(annotate.length){
		 //$('.annotate.active').removeClass('active');
		 // var dom = $('.textLayer').find(`.annotate[data-id = '${id}']`);
		  var dom = document.querySelector(`.textLayer .mm-highlight[data-id = '${id}']`)
		  
		  if(dom){
		   // var page = dom.closest('.page').attr('data-page-number');
			pdfViewer.currentPageNumber = pageNumber;
			pdfViewer._currentPage = pdfViewer.currentPageNumber;
			var top = parseInt(dom.style.top)
			if(setTime)clearTimeout(setTime);
			 setTime=setTimeout(()=>{
					var body = document.querySelector('#viewerContainer');
					body.scrollTop = body.scrollTop + top - 100;
		 
					document.querySelectorAll(`.textLayer .mm-highlight[data-id = '${id}']`).forEach(ele=>{
					 if(ele){
					   ele.classList.add('active');
					 }
				   })
				  
			},0);

		   
		  }else{
			   pdfViewer.currentPageNumber = pageNumber;
			   pdfViewer._currentPage = pageNumber;
			  
			  if(setTime)clearTimeout(setTime);
			   me.setTime=setTimeout(()=>{
				  var dom = document.querySelector(`.textLayer .mm-highlight[data-id = '${id}']`);
				  if(dom){
						var top = parseInt(dom.style.top);
						setTimeout(()=>{
								var body = document.querySelector('#viewerContainer');
								body.scrollTop = body.scrollTop + top - 100;
						},30);

						document.querySelectorAll(`.textLayer .mm-highlight[data-id = '${id}']`).forEach(ele=>{
						   if(ele){
							  ele.classList.add('active');
						   }
						})
					  }
			  },0);
		  }
	 }

	 if(pageNumber == p){
		   waitPdfId='';
	 }
 };


 function showAnnotate(id,pdfName){
	
	 if(annotations.length){
		 var annotate=null;
		  annotations.forEach(an=>{
			  if(an.id==id){
				annotate = an
			  }
		  });
 
		  if(annotate){
		 //  $('.annotate.active').removeClass('active');
		 //  var dom = $('.textLayer').find(`.annotate[data-id = '${id}']`);
		   document.querySelectorAll('.mm-highlight.active').forEach(ele=>{
			  ele.classList.remove('active');
		   });
		   var dom = document.querySelector(`.mm-highlight[data-id = '${id}']`);
		   if(dom){
			 var page = dom.closest('.page').getAttribute('data-page-number');
			 pdfViewer.currentPageNumber = parseInt(page);
		 	//pdfViewer._scrollIntoView({pageDiv:dom.closest('.page'),pageSpot:null,pageNumber:parseInt(page)})
			 var top = parseInt(dom.style.top);

			 setTimeout(()=>{
					 var body = document.querySelector('#viewerContainer');
					 body.scrollTop = body.scrollTop + top - 60;
					 isShowAnnotate = false;
			 },100);

			 document.querySelectorAll(`.mm-highlight[data-id = '${id}']`).forEach(ele=>{
			   ele.classList.add('active')
			 });
 
			 waitPdfId = '';
		   }else{
			 waitPdfId=id;
			 var d = JSON.parse(annotate.text);
			 pdfViewer.currentPageNumber = parseInt(d.page)+1;
		   }
		  }
	 }
 };


 
 function computePageOffset() {
	if(pdfViewer._currentPage>=0){
	  var pg =  document.querySelector(`.page[data-page-number="${pdfViewer._currentPage}"]`);
	  if(pg){
		var textLayer=pg.querySelector('canvas');
		
		var rect = textLayer.getBoundingClientRect();
		return {
				top: rect.top ,
				left: rect.left 
		}
	  }else{
		return {
		  top:0,
		  left:0
		}
	  }
	}else{
	  return {
		left:0,
		top:0
	  }
	}

 };

 function selectionCoordinates() {
	
	 let rec = window.getSelection().getRangeAt(0).getBoundingClientRect();
	 let ost = computePageOffset();
	 let x_1 = rec.x - ost.left
	 let y_1 = rec.y - ost.top
	 let x_2 = x_1 + rec.width
	 let y_2 = y_1 + rec.height

	 var cache = [x_1, y_1, x_2, y_2];

	 let x_1_y_1 = pdfViewer._pages[pdfViewer._currentPage - 1].viewport.convertToPdfPoint(x_1, y_1)
	 x_1 = x_1_y_1[0]
	 y_1 = x_1_y_1[1]
	 let x_2_y_2 = pdfViewer._pages[pdfViewer._currentPage - 1].viewport.convertToPdfPoint(x_2, y_2)
	 x_2 = x_2_y_2[0]
	 y_2 = x_2_y_2[1]

	 return [x_1, y_1, x_2, y_2].concat(cache);
};


function _createImage(imagePath,imageOptions,isNew,textLayer,rectDom,data){
    var pageDom = document.querySelector('#viewer .page');
    var pageWidth = pageDom.clientWidth;
    var newCanvas = document.createElement('canvas');
    newCanvas.width = imageOptions.width ;
    newCanvas.height = imageOptions.height ;
    var newCtx = newCanvas.getContext('2d');
   
    var page = textLayer.closest('.page');
    var canvas = page.querySelector('canvas');
  
    let devicePixelRatio = window.devicePixelRatio || 1
    let backingStoreRatio = newCtx.webkitBackingStorePixelRatio || newCtx.mozBackingStorePixelRatio || newCtx.msBackingStorePixelRatio || newCtx.oBackingStorePixelRatio || newCtx.backingStorePixelRatio || 1
    let ratio = devicePixelRatio / backingStoreRatio;
  
    newCtx.drawImage(canvas, imageOptions.left*ratio, imageOptions.top*ratio, imageOptions.width*ratio, imageOptions.height*ratio, 0, 0, imageOptions.width,imageOptions.height);
    var imageData = newCanvas.toDataURL();
    var base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = _base64ToArrayBuffer(base64Data);
    var relateRect=[{
      x:imageOptions.left/pageWidth,
      y:imageOptions.top/pageWidth,
      width:imageOptions.width/pageWidth,
      height:imageOptions.height/pageWidth
    }];

    data.relateRect = relateRect || [];
    data.pdfName=path;
    data.path = imagePath;

	
    if(isNew){
      rectDom.setAttribute('data-id',data.id);
      rectDom.setAttribute('data-path',imagePath);
      annotations.push({
        id:data.id,
        text:JSON.stringify(data),
        type:'rect',
        page:data.page,
        width:imageOptions.width,
        height:imageOptions.height,
        pdfName:path
      });  
    }

    window.parent.postMessage({
      type:'createRect',
      imagePath:imagePath,
      dataBuffer:dataBuffer,
      annotations:annotations,
      isNew:isNew,
      data:data,
      relateRect:relateRect,
      imageOptions:imageOptions,
      _viewMark:_viewMark,
	  mdId
    },'*');

    setTimeout(()=>{
      if(isNew){
         rectDom = null;
      }
    },500);
  
  };


  function _base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}


 








})