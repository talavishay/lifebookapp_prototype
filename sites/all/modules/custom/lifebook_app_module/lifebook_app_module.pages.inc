<?php
function _app_setup($user){
	drupal_add_library('system', 'ui.accordion');
	drupal_add_library('system', 'ui.dialog');
	drupal_add_css(drupal_get_path("module", "lifebook_app_module")."/css/app.css");
	drupal_add_library('system', 'drupal.ajax');

	drupal_set_title('');
	drupal_set_breadcrumb(array());
	if($user->uid !== 0){
		drupal_add_js(drupal_get_path("module", "lifebook_app_module")."/js/app.js");
	} else {
		drupal_add_js(array("user" => $user), 'setting'  );
	
	}
}
function lifebook_app_callback($project, $class) {
	global $user;
	_app_setup($user);
	
	if($user->uid == 0){
			
		return print_r($user, true);
		//die();
		//exit();
	}
	$arg = arg();
	$res = module_load_include("inc", "project","includes/project.pages");
	foreach (_get_project_content($arg[1]) as $k => $v){
		if(og_user_access("project", $k, "administer group")){
			$project_class_list[$v->id] = array(
					"title" => 	$v->title,
					"id" 	=>	$v->id,
			);
			if($class === $v->id){
				$project_class_list[$v->id]["content"] = _get_class_content(trim($v->id));
				$s = _get_class_students(trim($v->id));
				$project_class_list[$v->id]["students"] = $s;
				$project_class_list[$v->id]["students_list"] =  _get_students_list($s, false);
			}
		}
	}
	$GLOBALS["lifebook"] = array(
			"project" => entity_load_single("project",  $arg[1] ),
			"class" => $project_class_list,
			"pages" => $project_class_list[$class]["content"],
			"students" => $project_class_list[$class]["students"],
			"students_list" => $project_class_list[$class]["students_list"],
			"current"=> entity_load_single("project", $project_class_list[$class]["content"][0]),
			"arg"	=> $arg
	);
	/* $form = drupal_get_form("partial_fields_form", array("field_canvas"), $GLOBALS["lifebook"]["current"]);
	$form["#prefix"] = '<span id="current_canvas_form" >';
	$form["#suffix"] = '</span>'; */
	$canvas = field_view_field("project", $GLOBALS["lifebook"]["current"], "field_canvas","full" );
	drupal_add_js(array("lifebook" => $GLOBALS["lifebook"]), "setting");
	return array(
			'#theme' => 'stage',
			//'#active_page' => $GLOBALS["lifebook"]["current"],
			'#active_page' =>$canvas
	);
}

function test_callback() {
	//$e = entity_load_single("project", 10);
	//return	drupal_get_form("multiple_image_form", "field_image", $e, "chapter");
	//$form = drupal_get_form("partial_fields_form", array("field_image") , $e);
	//$form = _form_ajax_setup($form);
	//$out =  _class_pictures_form_theme($form);
	//return $form;
	
	drupal_add_library('system', 'ui.dialog');
	$entity_info = entity_get_info("project")['bundles'] ;
	$e = array_keys($entity_info);
	foreach($e as $k => $v){
		$bundles[] = array(
			"id" =>$v, 
			"title" => $v
		);
	};
		
	dpm($bundles);
	return array(
			'#theme' => 'select_class',
			//'#list' => array("1"=>"1","2"=>"2","3"=>"3"));
			'#list' => $bundles);
}

function lifebook_app_callback_ajax($id) {
	$page = entity_load_single("project", $id);
	$canvas = field_view_field("project", $page, "field_canvas","full" );
/* 	$form = drupal_get_form("partial_fields_form", array("field_canvas"), $GLOBALS["lifebook"]["current"]);
	$form["#prefix"] = '<span id="current_canvas_form" >';
	$form["#suffix"] = '</span>';
	$canvas = $form; */
	
	$commands = array();
	$commands[] =	ajax_command_replace(".field-name-field-canvas", render($canvas),$html[0]["#attached"]["js"][3]["data"]);
	$commands[] =	array(
			'command' => 'update_stage',
			'data' => $page
	);

	//$commands[] =	ajax_command_settings($html[0]["#attached"]["js"][3]["data"], true);
	return array(
			'#type' => 'ajax',
			'#commands' => $commands,
	);
}

function lifebook_app_update_student($student_id, $page_id) {
	$entity =  entity_load_single("project", $student_id);
	if($page_id === "0"){
		$entity->field_page = array();
	} else {
		$entity->field_page["und"][0]["target_id"] = $page_id;
		$entity->field_page["und"][0]['target_type'] = "project";
	}
	$out = project_save($entity);
	
	echo json_encode( _get_student_info($entity)); 
}

function _get_class_content($id){
	$query = new EntityFieldQuery();
	$query->entityCondition('entity_type', 'project')
	->entityCondition('field_name', 'og_group_chapter_ref')
	->fieldCondition('og_group_chapter_ref', 'target_id', $id, '=');

	$results = $query->execute();

	//$ids = array_keys($results['project']);
	return array_keys($results['project']);
	//return entity_load("project", $ids);
}

function _get_project_content($id){
	$out = array();
	$ids = array();
	$query = new EntityFieldQuery();
	$query->entityCondition('entity_type', 'project')
	->fieldCondition('og_group_book_ref', 'target_id', $id, '=');

	$results = $query->execute();
	if(isset($results['project'])){
		$ids = array_keys($results['project']);

		return entity_load("project", $ids);
	}
}
function _get_class_students($id){
	$query = new EntityFieldQuery();
	$query->entityCondition('entity_type', 'project')
	->entityCondition('field_name', 'og_group_student_chapter_ref')
	->fieldCondition('og_group_student_chapter_ref', 'target_id', $id, '=');

	$results = $query->execute();

	return array_keys($results['project']);
}

