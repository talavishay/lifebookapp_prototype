jQuery(document).ready(function(){

if(typeof Drupal.settings.lifebook != "object"){
Drupal.settings.lifebook = {};
}

Drupal.settings.lifebook._setup = function(){
	Drupal.settings.lifebook.update_stage = function(ajax, response, status){
		Drupal.settings.lifebook.current = response.data;
	}
	Drupal.settings.lifebook.update_student = function(ajax, response, status){
		var x = Drupal.settings.lifebook.students_list;
		Drupal.settings.lifebook.students_list = jQuery.map(x, function(item){
			if(item.id === response.data.id){
				return response.data;
			}
		});
		Drupal.settings.lifebook.update_student_list
	};
	Drupal.ajax.prototype.commands.update_student = Drupal.settings.lifebook.update_student;
	Drupal.ajax.prototype.commands.update_stage = Drupal.settings.lifebook.update_stage;
	
	Drupal.settings.lifebook.update_student_list =function(){
		
	};
}
Drupal.settings.lifebook.student_add_to_page = function(data){
	var text =  data["first_name"] + " " + "last_name";
	if(data["text"] != ""){
		text += "\n" + data["text"];
	}
	var obj = add_text(text);
	obj.lifebook_type = "student";
	obj.lifebook_data = {student_id: data.id};
	
	Drupal.settings.lifebook._update_student_page(data);
};
Drupal.settings.lifebook._remove_student_page = function(id){
	Drupal.settings.lifebook._update_student_page({"id" : id}, true);
}
Drupal.settings.lifebook._update_student_page = function(data, del){
	var del = typeof del !== 'undefined' ? del : false,
		op = del ? 0 : Drupal.settings.lifebook.current.id,
		url = "/_update_student/"+data.id+"/"+op;
	jQuery.get(url , function(res){
		var page = op === 0 ? "" : op;
			elm = jQuery('.student[data-student_id="'+data.id+'"]');
			if(op === 0){
				elm.removeClass("on_page");
			}
			elm.find(".page").html(page);
				_save();
	});
};

Drupal.settings.lifebook._init = function(){
	
	jQuery( ".accordion" ).accordion({
		collapsible: true,
		heightStyle: "content"
	});
	
	
	var list = jQuery('<div/>');
	Drupal.settings.lifebook.students_list.forEach(function(val){
		list.append(Drupal.settings.lifebook._get_student(val));
	});
	
	var dm  = Drupal.settings.lifebook.display_mode;
	if(dm === "mobile"){
		var target = "#lifebook_mobile_content ";
		
		//jQuery(taregt).html(list);
		
		
		jQuery(target).html(jQuery('<button class="popup">student_add_to_page</button>')
		.on('click', function(e){
			var position = {
				my: "center top",
				at: "center center",
				of: target,
			};			
			jQuery(list).dialog({
				dialogClass	: "student_add_to_page",
				title		:"הוסף טקסט של תלמיד לעמוד זה",
				width		:150,
				position : position	,
				open: function( event, ui ) {
					var dialog_content = this;
					jQuery(dialog_content).toggle();

				}
			});
		}));
	} else {
		var target = ".fabric_canvas_view_field",
			position =  {
			at :"right top+100",
			my :"left top",
			of: target
		};
					
		jQuery(list).dialog({
				dialogClass	: "student_add_to_page",
				title		:"הוסף טקסט של תלמיד לעמוד זה",
				width		:150,
				position : position	,
				open: function( event, ui ) {
					var dialog_content = this;
					jQuery(dialog_content).toggle();

				}
			});
	}
	
};




	//(function( $ ){
	/**
	 *  init  project nav
	 * 
	 * radios into buttons & event handler
	 * */
		var arg = window.location.pathname.split('/'),
			nav = jQuery("#project_nav .radio_to_buttonsetv" );
		
		// project nav event handle	
		jQuery("button", nav).on("click", function(){
			var chapter_id	=	jQuery(this).data("id"),
				book_id		=	jQuery(this).parents('.radio_to_buttonsetv').data("book_id"),
				url 		= '/app/'+book_id+'/'+chapter_id;
			
			if( chapter_id != arg[3] ){
				window.location.href = url;
			};
		});
		
		//activate current project nav
		jQuery('button[data-id="'+arg[3]+'"]', nav).addClass('selected');
		jQuery(nav).addClass("active");
		
		
	//});

});
