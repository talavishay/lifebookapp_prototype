<?php
/**
 * @file
 * project_bundels.features.inc
 */

/**
 * Implements hook_image_default_styles().
 */
function project_bundels_image_default_styles() {
  $styles = array();

  // Exported image style: student_list_preview.
  $styles['student_list_preview'] = array(
    'name' => 'student_list_preview',
    'label' => 'student list preview',
    'effects' => array(
      1 => array(
        'label' => 'Resize',
        'help' => 'Resizing will make images an exact set of dimensions. This may cause images to be stretched or shrunk disproportionately.',
        'effect callback' => 'image_resize_effect',
        'dimensions callback' => 'image_resize_dimensions',
        'form callback' => 'image_resize_form',
        'summary theme' => 'image_resize_summary',
        'module' => 'image',
        'name' => 'image_resize',
        'data' => array(
          'width' => 15,
          'height' => 25,
        ),
        'weight' => 1,
      ),
    ),
  );

  return $styles;
}

/**
 * Implements hook_default_project_type().
 */
function project_bundels_default_project_type() {
  $items = array();
  $items['book'] = entity_import('project_type', '{
    "type" : "book",
    "name" : "book",
    "weight" : "0",
    "locked" : "0",
    "data" : null
  }');
  $items['chapter'] = entity_import('project_type', '{
    "type" : "chapter",
    "name" : "chapter",
    "weight" : "0",
    "locked" : "0",
    "data" : null
  }');
  $items['page'] = entity_import('project_type', '{
    "type" : "page",
    "name" : "page",
    "weight" : "0",
    "locked" : "0",
    "data" : null
  }');
  $items['student'] = entity_import('project_type', '{
    "type" : "student",
    "name" : "student",
    "weight" : "0",
    "locked" : "0",
    "data" : null
  }');
  return $items;
}
