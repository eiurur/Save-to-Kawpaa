(function() {
  var SELECTOR_POST_SECTIONS, sendBackground, showKawpaaLink;
  SELECTOR_POST_SECTIONS = '#post-sections';
  showKawpaaLink = function() {
    var html;
    html = "<li><a class=\"kawpaa-save-link\" href=\"#\">Save to Kawpaa</a></li>";
    return $(document).find(SELECTOR_POST_SECTIONS).append(html);
  };
  sendBackground = function(params) {
    console.log(params);
    return chrome.runtime.sendMessage(params, function(response) {
      return console.log(response);
    });
  };
  $(document).on('click', '.kawpaa-save-link', function(e) {
    var originalImageSrc, params, srcUrl;
    e.preventDefault();
    originalImageSrc = $('#image').attr('src').replace('sample/sample-', '');
    srcUrl = "https://danbooru.donmai.us" + originalImageSrc;
    params = {
      name: 'danbooru',
      info: {
        type: 'image',
        srcUrl: srcUrl
      }
    };
    return sendBackground(params);
  });
  return showKawpaaLink();
})();
