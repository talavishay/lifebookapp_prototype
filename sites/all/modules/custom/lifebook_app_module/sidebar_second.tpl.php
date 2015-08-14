<div class="accordion">
	<?php 	global $lifebook;	?>
	<?php if ($lifebook["display_mode"] === "mobile") :	?>
		<h3>עמודי ספר המחזור</h3>
		<div id="mobile_book_pages">
			<?php print  '';?>
		</div>
	<?php  endif;?>
	
	<h3>פספורטים מלייף בוק</h3>
	<div id="lifebook_passport">
			<?php print render($field_lifebook_passport);?>

	</div>
	
	<h3>תמונות מלייף בוק</h3>
	<div id="lifebook_images">
			<?php print render($field_lifebook_images);?>
	</div>
	

	<h3>העלאת תמונות</h3>
	<div id="upload">
	<?php print render($class_pictures);?>
	</div>
	


	<h3>רשימת תלמידיםs</h3>
	<div class="students_list" > 
	<?php foreach($students as $v):?>
		<div class="student" data-student_id="<?php print $v["id"]?>" >
			<div class="preview" onclick='jQuery(this).next().toggle("slow")'>
				<span class="page"><?php print render($v["page"])?></span> 
				<span class="first_name"><?php print render($v["first_name"])?></span> 
				<span class="last_name"><?php print render($v["last_name"])?></span>
				<span class="group_picture"><?php print render($v["group_picture"])?></span>
				<span class="passport"><?php print render($v["passport"])?></span>
			</div>
			<div class="form" style="display:none"><?php print render($v["form"])?></div>
		</div>
	<?php endforeach;?>
	</div>

</div>
