jQuery(document).ready(function(){
	book = {
		types : Drupal.settings.e_types,
		id : 0,
		title : "Book title",
		chapters : [],
		pages : [],
		entities : []
	};

	Drupal.attachBehaviors();

	var input = jQuery('<input  accept="text/csv"  type="file"/>');
	
	input.on("change", function(e){
		Papa.parse( e.target.files[0], {
			header: true,		 
			step: _step,
			//error: function(err){					//console.log(err);				//},
			dynamicTyping: true			});
	});
	jQuery("#project_view_all")
		.before(input)
		.append(jQuery('<table id="CSVTable"/>'));
	if(!book.init){
		book.init = true;
		_init_table();		
	};
})
.on("click", '.entity_link', function(e){
	var d = e.currentTarget.dataset,
		id = d.entity_id,
		type = d.entity_type;
	if(type === "book"){
		window.open('/app/'+id+'/'+(parseInt(id)+1), "_blank");
	} else {
		_entity_dialog(id);
	}
	e.preventDefault();
	return false;
});

function _step(results, parser){
	var row = results.data[0];
	parser.pause();
	
	
	if(row.type != "" && row.id != ""){
		_add_row(row, parser);	
	}
}
function _init_table(csv){
	_jtable();
	
	var control = jQuery('<button/>').text("list").on('click' , function(){
			var entity_bundels = book.entity_bundels;

			_table
				.jtable('load',{
					type: jQuery("#project_view_all select").val()
					
				}, 	function(d){
					book._table = d;
				});			
	});
	_table.before(control);
};
//function confirm(info, action1, action2, dialogTitle) {
function confirm(info, actions) {
	var o = {};
	jQuery.each(actions, function(i, val){
		o[val.label] = function () {
			if (typeof (val.action) == 'function') {
				setTimeout(val.action(val), 0);
			}
			jQuery(this).dialog('destroy');
		};
	});
	jQuery('<div/>').dialog({
		title: info.title || 'Confirm',
		buttons: o,
		modal: true,
		open : function(d){
			var _t = jQuery("<table><tbody></tbody></table>");
			//console.log(jQuery(this).data());
			
			for (property in info.content ) {
				if(property === "id" || property === "title" || property === "type"){
					jQuery("tbody",_t).append(jQuery("<tr></tr>")
								.append(jQuery("<td></td>").html(property))
								.append(jQuery("<td></td>").html(info.content[property] ))
					);
				}
			}
			jQuery(this).prepend(_t);
		}
	}).data("actions", actions).data("info", info);
}

function _entity_dialog(href){
jQuery('<div/>')
	.load('/project/' + href + '/view/dialog' )
	.appendTo('body')
	.dialog();		
};


function _add_row(row, parser){
	var data = _entity_setup(row);
	//var data = row;
		
	_table.jtable('addRecord', {
		record:data,
		//clientOnly : true,
		animationsEnabled : true,
		url : '/project/jtable/create',
		success : function(e){
			//console.log(e);
			_add_entity(e.Record);
			parser.resume();
		},
		error : function(){}
	});
	
};


function _add_entity(e){

	if(e.type == "book"){
		book.id = e.id;
		book.title = e.title;
	};

	if(e.type == "chapter"){
		book.chapters.push(e);
	} else {
		book.entities.push(e);
	};
	
}
function _entity_setup(e, created){
	var	entity = jQuery.merge(e,{});
	delete entity.length;
	
	if(book.id){
		if(e.type == "chapter"){
			entity.og_group_book_ref = { "und" :  {target_id :book.id }} ;
		};
	} else {
			//	confirm("xxx", null, null, "ZZZ");
		//selectbook
	};
	if(book.chapters[0]){
		if(e.type == "page"){
			entity.og_group_chapter_ref = { "und" : { target_id : book.chapters[0].id }} ;
		};
		if(e.type == "student"){
			entity.og_group_student_chapter_ref = { "und" : { target_id : book.chapters[0].id }} ;
		};
	} else {
				//_confirm_dialog('האם?',null,null,'שאלה');

	}
	return entity;
}

function after_step(data){
	if(data.type === "book"){
		book.id = data.id;
	};
};

function _jtable(){
var setDefualtBook, setDefualtChapter,options = {
	paging : true,
	pageSize: 5,
	deleteConfirmation : false,
	selecting: true, //Enable selecting
	multiselect: true, //Allow multiple selecting
	selectingCheckboxes: true, //Show checkboxes on first column
	//selectOnRowClick: false, //Enable this to only select using checkboxes
	selectionChanged: function () {		//Get all selected rows
		var selectedRows = jQuery('#content').jtable('selectedRows');
			
		if (selectedRows.length > 0) {
			// selected rows
			selectedRows.each(function (i,val) {
				selectedRows[i].record = jQuery(this).data('record');
					
				//jQuery(this).data("select", val);
				
				confirm({
						title : "בחר פעולה",
						content : selectedRows[i].record,
						type : jQuery("td", this).first().text(),
					}, 
					[{	label : "setDefualtBook",
						action : setDefualtBook,
						data : selectedRows[i].record
					},{
						action :setDefualtChapter,
						data : selectedRows[i].record,
						label : "setDefualtChapter",
					}]);
			});
		}
	},
		//rowInserted: function (event, data) {
////			if (data.record.Name.indexOf('Andrew') >= 0) {
				//jQuery('#content').jtable('selectRows', data.row);
	////		}
		//}  
	actions: {
		listAction:  function (postData) {
			var res = { "Result":"OK", "Record": {} };
			postData.split('&').forEach(function(v){ 
				var _split = v.split('=');
				res.Record[_split[0]] = _split[1]+"XXXX";
			});
			return res;
		},
		listAction: '/project/jtable/list',
		createAction: '/project/jtable/create',
	//	updateAction: '/GettingStarted/UpdatePerson',
		deleteAction: '/project/jtable/delete'
	},
	fields: {
		id: {
			title: 'מזהה',
			//display: function (d) {
				//return  _entity_link(d, false);
			//},
			key: true,
		},
		title: {
			 title: 'כותרת',
			//edit: true,
			width: '50%'
		},
		rid:{visibility : "hidden"},
		id2: {
			 title: 'מזהה כיתה',
			//display: function (d) {
				//return  _entity_link(d, true);
			//}	
		},
		type: {
		    title: 'סוג',
		    options: { 
				'book': 'ספר', 
				'chapter': 'כיתה',
				'page': 'דף' ,
				'student': 'תלמיד' 
			},
		},
	}
	};
	setDefualtBook = function(d){	
		console.log(d.data.id);
		book.id = d.data.id;
		jQuery("<div>default book is now : "+d.data.id+"</div>").dialog();
	};
	setDefualtChapter = function(d){
		console.log("action on record  : ");
		console.log(d);
	};
	// initialize jtable plugin with above options..
	_table = jQuery('#content').jtable(options);
}


function _entity_link(d, ref){
	var id = d.record.id,
		type = d.record.type;
	
	if(ref && d.record.type === "student" && typeof d.record.og_group_student_chapter_ref.und[0] === "object"){
		id = d.record.og_group_student_chapter_ref.und[0].target_id;
	}
	if(ref && d.record.type === "page" && typeof d.record.og_group_chapter_ref === "object"){
		id = d.record.og_group_chapter_ref.und[0].target_id;
	}
	if(book.chapters.length){
		return jQuery('<a target="_blank" href="#" data-entity_id="'+id+'"   data-entity_type="'+type+'" class="entity_link">'+id+'</a>');
	}
	return '';
}
//CountryId: {
//		defaultValue: studentData.record.type,
		//title: 'Country',
		//dependsOn: 'PhoneType' , //Countries depends on continentals. Thus, jTable builds cascade dropdowns!
		//options: function (data) {
//console.log(data);
			//if (data.source == 'list') {
				////Return url of all countries for optimization. 
				////This method is called for each row on the table and jTable caches options based on this url.
				//return '/Demo/GetCountryOptions?continentalId=0';
			//}

			////This code runs when user opens edit/create form or changes continental combobox on an edit/create form.
			////data.source == 'edit' || data.source == 'create'
			//return '/Demo/GetCountryOptions?continentalId=' + data.dependedValues.ContinentalId;
		//},
		//list: false
	//},
//options.createAction: function (postData) {
			//var res = { "Result":"OK", "Record": {} };
			//postData.split('&').forEach(function(v){ 
				//var _split = v.split('=');
				//res.Record[_split[0]] = _split[1];
			//});
			//return res;
//}
	//_table.jtable('addRecord', {
    //record: {
        //type: 'book',
         //title: '2011-11-12'
    //}
//});
//(function ($, Drupal, window, document, undefined) {
//Drupal.behaviors.my_custom_behavior = {
  //attach: function(context, settings) {
		
  //}
//};
//})(jQuery, Drupal, this, this.document);
