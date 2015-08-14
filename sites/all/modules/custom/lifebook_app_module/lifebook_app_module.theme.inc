<?php 
function lifebook_app_module_preprocess_lifebook_sidebar_second(&$variables, $hook){
	global $user, $base_url, $lifebook;

$arg = arg();

//dpm($lifebook["class"][ $arg[ 2 ] ]["id"]);
//dpm($arg[2]);
	
	$id = $lifebook["class"][ $arg[ 2 ] ]["id"];
	
	//reset($lifebook["class"])["id"];
	$entity = entity_load_single("project", $id);

	$form = drupal_get_form("partial_fields_form", array("field_image") , $entity);
	$variables["class_pictures"] = _form_ajax_setup($form);
	
	$form = drupal_get_form("partial_fields_form", array("field_lifebook_passport") , $entity);
	$variables["field_lifebook_passport"] = _form_ajax_setup($form);
	
	$form = drupal_get_form("partial_fields_form", array("field_lifebook_images") , $entity);
	$variables["field_lifebook_images"] = _form_ajax_setup($form);
	
	$variables["students"] = _get_students_list($lifebook["students"]);

}

function lifebook_app_module_preprocess_lifebook_class_preview(&$variables, $hook){
	global $user, $lifebook,$base_url;
	$entities = entity_load("project", $lifebook["class"][$lifebook["arg"][2]]["content"]);
	foreach($entities as $k => $v){
		$variables["preview_pages"][] = lifebook_app_canvas_preview($v);
	}
}
function lifebook_app_module_preprocess_lifebook_header(&$variables, $hook){
	global $user,$lifebook;

	$variables["user_name"] = $user->name;
	$variables["school_name"] = $lifebook["project"]->title ;
	$variables["class_name"] = array(
			'#theme' => 'select_class',
			'#list' => $lifebook["class"],
			//'#book_id' => entity_metadata_wrapper("project", $lifebook["project"])->getIdentifier()
	);
	if(property_exists($lifebook["project"], "field_date")){
		$variables["due_date"]  = field_view_value("project", $lifebook["project"], 'field_date', $lifebook["project"]->field_date["und"][0]);
	}

}

function lifebook_app_module_preprocess_lifebook_sidebar_first(&$variables, $hook){
	global $user, $base_url, $lifebook;

	$variables["students"] = _get_students_list($lifebook["students"]);

	//return $output;
}

function theme_lifebook_class_preview($variables){
	$out = '';
	$out = render($variables["preview_pages"]);
	return '<div class="class_preview">'.$out.'</div>';
}
function theme_select_class($variables){
 	global $lifebook;
	$book_id = 	entity_metadata_wrapper("project", $lifebook["project"])->getIdentifier();
	$id = 'radio';
	$class_id = $variables["id"];
 	
	drupal_add_css(drupal_get_path("module", "lifebook_app_module").'/css/select_list_buttonset.css');
	drupal_add_js(drupal_get_path("module", "lifebook_app_module").'/js/select_list_buttonset.js');
 	$out = '<span class="radio_to_buttonsetv '.$class_id.'" id="'.$class_id.'" data-type="'.$class_id.'" data-book_id="'.$book_id.'" >';
	
	foreach($variables["list"] as $k => $v){
		//$out .= '<label for="id_'.$v["id"].'" data-chapter_id="'.$v["id"].'">'.$v["title"].'</label>';
		//$out .= '<input type="radio" id="id_'.$v["id"].'" name="book_'.$book_id.'" value="'.$v["id"].'" >' ;
//data-id="'.$v["id"].'"
		$out .= '<button data-id="'.$v["id"].'" >'.$v["title"].'</button>';
	}
	$out .= "</span>";
		
	return $out;
}

function theme_stage($variables){
	$output = 'xxx';
	$node = node_load($variables["nid"]);
	return render(field_view_field('node', $node , 'body', 'full'));
}
function theme_file_widget_multiple_override($variables) {
	
	drupal_add_css(drupal_get_path("module", "lifebook_app_module")."/css/image_popup.css");
	drupal_add_js(drupal_get_path("module", "lifebook_app_module")."/js/image_popup.js");
	drupal_add_js(drupal_get_path("module", "lifebook_app_module")."/js/jquery.cycle2.min.js");
	$output = '';
	$element = $variables['element'];
	$widgets = array();
	foreach (element_children($element) as $key) {
		$widgets[] = &$element[$key];
	}
	foreach ($widgets as $key => &$widget) {
		$widget["#theme"] = "image_widget_override";
		// Save the uploading row for last.
		if ($widget['#file'] == FALSE) {      continue;    }

		// Delay rendering of the buttons, so that they can be rendered later in the		// "operations" column.
		$operations_elements = array();
		foreach (element_children($widget) as $sub_key) {
			if (isset($widget[$sub_key]['#type']) && $widget[$sub_key]['#type'] == 'submit') {
				hide($widget[$sub_key]);
					
				$operations_elements[] = &$widget[$sub_key];
			}
		}

		// Delay rendering of the "Display" option and the weight selector, so that
		// each can be rendered later in its own column.
		if ($element['#display_field']) {      hide($widget['display']);    }
		hide($widget['_weight']);

		$widget['#theme_wrappers'] = array();
/* 		unset(	$widget["alt"],	$widget["filename"]); */
		unset(	$widget["alt"]);
		
		if(isset($widget["filename"]) & isset($widget["filename"]["#markup"]) ){
			 
			$widget["filename"]["#markup"] = '<div>'.$widget["#file"]->filename.'</div>'; 
			
			$usage = file_usage_list($widget["#file"]);
			$a = $usage["file"]["project"] ;
			$usage_c = (int) 0 ;
			foreach ($a as $key => $value) {
				$usage_c = $usage_c+intval($value);
			}
				
			$usage_count = '<div>'.$usage_c.' פעמים בשימוש</div>';
			$widget["filename"]["#markup"] .= $usage_count  ;  
		}
		$preview = drupal_render($widget["preview"]);
		$filename = drupal_render($widget["filename"]);
		$c =  drupal_render($widget);
		// Render the previously hidden elements, using render() instead of
		// drupal_render(), to undo the earlier hide().
		$operations = '';
		foreach ($operations_elements as $operation_element) {
			$operations .= render($operation_element);
		}
		$action = '<div>'.$operations.'<div>'.$filename.'</div></div>';
		$output .=  '<span class="widget">'.$preview.$action .'</span>';
	}
	$output .= drupal_render_children($element);
	$output .= '';
	return $output;
}


/**
 * Returns HTML for an image field widget.
 *
 * @param $variables
 *   An associative array containing:
 *   - element: A render element representing the image field widget.
 *
 * @ingroup themeable
 */
function theme_image_widget_override($variables) {
	$element = $variables['element'];
	$output = '';

	if (isset($element['preview'])) {
		$output .= drupal_render($element['preview']);
	}

	$output .= drupal_render_children($element);
	return $output;
}
