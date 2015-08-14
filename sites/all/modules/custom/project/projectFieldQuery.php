<?php
class projectFieldQuery extends EntityFieldQuery {
	public function __construct($bundle = NULL, $order = 'title', $direction = 'ASC') {
  $this->entityCondition('entity_type', 'project');
	if (isset($bundle)) {
		// This will accept either singular values or arrays.
		$this->propertyCondition('type', $bundle);
	};
	
	// Default order.
	if (isset($order)) {
		$this->propertyOrderBy($order, $direction);
	};
}

	function finishQuery($select_query, $id_key = 'entity_id') {
		//$select_query->range(0, 10);
		$size = intval($_GET["jtPageSize"]);
		$start = intval($_GET["jtStartIndex"]);
		
		foreach ($this->tags as $tag) {
			$select_query->addTag($tag);
		}
		foreach ($this->metaData as $key => $object) {
			$select_query->addMetaData($key, $object);
		}
		$select_query->addMetaData('entity_field_query', $this);
		if ( isset($_GET["jtPageSize"]) &  !$this->count ) {
			$select_query->range($start , $size);
		}
	/* 	if ($this->count) {
			return $select_query->count()->execute();
		} */
		// All this just to add...
		$select_query->addField('project', 'title', 'entity_label');
		$return = array();
		foreach ($select_query->execute() as $partial_entity) {
			$bundle = isset($partial_entity->bundle) ? $partial_entity->bundle : NULL;
			$entity = entity_create_stub_entity($partial_entity->entity_type, array($partial_entity->entity_id, $partial_entity->revision_id, $bundle));
			$entity->title = $partial_entity->entity_label;
			$entity->xxxx = "XXXZZZZ";
		//	dpm($partial_entity);
			$return[$partial_entity->entity_type][$partial_entity->$id_key] = $entity;
			$this->ordered_results[] = $partial_entity;
		}
		//dpm($return);
		return $return;
	}
}
?>
