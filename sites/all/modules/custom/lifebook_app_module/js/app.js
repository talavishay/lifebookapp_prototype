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
	var text = '';
	jQuery.each(["first_name","last_name"], function(i, val){
			text += data[val] + " ";
		});
	text += "\n" + data["text"];		
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

Drupal.settings.lifebook._init = function(){
	
	jQuery( ".accordion" ).accordion({
		collapsible: true,
		heightStyle: "content"
	});
	
	var list = jQuery('<div/>');
	Drupal.settings.lifebook.students_list.forEach(function(val){
		list.append(Drupal.settings.lifebook._get_student(val));
	});

	jQuery(list).dialog({
		dialogClass	: "student_add_to_page",
		title		:"הוסף טקסט של תלמיד לעמוד זה",
		width		:150,
		position 	: {
				at :"right top",
				my :"left top",
				//within: ".fabric_canvas_view_field"
				of: ".fabric_canvas_view_field",
				collision: "none"
		}
	});
	
};

Drupal.settings.lifebook._setup();	
Drupal.settings.lifebook._init();



});
