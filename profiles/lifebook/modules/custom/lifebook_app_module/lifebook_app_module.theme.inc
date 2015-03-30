<?php 
function lifebook_app_module_preprocess_lifebook_sidebar_second(&$variables, $hook){
	global $user, $base_url, $lifebook;

	$id = reset($lifebook["class"])["id"];
	$entity = entity_load_single("project", $id);

	$form = drupal_get_form("partial_fields_form", array("field_image") , $entity);
	$variables["class_pictures"] = _form_ajax_setup($form);
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
			'#list' => $lifebook["class"]
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
	$out = "<select>";
	foreach($variables["list"] as $k => $v){
		$out .= '<option value="'.$v["id"].'">'.$v["title"].'</option>' ;
	}
	$out .= "</select>";
	return $out;
}

function theme_stage($variables){
	$output = 'xxx';
	$node = node_load($variables["nid"]);
	return render(field_view_field('node', $node , 'body', 'full'));
}
function theme_file_widget_multiple_override($variables) {
	$output = '<div id="XXXSXXSXSX">';
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
		unset(	$widget["alt"],	$widget["filename"]);

		$information = drupal_render($widget);

		// Render the previously hidden elements, using render() instead of
		// drupal_render(), to undo the earlier hide().
		$operations = '';
		foreach ($operations_elements as $operation_element) {
			$operations .= render($operation_element);
		}

		$output .=  '<span class="widget">'.$information.$operations .  '</span>';
	}
	$output .= drupal_render_children($element);
	$output .= '</div>';
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
