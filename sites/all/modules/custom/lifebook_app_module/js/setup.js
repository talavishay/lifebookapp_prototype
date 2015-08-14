jQuery(document).ready(function(){

jQuery('button,.button,.form-submit,input[type*=submit],input[type*=file]').button();

var mobile = 700;
//		DESKTOP
enquire.register("screen and (min-width: "+mobile+"px)", {
	deferSetup : true,
	setup : function setup_desktop(){
		var p = Drupal.settings.lifebook.app_path;
		jQuery.getScript('/' + p + '/js/desktop.js');
	},
	match : function() {
		setup('desktop');
	},
	unmatch : function() {
		uninstall('desktop');
	}
});

//		MOBILE
enquire.register("screen and (max-width: "+mobile+"px)", {
	deferSetup : true,
	setup : function setup_mobile(){
		jQuery.getScript('/js/mobile.js');
	},
	match : function() {
		setup('mobile');
	},
	unmatch : function() {
		uninstall('mobile');
	}
});

function uninstall(type){
		jQuery('html').removeClass(type);
		jQuery('[type*=css].setup_'	+	type	).remove();
}

function setup(type){
	Drupal.settings.lifebook.display_mode = type;	
	
	//Drupal.settings.lifebook.display_mode_previous
	
	_reload();
	
	jQuery('html').addClass(type + ' tablet');	
	
	inject_style();

	//activate_app(	type );
};

function inject_style(type){
	var l = Drupal.settings.lifebook;
	jQuery('head')
		.append(jQuery('<link/>')
			.attr({
				href : '/' + l.app_path + '/css/' + l.display_mode + '.css',
				rel : "stylesheet",
				type : "text/css" ,
				media : "screen",
				class : 'setup_'+type
			})
		);
};

/* type	=	requested display mode	-- from registersd enquire.js 
 * dm 	=	current display mode 	-- cookie
 * 
 */
function _reload(type){
	var dm = jQuery.cookie('display_mode'),
		type = Drupal.settings.lifebook.display_mode,
		msg = 'switching display mode ';
	
	if(typeof dm != 'string'){
		dm = type;
	};
	if(dm === "mobile" || dm === "desktop"){
		if(type === "mobile" && dm === "desktop"){			
			
			jQuery('html').addClass("reload");	
			console.log(msg + ' : desktop 	-> 	 mobile');
			
			jQuery.cookie('display_mode',type);
			document.location.reload();
			
			return true;
		};
		if(type === "desktop" && dm === "mobile"){			
			
			jQuery('html').addClass("reload");	
			console.log('switching display mode from : mobile 	-> 	 desktop');
			
			jQuery.cookie('display_mode',type);
			document.location.reload()
			
			return true;
		};
	};
	if(dm === type && !jQuery('html.'+dm).length ){
		jQuery('html').addClass(dm);	
		jQuery.cookie('display_mode',dm);
		return true;
	}
	return false;
};


});
