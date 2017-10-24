$(function() {
    var $content = $('#jsonContent');
    var data = {
        rss_url: 'https://medium.com/feed/@jrkns'
    };
    $.get('https://api.rss2json.com/v1/api.json', data, function(response) {
        if (response.status == 'ok') {
            var output = '';
            var posts = $.map(response.items, function(post, i) {
                var postCategories = response.items[i].categories;
                if (postCategories.length !== 0) {
                    return post;
                }
            });
            $.each(posts, function(k, item) {
                var visibleSm;
				output += '<div class="col-sm-12 col-md-12 visible-sm">';
				output += '<div class="blog-post">';
                var tagIndex = item.description.indexOf('<img');
                var srcIndex = item.description.substring(tagIndex).indexOf('src=') + tagIndex;
                var srcStart = srcIndex + 5;
                var srcEnd = item.description.substring(srcStart).indexOf('"') + srcStart;
                var src = item.description.substring(srcStart, srcEnd);
				output += '<div class="blog-content"><center><a href="'+ item.link + '"><img class="img-responsive" src="' + src + '" width="480px" height="120px"></a><br><h4><a href="'+ item.link + '">' + item.title + '</a></h4></center>';
                output += '<div class="post-meta"><span>@' + item.pubDate + '</span>';
                output += '</div></div></div></div>';
                return true;
            });
            $content.html(output);
        }
    });
});