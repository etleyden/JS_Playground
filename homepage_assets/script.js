$(document).ready(function() {
    let target = $("#project_list");
    $.getJSON("homepage_assets/projects.json", function(data) {
        console.log(data);
        for(var i = 0; i < data.length; i++) {
            $(target).append("<div class=\"project_entry\">");
            $(target).append("<h2 class=\"project_title\"><a class=\"project_link\" href=\"" + data[i].dir + "index.html\">" + data[i].title + "</a></h2>");
            $(target).append("<div class=\"project_tags_parent\">");
            for(var j = 0; j < data[i].tags.length; j++) {
                $(target).append("<p class=\"project_tag\">" + data[i].tags[j] + "</p>");
            }
            $(target).append("</div>");            
            $(target).append("<p class=\"project_description\">" + data[i].description + "</p>");
            $(target).append("</div>");
        }
    }).fail(function() {
        $(target).append("<p id=\"fail_message\">Uh-oh! We weren't able to load the directory</p>");
    });
});