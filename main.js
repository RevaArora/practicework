	var app = app || {
	    data: "",
	    template_box: function(image, name, parent_challenge, rating, solved_by, tags, url, like) {
	        var image = image || '',
	            name = name || '',
	            parent_challenge = parent_challenge || '',
	            rating = rating || '',
	            solved_by = solved_by || '',
	            tags = tags || [],
	            url = (url) ? url.slice(0, -1) : '',
	            url_name = (url) ? url.replace('https://www.hackerearth.com/problem/', '') : '',
	            tag = tags.join(",");
	        like = like || 0;
	        if (image === "") {
	            return "";
	        }
	        var template = "<div class='col-xs-12 col-sm-12 col-md-6 col-lg-6 box'><div class='inner_box'> <div class='box_side box_img'><img src='" + image;
	        template += "' class='img-responsive img-thumbnail' ></div><div class='box_side box_content'> <div class='heading'> " + name;
	        template += "</div><div class='heading_1'><span>Solved By : " + solved_by + " </span><span class='rating_text'> Ratings :</span>";
	        template += "<span class='stars'></span></div><div class='heading_2'><span class='glyphicon glyphicon-home'></span>" + parent_challenge;
	        template += "</div><div class='heading_3'><span class='glyphicon glyphicon-tag '></span>" + tags;
	        template += "</div><div class='heading_3'><span class='glyphicon glyphicon-link'></span><span>Link:</span><a href='" + url;
	        template += "' title='" + url_name + "'>" + url_name;
	        template += " </a></div><div class='like_div'><span class='glyphicon glyphicon-thumbs-up'></span><span class='like_count'>" + like + "</span></div></div></div></div>";

	        var val = parseFloat(rating),
	            size = Math.max(0, (Math.min(5, val))) * 16,
	            replace_text = "<span class='stars'><span style='width:" + size + "px'></span>";
	        template = template.replace("<span class='stars'>", replace_text);
	        //$(template).find("span.stars").html($span);
	        return template;
	    },

	    init: function() {
	        setInterval(function() {
	            app.ajax_req_api();
	        }, 3000);
	        /*if (localStorage.data) {
	            app.data = JSON.parse(localStorage.data);
	        } else {
	            this.ajax_req();
	        }*/
	        this.ajax_req();

	        this.addActionListener();
	    },
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
	    local_storage: function(data_to_store) {
	        if (typeof(Storage) !== "undefined") {

	            localStorage.data = JSON.stringify(data_to_store);
	        } else {
	            console.log("NO local storage")
	        }
	    },
	    ajax_req: function() {
	        $.ajax({
	            type: 'GET',
	            url: 'https://hackerearth.0x10.info/api/problems?type=json&query=list_problems',
	            success: function(msg) {
	                app.data = (jQuery.parseJSON(msg)).problems;
	                if ($("#rating").is(':checked')) {
	                    app.sort_by_obj("rating");
	                } else {
	                    app.sort_by_obj("like");
	                }
	                app.display(app.data);
	            },
	            error: function(request, status, error) {
	                console.log(error);
	            }
	        });
	    },
	    sort_by_obj: function(obj) {
	        app.data.sort(function(a, b) {
	            var x = a[obj] < b[obj] ? -1 : 1;
	            return x;
	        });
	    },
	    display: function(data) {
	        if (data) {
	            $(".main-container").html("");
	            var box = '',
	                temp;
	            for (var i = 0; i < data.length; i++) {
	                temp = data[i];
	                box = this.template_box(temp.image, temp.name, temp.parent_challenge, temp.rating, temp.solved_by, temp.tags, temp.url, temp.like);
	                $(".main-container").append(box);
	            }
	            console.log(data);
	        } else {
	            $(".main-container").html("NO data received, try refreshing the page");
	        }
	    },
	    like: function() {
	        var element = $(this).parent().parent().find(".heading").text();
	        $.each(app.data, function(i, e) {
	            if (e.name === element.trim()) {
	                e.like = 1;
	                console.log(app.data);
	                app.display(app.data);
	                app.update_total_likes();
	                $("#likes").text(app.update_total_likes());
	                return;
	            }
	        })

	    },
	    update_total_likes: function() {
	        var likes = 0;
	        $.each(app.data, function(i, e) {
	            if (e.like) {
	                likes++;
	            }
	        })
	        return likes;
	    },
	    addActionListener: function() {
	        $(document).on("click", ".glyphicon-thumbs-up", this.like);

	    }
	}
	$.fn.stars = function(rating) {
	    var val = parseFloat(rating);
	    var size = Math.max(0, (Math.min(5, val))) * 16;
	    var $span = $('<span />').width(size);
	    $(this).html($span);
	}

	$(document).ready(function() {
	    app.init();
	    $('input[type=radio][name=r-group-1]').change(function() {
	        if (this.id == 'rating') {
	            app.sort_by_obj("rating");
	        } else if (this.id == 'like') {
	            app.sort_by_obj("like");
	        }
	    });
	});