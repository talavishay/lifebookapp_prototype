<?php

/**
 * Field handler which shows operations for a Project.
 *
 * @todo Remove this once http://drupal.org/node/1435662 is through.
 *
 * @ingroup views_field_handlers
 */
class project_handler_field_operations extends views_handler_field_entity {

  public function query() {
    parent::query();

    // Ensure that id is present - we need this for the get_value call in
    // render method.
    // ID field don't need to be present if this is not a base table in view and
    // we are coming into Project entity table over some join relation.
    $this->add_additional_fields(array('id'));
  }

  function render($values) {
    /**
     * @var {class} entity
     */
    $entity = $this->get_value($values);

    $element = array();
    $element['#theme'] = 'links';
    $element['#attributes'] = array('class' => array('inline'));
    $uri = $entity->uri();
    if (entity_access('view', 'project', $entity)) {
      $element['#links']['view'] = array(
        'href' => $uri['path'],
        'query' => array('destination' => current_path()),
        'title' => t('view'),
      );
    }
    if (entity_access('edit', 'project', $entity)) {
      $element['#links']['edit'] = array(
        'href' => $uri['path'] . '/edit',
        'query' => array('destination' => current_path()),
        'title' => t('edit'),
      );
      $element['#links']['delete'] = array(
        'href' => $uri['path'] . '/delete',
        'query' => array('destination' => current_path()),
        'title' => t('delete'),
      );
    }
    return drupal_render($element);
  }

}
