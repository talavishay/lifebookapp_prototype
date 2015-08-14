
(function( $ ){
//plugin buttonset vertical
$.fn.buttonsetv = function() {
$(':radio, :checkbox', this).wrap('<div style="margin: 1px"/>');
$(this).buttonset();
$('label:first', this).removeClass('ui-corner-left').addClass('ui-corner-top');
$('label:last', this).removeClass('ui-corner-right').addClass('ui-corner-bottom');
mw = 0; // max witdh
$('label', this).each(function(index){
w = $(this).width();
if (w > mw) mw = w;
})
$('label', this).each(function(index){
$(this).width(mw);
})
};
})( jQuery ); 
//jQuery(document).ready(function({


jQuery(document).ready(function(){
	view_all_init();
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

function view_all_init(){
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
	jQuery("#content").after(input);
	
	input.on("change", function(e){
		Papa.parse( e.target.files[0], {
			header: true,		 
			step: _step,
			//error: function(err){					//console.log(err);				//},
			dynamicTyping: true			
		});
		book = {
			types : Drupal.settings.e_types,
			id : 0,
			title : "Book title",
			chapters : [],
			pages : [],
			entities : []
		};
	});
	if(!book.init){
		book.init = true;
		_init_table();		
	};
	//var entity_bundels = book.entity_bundels;
	
	
	//var bt = jQuery( "#select_list_books input" ).button();
	//jQuery(".ui-button", bt)[0].click();
	
	
	
	
	
	var bt = jQuery( ".radio_to_buttonsetv#books" );
	bt.buttonsetv();
	bt.on("mouseenter", function(){
		jQuery(this).addClass("show");
	}).on("mouseleave", function(){
		jQuery(this).removeClass("show");
	});
	
	 var bt_c = jQuery( bt).children();
	 bt_c.on("click", function(e){
		jQuery(bt_c).removeClass("selected");		
		
		var buttons = jQuery(this);
			book_id = this.dataset.id,
			clicked_btn = this;
		
		jQuery('#books').removeClass("show").once().addClass("active");
			
		
		jQuery(e.currentTarget).addClass("selected");
		jQuery("#chapters").addClass("reloading")
		
		_update_chapters(book_id, 'chapters');
	});
	
	//var book_id = jQuery("#books option:visible").val();
	//_update_chapters(book_id,"chapters");
	//jQuery("select#chapters").on("change", function(e){
		
	//});
	Drupal.behaviors.lifebook = {
	  attach: function (context, settings) {
		
		if(jQuery( context).hasClass('chapters')){
			
			jQuery(context).buttonsetv();
			jQuery(context).attr('style', 'width:100%;');
			jQuery(context).addClass("show");
			//jQuery('button', context).first()
			var c = context;
			jQuery("button", context).on("click", function(){
					jQuery(context).addClass('show');
				
					
					var chapter_id	=	jQuery(this).data("id"),
						book_id		=	jQuery('#books .selected').data("id");
					
					
					jQuery('button', context).not(this).removeClass("selected");
					jQuery(this).addClass('selected');
					
					
				});
					
			};
			
				var bt = jQuery( ".radio_to_buttonsetv#books" ).buttonsetv();

			
		}
	};

}
function _init_table(csv){

	 _table_1 = _jtable();
	
	_table_1.before(jQuery('<button/>')
		.text("list")
		.data("table_ref" , _table_1)
		.on('click' , _load_table))
		.before(jQuery('<button/>')
		.text('open')
		.on('click', _load_project));
}

function _load_project(e){
	book = jQuery("#books .selected").data('id'),
	chapter = jQuery("#chapters  .selected").data('id'),
	window.open('/app/'+book+'/'+chapter, '_blank');
}
function _load_table(e){
	//var table_ref = jQuery(e.currentTarget).data("table_ref"),
	//type = jQuery("select#type").val(),
	type = "page",
	book = jQuery("#books .selected").data('id'),
	chapter = jQuery("#chapters  .selected").data('id'),
	//table_ref
	 _table_1.jtable()
		.jtable('load',{
			type: type,
			chapter: chapter,
			book: book
			
		}, 	function(d){
			book._table = d;
		});
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
		//listAction:  function (postData) {
			//var res = { "Result":"OK", "Record": {} };
			//postData.split('&').forEach(function(v){ 
				//var _split = v.split('=');
				//res.Record[_split[0]] = _split[1]+"XXXX";
			//});
			//return res;
		//},
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
	_table = jQuery('#main').after(jQuery('<div/>').jtable(options));
	return _table;
}

function _step(results, parser){
	var row = results.data[0];
	parser.pause();
	
	
	if(row.type != "" && row.id != ""){
		_add_row(row, parser);	
	}
}

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
	var	entity = jQuery.merge(e,{}),
		chapter_count = book.chapters.length - 1;
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
			entity.og_group_chapter_ref = { "und" : { target_id : book.chapters[chapter_count].id }} ;
		};
		if(e.type == "student"){
			entity.og_group_student_chapter_ref = { "und" : { target_id : book.chapters[chapter_count].id }} ;
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


(function($){

  /**
   * Add an extra function to the Drupal ajax object
   * which allows us to trigger an ajax response without
   * an element that triggers it.
   */
  Drupal.ajax.prototype.specifiedResponse = function() {
    var ajax = this;

    // Do not perform another ajax command if one is already in progress.
    if (ajax.ajaxing) {
      return false;
    }

    try {
      $.ajax(ajax.options);
    }
    catch (err) {
      alert('An error occurred while attempting to process ' + ajax.options.url);
      return false;
    }

    return false;
  };

  /**
   * Define a custom ajax action not associated with an element.
   */
  var custom_settings = {};
  custom_settings.url = '/project/select/1/z';
  custom_settings.event = 'onload';
  custom_settings.keypress = false;
  custom_settings.prevent = false;
  //custom_settings.submit= {"id" : "x"};
  Drupal.ajax['get_select'] = new Drupal.ajax(null, $(document.body), custom_settings);

  /**
   * Define a point to trigger our custom actions. e.g. on page load.
   */
/*  $(document).ready(function() {
  });*/

})(jQuery);    
function _get_default_options(){
	//custom_settings.submit= {"placeholder" :"#chapters"};
	return {
		event : 'onload',
		  keypress : false,
		  prevent : false
	}
}

function _update_chapters(book_id,selector){
	//var book_id = jQuery("select#books").val(), 
		//selector = "chapters",
	  var	obj,
	  	custom_settings = _get_default_options();
	custom_settings.url = '/project/select/chapter/'+book_id+'/'+selector;
	obj = new Drupal.ajax(null, jQuery(document.body), custom_settings);
	obj.specifiedResponse();
}
