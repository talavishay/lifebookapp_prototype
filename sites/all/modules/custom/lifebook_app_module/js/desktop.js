jQuery(document).ready(function(){


Drupal.settings.lifebook._get_student = function(val){
	var student = jQuery('<div class="student"/>'),
	preview = jQuery('<div class="preview"/>'),
	first_name = jQuery('<span class="first_name"/>'),
	last_name = jQuery('<span class="last_name"/>');
	page = jQuery('<span class="page"/>'),
	page_id = parseInt(val.page),
	f = first_name.clone().html(val.first_name+" "),
	l = last_name.clone().html(val.last_name),
	p = page.clone().html(page_id),
	item = student.clone().append(preview.clone().append(f).append(l).append(p));
	
	//if(typeof val.page.und !== "undefined"){
		//page_id = val.page.und[0].target_id;
	//}	
	if(typeof page_id === "number" && !isNaN(page_id)){
		item.addClass("on_page");
	}
	item.attr("data-student_id", val.id);
	item[0].student_id = val.id;
	
	item.one("click", function(e){
		var x = Drupal.settings.lifebook.students_list;
		 d = jQuery.map(x, function(item){
			if(item.id === e.currentTarget.student_id){
				return item;
			}
		});
		jQuery(e.currentTarget).addClass("on_page");
		
		Drupal.settings.lifebook.student_add_to_page(d[0]);
	});
	return item;
}

Drupal.settings.lifebook.student_add_to_page = function(data){
	var text =  data["first_name"] + " " + "last_name";
	if(data["text"] != ""){
		text += "\n" + data["text"];
	}
	var obj = add_text(data);
	obj.lifebook_type = "student";
	obj.lifebook_data = {student_id: data.id};
	
	Drupal.settings.lifebook._update_student_page(data);
};



Drupal.settings.lifebook._setup();	
Drupal.settings.lifebook._init();

var s = jQuery('<div class="toggle setup_desktop" />');
jQuery(".region-sidebar-second .block-lifebook-app-module")
	.once()
	.prepend(s.clone().addClass("right"));

jQuery(".region-sidebar-first .block-lifebook-app-module")
	.once()
	.prepend(s.clone().addClass("left"));



jQuery('.toggle.setup_desktop').once()
	.on("click", function(e){
		var region =  jQuery(e.currentTarget).parents(".region");
		
		jQuery(region).toggleClass("toggling");
		region.toggleClass("toggle",400, function(){
			jQuery(region).toggleClass("toggling");
		});
		
});

});
//document Ready # END
