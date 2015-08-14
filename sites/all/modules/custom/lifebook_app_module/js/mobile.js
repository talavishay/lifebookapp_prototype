jQuery(document).ready(function(){

add_text = function(data){
		console.log(data);
		return {};
}
_save = function(x){
	console.log(x);
	
};

Drupal.settings = (typeof Drupal.settings == "object") ? Drupal.settings : {};
Drupal.settings.lifebook = (typeof Drupal.settings.lifebook == "object") ? Drupal.settings.lifebook : {};
lifebook = (typeof lifebook == "object") ? lifebook : {};

lifebook.mobile_loaded  = true;
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
				_save(data);
	});
};

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

Drupal.settings.lifebook._setup();	
Drupal.settings.lifebook._init();
jQuery('button,.button,.form-submit,input[type*=submit],input[type*=file]').button();
	
console.log('mobile.js !!');

});
