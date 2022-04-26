var makaTesting = false; // for debugging only

if (makaTesting){
	console.log('maka initiated');
	var makaReplacements = 0;
}	

// init blacklist

var blacklist = ["elon","musk","1503591435324563456","foUrqiEw_normal"]; 

// get additional settings from chrome storage

var theKittens = {"kitten": [
    {"file": "1.jpg", "Credit": "Kevinsphotos", "URL": "https://pixabay.com/photos/guinea-pig-rodent-animal-pet-1711285/", "type":"0"}
    ]
	 };

document.addEventListener('DOMContentLoaded', makanow(theKittens), false);

function makanow(theKittens){
	if (makaTesting){
		console.log('maka processing blacklist is '+blacklist+theKittens);
	}

	// called on page load. Searches all img alt text and srcs for the strings in blacklist, replaces with kittens
	var pagepics=document.getElementsByTagName("img"), i=0, img;	
	while (img = pagepics[i++])
	{	
		
		if (img.hasAttribute('makareplaced')){
			// already replaced	
		}
		else {
			// not yet replaced
			var alttext = String(img.alt).toLowerCase();
			var imgsrc = String(img.src).toLowerCase();
			
			if (img.parentElement.nodeName != 'BODY'){
				// check parent innerHTML for blackilist
				var parenttag = img.parentElement.innerHTML.toLowerCase();
			}
			else {
				// prevent parse of entire doc
				var parenttag = '';
			};
			
			var imgwidth = img.clientWidth;
			var imgheight = img.clientHeight;
	
			blacklist.forEach(function(blist) {	
				if ((alttext.indexOf(blist) != -1) || (imgsrc.indexOf(blist) != -1) || (parenttag.indexOf(blist) != -1)){
					
					// append old src
					img.setAttribute("makareplaced", img.src);
					
					// remove srcsets, forcing browser to the kitten - eg, BBC News
					if (img.hasAttribute('srcset')){
						img.removeAttribute('srcset');	
					};
					// remove source srcsets if children of same parent <picture> element - eg, the Guardian
					if (img.parentElement.nodeName == 'PICTURE'){
						var theparent = img.parentNode;
						for(var child=theparent.firstChild; child!==null; child=child.nextSibling) {
						    if (child.nodeName == "SOURCE"){
							    child.removeAttribute('src');
							    child.removeAttribute('srcset');
						    };
						};
						
					};
					// knock out lazyloader data URLs so it doesn't overwrite kittens
					if (img.hasAttribute('data-src')){
						img.removeAttribute('data-src');	
					};
					if (img.hasAttribute('data-hi-res-src')){
						img.removeAttribute('data-hi-res-src');	
					};
					if (img.hasAttribute('data-low-res-src')){
						img.removeAttribute('data-low-res-src');	
					};
					
					// fix for wapo lazyloading huge sidebar pix..
					if (window.location.href.indexOf('washingtonpost.com') != -1){
					// console.log('wapo');	
						if (img.classList.contains('unprocessed')){
							// console.log('loreslazy');	
							img.classList.remove('unprocessed');
							
						};
					};
					
					img.src = chrome.runtime.getURL('/kittens/'+theKittens.kitten[0].file+'');
					img.width = imgwidth;
					img.height = imgheight;
						
					if (theKittens.kitten[0].type == 0){
						img.alt = 'Photo by '+theKittens.kitten[0].Credit+' source '+theKittens.kitten[0].URL+'';
					}
					else {
						img.alt = 'Photo by '+theKittens.kitten[0].Credit+'';
					};
					makaReplacements++;
				};
			});	
		};				
	}
	if (makaTesting){
		console.log('maka processing complete, replaced '+makaReplacements+' images');
	}	    
};

// function to replace kittened-images with the original SRCs

function undomakanow(){
	if (makaTesting){
		console.log('undoing MAKA');
	}

	var pagepics=document.getElementsByTagName("img"), i=0, img;	
	while (img = pagepics[i++])
	{	
		if (img.hasAttribute('makareplaced')){
			if (makaTesting){
				console.log('replacing image');
			};
			img.src = img.getAttribute('makareplaced');
			img.removeAttribute('makareplaced');
		};	
	};
	
}

// listener for context menu click invoking the above

chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if (message.functiontoInvoke == "undoMAKA") {
	    // undo function called
        undomakanow();
    };
    /*
    else if (message.functiontoInvoke == "redoMAKA") {
        makanow(theKittens);
    }
    */
});

// Twitter Dot Com
// Huge thanks to @aidobreen for the code to catch DOM modification on Twitter
// https://medium.com/@aidobreen/fixing-twitter-with-a-chrome-extension-1f53320f5a01
if (window.location.href.indexOf('twitter.com') != -1){
	function DOMModificationHandler(){		
		$(this).unbind('DOMSubtreeModified.event1');
		setTimeout(function(){
				makanow(theKittens);
				$('#timeline').bind('DOMSubtreeModified.event1',DOMModificationHandler);
		},10);
	}
	$('#timeline').bind('DOMSubtreeModified.event1', DOMModificationHandler);
};
