<?php
/**
 * @file
 * Contains Views controller for the Project entity.
 */

/**
 * Views controller class for the Project entity.
 */
class ProjectViewsController extends EntityDefaultViewsController {

  /**
   * Overrides EntityDefaultViewsController::views_data().
   */
  public function views_data() {
    $data = parent::views_data();

    $data['project']['operations'] = array(
      'title' => t('Operations'),
      'help' => t('Displays action operations which are available for Project.'),
      'real field' => 'id',
      'field' => array(
        'handler' => 'project_handler_field_operations',
      ),
    );

    return $data;
  }

}

/**
 * Implements hook_views_default_views().
 */
function project_views_default_views() {
  return project_exports('project', 'views', 'view.inc', 'view');
}
