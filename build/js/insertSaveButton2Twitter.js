(function() {
  var DATA_URL_BLUE_16, DATA_URL_GRAY_16, SELECTOR_JS_STREAM_TWEET, SELECTOR_JS_TWEET_TEXT, SELECTOR_PERMALINK_TWEET_CONTAINER, Twitter, removeKawpaaButton, sendBackground, showKawpaaButton;
  showKawpaaButton = function(_$) {
    var existKawpaaButton, hasPhoto, html;
    hasPhoto = _$.find('.js-adaptive-photo').length > 0;
    existKawpaaButton = _$.find('.action-kawpaa-container').length !== 0;
    if (existKawpaaButton) {
      return;
    }
    if (!hasPhoto) {
      return;
    }
    html = "<div class=\"ProfileTweet-action action-kawpaa-container\" style=\"display: inline-block; width: 26px;\">\n  <a class=\"js-tooltip kawpaa-save-link\" href=\"#\" data-original-title=\"Save to Kawpaa\" style=\"display: inline-block; float: left;\">\n    <span class=\"icon icon-kawpaa\" style=\"display: block; height: 16px; position: relative; top: 3px; width: 16px; background-image: url(" + DATA_URL_GRAY_16 + ");\">a</span>\n  </a>\n</div>";
    return _$.find('.ProfileTweet-actionList').append(html);
  };
  removeKawpaaButton = function(_$) {
    var existKawpaaButton;
    existKawpaaButton = _$.find('.action-kawpaa-container').length !== 0;
    if (!existKawpaaButton) {
      return;
    }
    return _$.find('.action-kawpaa-container').remove();
  };
  sendBackground = function(params) {
    console.log(params);
    return chrome.runtime.sendMessage(params, function(response) {
      return console.log(response);
    });
  };
  Twitter = (function() {
    Twitter.SELECTOR_JS_STREAM_TWEET = '.js-stream-tweet';

    Twitter.SELECTOR_JS_TWEET_TEXT = '.js-tweet-text';

    Twitter.SELECTOR_PERMALINK_TWEET_CONTAINER = '.permalink-tweet-container';

    function Twitter() {
      this.qJsStreamTweet = $(this).closest(Twitter.SELECTOR_JS_STREAM_TWEET);
      this.qPermalinkTweetContaner = $(this).closest(Twitter.SELECTOR_PERMALINK_TWEET_CONTAINER);
    }

    Twitter.prototype.bindEvent = function() {
      $(document).on({
        'mouseenter': function(e) {
          return showKawpaaButton($(this));
        }
      }, SELECTOR_PERMALINK_TWEET_CONTAINER);
      $(document).on({
        'mouseenter': function(e) {
          return showKawpaaButton($(this));
        }
      }, SELECTOR_JS_STREAM_TWEET);
      return $(document).on('click', SELECTOR_KAWPAA_SAVE_LINK, function(e) {
        return e.preventDefault();
      });
    };

    return Twitter;

  })();
  SELECTOR_JS_STREAM_TWEET = '.js-stream-tweet';
  SELECTOR_JS_TWEET_TEXT = '.js-tweet-text';
  SELECTOR_PERMALINK_TWEET_CONTAINER = '.permalink-tweet-container';

  /*
  Individual tweet page
   */
  $(document).on({
    'mouseenter': function(e) {
      return showKawpaaButton($(this));
    }
  }, SELECTOR_PERMALINK_TWEET_CONTAINER);

  /*
  Home timeline
   */
  $(document).on({
    'mouseenter': function(e) {
      return showKawpaaButton($(this));
    }
  }, SELECTOR_JS_STREAM_TWEET);
  $(document).on('click', '.kawpaa-save-link', function(e) {
    var $jsStreamTweet, $permalinkTweetContaner, _targetElement, imageUrl, nowPageVariable, params, title, tweetUrl;
    e.preventDefault();
    $(this).find('.icon-kawpaa').css('background-image', "url(" + DATA_URL_BLUE_16 + ")");
    $jsStreamTweet = $(this).closest(SELECTOR_JS_STREAM_TWEET);
    $permalinkTweetContaner = $(this).closest(SELECTOR_PERMALINK_TWEET_CONTAINER);
    nowPageVariable = $jsStreamTweet.length > 0 ? 'homeTImeline' : void 0;
    switch (nowPageVariable) {
      case 'homeTImeline':
        _targetElement = $jsStreamTweet;
        break;
      default:
        _targetElement = $permalinkTweetContaner;
    }
    tweetUrl = _targetElement.find('.js-permalink').attr('href');
    imageUrl = _targetElement.find('.js-adaptive-photo').attr('data-image-url');
    title = (_targetElement.find('.js-action-profile-name').text()) + " / " + (_targetElement.find(SELECTOR_JS_TWEET_TEXT).text());
    params = {
      name: 'twitter',
      info: {
        siteUrl: "https://twitter.com" + tweetUrl,
        type: 'image',
        srcUrl: imageUrl + ":orig",
        title: title
      }
    };
    return sendBackground(params);
  });
  DATA_URL_GRAY_16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYYByssdLYJhQAABBtJREFUOBEBEATv+wEAAAAAAAAAAAAAAACenp4AYmJiAJ6engQAAABOAAAAKAAAAAAAAADYAAAAsWJiYv2enp4AYmJiAAAAAAAAAAAAAQAAAAAAAAAAnp6eAAAAAAIAAACeAAAAXwAAALYAAADRAAAAAAAAAC8AAABKAAAAoAAAAGMAAAD+YmJiAAAAAAABAAAAAJ6engAAAAAXAAAA4wAAAIRiYmKCAAAAAAAAAAAAAAAAAAAAAAAAAACenp5/AAAAewAAABwAAADqYmJiAAGenp4AAAAAAgAAAPgAAABEYmJiwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp4/AAAAuwAAAAgAAAD+AAAAAACenp6gnp6efgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp5/np6enwAAAAABnp6eBAAAAPtiYmIBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp7/AAAABAIAAABOAAAAtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALcAAABOAgAAACgAAADRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0QAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAADYAAAALwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8AAADYAgAAALIAAABKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASQAAALIAAAAAAJ6enp+enp5+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ6enoCenp6eAAAAAAGenp4AAAAAAgAAAPgAAABEYmJiwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACenp4/AAAAuwAAAAcAAAD/AmJiYgAAAAD+AAAAHQAAALyenp5+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnp6egAAAALsAAAAcAAAA/2JiYgABAAAAAAAAAACenp4AAAAAAgAAAJ0AAABgAAAAtgAAANEAAAAAAAAALwAAAEoAAACfAAAAYwAAAP9iYmIAAAAAAAIAAAAAAAAAAGJiYgAAAAD+YmJiYQAAAAQAAACdAAAA9AAAAPQAAACdAAAABGJiYmIAAAD/YmJiAAAAAAAAAAAA4IxvG+IdfVgAAAAASUVORK5CYII=";
  return DATA_URL_BLUE_16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYYBzM05cEJigAABBtJREFUOBEBEATv+wEAAAAAAAAAAAAAAAAbescA5YY5ABt6xwQAAABOAAAAKAAAAAAAAADYAAAAseWGOf0bescA5YY5AAAAAAAAAAAAAQAAAAAAAAAAG3rHAAAAAAIAAACeAAAAXwAAALYAAADRAAAAAAAAAC8AAABKAAAAoAAAAGMAAAD+5YY5AAAAAAAEAAAAABt6xwAAAAAXAAAA4wAAAITlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/AAAA+AAAABwbesfq5YY5AAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAgAAAD+AAAAAAAbesegG3rHfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesd/G3rHnwAAAAABG3rHBAAAAPvlhjkBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesf/AAAABAIAAABOAAAAtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALcAAABOAgAAACgAAADRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0QAAACgCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAADYAAAALwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8AAADYAgAAALIAAABKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASQAAALIAAAAAABt6x58besd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6x4AbeseeAAAAAAEbescAAAAAAgAAAPgAAABE5YY5wgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbesc/AAAAuwAAAAcAAAD/AuWGOQAAAAD+AAAAHQAAALwbesd+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG3rHgAAAALsAAAAcAAAA/+WGOQABAAAAAAAAAAAbescAAAAAAgAAAJ0AAABgAAAAtgAAANEAAAAAAAAALwAAAEoAAACfAAAAYwAAAP/lhjkAAAAAAAIAAAAAAAAAAOWGOQAAAAD+5YY5YQAAAAQAAACdAAAA9AAAAPQAAACdAAAABOWGOWIAAAD/5YY5AAAAAAAAAAAA+yVtBA+LUxoAAAAASUVORK5CYII=";
})();
