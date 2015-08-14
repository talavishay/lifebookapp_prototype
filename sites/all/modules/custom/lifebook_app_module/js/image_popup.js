 
function open_dialog(elm) {
	var width = "auto",
		within = window,
		availWidth = window.innerWidth * 0.9,
		availHeight = window.innerHeight * 0.9,
		pos =  {
				my : "top center",
				at : "top center",
				using: function( position ) {
					jQuery( this ).animate( position ,{duration:100});
				}
		},
		at = "center top";

	jQuery(elm).css({'max-width':'100%','height':'auto'});
	var dialog = jQuery('<div/>').dialog({
		width : width,
		resizable : false,
		modal : true,
		draggable : false,
		show : "explode",
		//position :pos,
		open : function(t) {
			var dialog = jQuery(this).parents('.ui-dialog');
			jQuery(dialog).prepend(jQuery(".ui-button", dialog).css('top',0) 	).addClass("image_popup");
			jQuery(".ui-dialog-titlebar", dialog).remove();
		
			if(elm.height > availHeight){
				jQuery(elm).height(availHeight);
				at = "center top";
				//.height(elm.height);
					jQuery(elm).css({'width':'auto'});
			} else {
				if(elm.width > availWidth){
				jQuery(elm).width(availWidth);
				//.height(elm.height);
				}
			
			}
			jQuery('.ui-dialog-content', dialog).append(elm);	
		jQuery(dialog).position( {
								my : "center top+5%",
								at : at,
								of : window
							});
							
		
		},
		close : function() {
			jQuery(this).dialog('destroy').remove();
		}
	});
	return dialog.dialog( "widget" );
	//});
}
function _cycle(e){
	var dialog = jQuery(e.currentTarget).parents('.ui-dialog'),
		images = dialog.data("images").clone();

	jQuery(images).each(function(i, img){
		var url = jQuery(img).attr('src').replace(/styles\/thumbnail\/public\//i, '');
		jQuery(img).attr({
			src	:	url,
			//width:window.innerWidth,
			//height: window.innerHeight,
			style : 'width : 100%;height : auto;',
		});
	});
	
	var nav = jQuery('<div id="nav" style="position: absolute;z-index: 99999;width: 100%;left: 0px;background: none repeat scroll 0% 0% #F00;height: 20px;top: 50%;"><div id="controls"/><div id="first">first</div><div id="next">next</div><div id="last">last</div><div id="prev">prev</div></div></div>');
	
	dialog
		.prepend(nav)
		.prepend(images);
	
	var cycle = dialog.cycle({
			next: '#next',
			prev: '#prev' });
	
	dialog.data('cycle' ,cycle );
	
	cycle.on( 'cycle-update-view', 
	//dialog.on( 'cycle-post-initialize', 
		function( event, optionHash, slideOptionsHash, currentSlideEl ) {
		//function( event, jQueryWrappedSlideEl ) {
			var dialog = jQuery(currentSlideEl).parents('.ui-dialog');
			
			jQuery(currentSlideEl).attr({
				'max-width': '90%',
				'max-height': '90%'
			});
			dialog.position({
				my: "center",
				at: "center",
				of: window,
				using: function( position ) {
					jQuery( this ).animate( position ,{duration:100});
				}
			});
		});
	//dialog.cycle('pause');
sss = dialog;
		//}
	//});
	
	//window.setTimeout(function(){
		
		//window.setInterval(function(){
			//jQuery(sss).position({
				//my: "center",
				//at: "center",
				//of: window,
				 //using: function( position ) {
					//jQuery( this ).animate( position );
					//console.log(position);
				//}
			//});
		//}, 100);
	//}, 5000);
}
Drupal.behaviors.ui_dialog_image_popup = {
	attach: function (context, settings) {
		
		var images = jQuery('.widget img', context);
		
		images.each(function(i,val){
			var wid = jQuery(val).parents('.field-type-image'),
			images = jQuery('img', wid);
		
			jQuery(val).once(function(){
				
				jQuery(val).on("click", function(){
					var thumb = jQuery(this).clone(),
						url = thumb.attr('src').replace(/styles\/thumbnail\/public\//i, ''),
						img = jQuery('<img class="loading" src="'+url+'"/>');
						
					img.on('load', function(){			
						
						var dialog = open_dialog(this);
						
					});
				
				});
			});
		});
	}
};


//var dialog = img.dialog({  
								//modal :true, 
								//resizable : false,
								//width: '90%',
								////'max-width': screen.width,
								//create : function(){
									//jQuery('img', this).css('max-width', '90%');
								//},
						//});
						//dialog
						//.data("images", images)
						//.css({
						//padding : '0px',
						////'max-height': '50%',
						////'max-width': '50%',
						////'left' : '5%',
						////'top' : '2%'
						//}).addClass('ui_dialog_image_popup');
					
						//dialog = jQuery(dialog).parents('.ui-dialog'),
						//btn = jQuery('.ui-dialog-titlebar-close', dialog);
						
					
					//jQuery('.ui-dialog-titlebar', dialog).remove();
					//jQuery('.ui-dialog-content', dialog).css({
						//padding : '0px'
					//});
					//btn.on("click", function(e){
						//var dialog = jQuery(dialog).parents('.ui-dialog');
						
						//jQuery('.ui_dialog_image_popup').cycle( "destroy" ).remove();
						//jQuery('.ui_dialog_image_popup').dialog().dialog( "destroy" ).remove();
						////dialog.cycle( "destroy" ).remove();
						////dialog.dialog().dialog( "destroy" ).remove();
					//}).css({
						//'position'	: "absolute",
						//'z-index' 	: "9999",
						//'top'		: "0",
						//'right'		: "0",
						//'margin'    : '0px'
					//}).appendTo(dialog);	
						//dialog.position();
						//img.removeClass('loading');
					//}).on("click", _cycle);		
		
		//var t = window.setInterval(function(){
			//jQuery(dialog).position({
				//my: "center top",
				//at: "center top+35 ",
				//of: window,
				 //using: function( position ) {
					//jQuery( this ).animate( position ,{duration:100});
					////console.log(position);
				//}
			//});
		//}, 100);			
	//window.setTimeout(function(){
		//window.clearInterval(t);
	//}, 1000);	
