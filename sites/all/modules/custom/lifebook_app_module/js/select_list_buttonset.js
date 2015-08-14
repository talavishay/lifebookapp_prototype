(function( $ ){
	//jQuery ui plugin --  buttonset vertical
	$.fn.buttonsetv = function() {
	$(':radio, :checkbox', this).wrap('<div style="margin: 1px"/>');
	$(this).buttonset();
	$('label:first', this).removeClass('ui-corner-left').addClass('ui-corner-top');
	$('label:last', this).removeClass('ui-corner-right').addClass('ui-corner-bottom');
	mw = 0; // max witdh
	$('label', this).each(function(index){
	w = $(this).width();
	if (w > mw) mw = w;
	})
	$('label', this).each(function(index){
	$(this).width(mw);
	})
	};
})( jQuery ); 

Drupal.behaviors.lifebook = {
	attach: function (context, settings) {
		
		if(!jQuery(context).hasClass('radio_to_buttonsetv')){
			context = jQuery('.radio_to_buttonsetv').first();
		}
		
		context.once(function(){
			
			context.buttonsetv();				
			
			context.on("mouseenter", function(){
				jQuery(context).addClass("show");
			}).on("mouseleave", function(){
				jQuery(context).removeClass("show");
			});

			jQuery("button", context).on("click", function(){
				jQuery('button', context).not(this).removeClass("selected");
				jQuery(this).addClass('selected');
		
				jQuery(context).addClass("active");
			});
		
		});
	
	}
};
