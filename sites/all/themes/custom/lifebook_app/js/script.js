book = {
	id : 0,
	title : "Book title",
	chapters : [],
	pages : [],
	entities : []
};
jQuery(document).ready(function(){
	var input = jQuery('<input  accept="text/csv"  type="file"/>').on("change", function(e){
			_parse_csv( e.target.files[0]);
		});
	jQuery("#content").before(input).append(jQuery('<table id="CSVTable"/>'));
});

function _parse_csv(file){
	Papa.parse(file, {
		header: true,		 
		step: _step,
		//error: function(err){
			//console.log(err);
		//},
		//complete: function(results) {
			//data = results;
		//},
		dynamicTyping: true,
	});
}
function _step(results, parser){
	var row = results.data[0];
	parser.pause();
	if(!book.init){
		book.init = true;
		_init_table(book.file);		
	};
	
	if(row.type != "" && row.id != ""){
		_add_row(row, parser);	
	}
}
function _add_row(row, parser){
	var data = _entity_setup(row);
	//var data = row;
		
	_table.jtable('addRecord', {
		record:data,
		//clientOnly : true,
		animationsEnabled : true,
		url : '/project/jtable/create',
		success : function(e){
			console.log(e);
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

	if(e.type == "chapter"){
		entity.og_group_book_ref = { "und" :  {target_id :book.id }} ;
	};
	if(e.type == "page"){
		entity.og_group_chapter_ref = { "und" : { target_id : book.chapters[0].id }} ;
	};
	if(e.type == "student"){
		entity.og_group_student_chapter_ref = { "und" : { target_id : book.chapters[0].id }} ;
	};
	return entity;
}
function _init_table(csv){
	_jtable();
	var control = jQuery('<button/>').text("list").on('click' , function(){
			_table.jtable('load',{type:"book"}, function(d){
				book._table = d;
			});			
	});
	_table.before(control);
};
function after_step(data){
	if(data.type === "book"){
		book.id = data.id;
	};
};

function _jtable(){
	 
_table = jQuery('#content').jtable({
	title: 'Table of people',
	deleteConfirmation : false,

	actions: {
		listAction: '/project/jtable/list',
		createAction: '/project/jtable/create',
		//createAction: function (postData) {
			
			//var res = { "Result":"OK", "Record": {} };
			
			//postData.split('&').forEach(function(v){ 
				//var _split = v.split('=');
				//res.Record[_split[0]] = _split[1];
			//});
			
			
			//res.Record = _entity_setup(res.Record, true);
			
			//console.log(res);
			
			//return res;
		//},
	//	updateAction: '/GettingStarted/UpdatePerson',
		deleteAction: '/project/jtable/delete'
	},
		fields: {
			id: {
				key: true,
			},
			type: {
			    title: 'Project type',
			    options: { '1': 'book', '2': 'chapter', '3': 'page' },
////                defaultValue: studentData.record.type,
				//display: function (studentData) {
				////	console.log(studentData.record.type);
					//return studentData.record.type;
				//}
			},
			title: {
				title: 'Title',
				//edit: true,
				width: '50%'
			},
			//CountryId: {
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
			
		}
	});
	
	
	
	
	//_table.jtable('addRecord', {
    //record: {
       
        //type: 'book',
         //title: '2011-11-12'
    //}
//});

}

(function ($, Drupal, window, document, undefined) {
Drupal.behaviors.my_custom_behavior = {
  attach: function(context, settings) {
    
    
	
  }
};
Drupal.attachBehaviors();
})(jQuery, Drupal, this, this.document);

