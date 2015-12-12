	var app = app || {
	    data: "",
	    template_box: function(image,name,parent_challenge,rating,solved_by,tags,url){
	    	var image = image||'',
	    	name = name||'',
	    	parent_challenge = parent_challenge||'',
	    	rating = rating||'',
	    	solved_by = solved_by||'',
	    	tags = tags||[],
	    	url = (url)?url.slice(0,-1):'',
	    	tag=tags.join(",");
	    	if(image===""){
	    		return "";
	    	}
	    	var template="<div class='box'> <div class='box_side box_img'><img alt='event-logo' src="+image+"></div><div class='box_side box_content'><div class='heading'>"+name;
	    	template+="</div><div class='heading_1'><span>Solved by:"+solved_by+"|"+rating+"</span><span class='stars'></span></div><div class='heading_2'>"+parent_challenge;
	    	template+="</div><div class='heading_3'>"+tag+"</div><div class='heading_3'>Link: <a target='_blank' href="+url+">"+url.replace(window.location.origin+'/problem/','')+"</a></div></div></div></div>";
	    	
	    	var val =parseFloat(rating),
	    	    size = Math.max(0, (Math.min(5, val))) * 16,
	            replace_text = "<span class='stars'><span style='width:"+size+"px'></span>";
	        template = template.replace("<span class='stars'>",replace_text);
	        //$(template).find("span.stars").html($span);
	    	return template;
	    },

	    init: function() {
	    	setInterval(function(){ app.ajax_req_api(); }, 3000);
	    	
	        this.ajax_req();
	        this.addActionListener();
	    },
	   // http://hackerearth.0x10.info/api/problems?type=json&query=api_hits
	   	ajax_req_api: function() {
	        $.ajax({
	            type: 'GET',
	            url: 'https://hackerearth.0x10.info/api/problems?type=json&query=api_hits',
	            success: function(msg) {
	                app.api = jQuery.parseJSON(msg);
	                $("#api").text(app.api.api_hits);
	            },
	            error: function(request, status, error) {
	                console.log(error);
	            }
	        });
	    },
	    ajax_req: function() {
	        $.ajax({
	            type: 'GET',
	            url: 'https://hackerearth.0x10.info/api/problems?type=json&query=list_problems',
	            success: function(msg) {
	                app.data = jQuery.parseJSON(msg);
	                if($("#rating").is(':checked')){
	                	app.sort_by_rating();
	                }
	                app.display(app.data);
	            },
	            error: function(request, status, error) {
	                console.log(error);
	            }
	        });
	    },
	    sort_by_rating :function(){
	    	app.data.problems.sort(function(a,b){ 
    			var x = a.rating< b.rating? -1:1; 
				    return x; 
				});
	    },
	    display: function(data) {
	        if (data) {
	        	var box='',temp;
	        	for(var i=0;i<data.problems.length;i++){
	        			temp = data.problems[i];
	        			box = this.template_box(temp.image,temp.name,temp.parent_challenge,temp.rating,temp.solved_by,temp.tags,temp.url);
	        			$(".container").append(box);
	        		}
	            console.log(data);
	        }
	        else {
	        	$(".container").html("NO data received, try refreshing the page");
	        }
	    },
	    addActionListener: function(){
	    	
	    }
	}
	$.fn.stars =function(rating){
	    	var val =parseFloat(rating);
	    	var size = Math.max(0, (Math.min(5, val))) * 16;
	        var $span = $('<span />').width(size);
	        $(this).html($span);
	    }
	    
	$(document).ready(function() {
	    app.init();
	   //$('span.stars').stars();
	});