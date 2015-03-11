<?php 
/* 
 'user_name' => 'Nameless user',
'school_name' => 'Nameless school',
'class_name' => 'Nameless class',
'due_date' => '01.01.1983', */
?>
<span id="user_info">
	<a href="/user/logout"><?php print t('logout')?></a>
	<span >hello <?php print $user_name?></span>
</span>
<span id="project_nav">
	<span class="class">
		<span>class </span>
		<span class="class_name"><?php print render($class_name)?></span>
	</span>
	<span class="sep">></span>
	<span class="school"><?php print $school_name?></span>
</span>
<span id="project_dates">
	<span class="label"><?php print t('due date');?>: </span>
	<span class="date"><?php print render($due_date);?></span>
	<!-- <span class="timer">
		<span class="label"><?php print t('time left')?></span>
			<span id="hours">
				<span class="label"><?php print t('hours')?></span>
				<span>00</span>
			</span> 
			<span id="minutes">
				<span class="label"><?php print t('minutes')?></span>
				<span>00</span>
			</span> 
			
	</span>
	 -->
</span>