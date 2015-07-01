$(function() {
  var getToken, save2Server, scrapingMetaData;
  save2Server = function(data, token) {
    return new Promise(function(resolve, reject) {
      var destUrl;
      destUrl = 'https://tk2-207-13331.vs.sakura.ne.jp:9021/api/posts';
      return $.ajax({
        type: "POST",
        url: destUrl,
        data: {
          token: token,
          post: data
        },
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }).done(function(data) {
        console.log(data);
        return resolve(data);
      }).fail(function(err) {
        console.log(err);
        return reject(err);
      });
    });
  };
  getToken = function() {
    return new Promise(function(resolve, reject) {
      return chrome.storage.sync.get(['token'], function(item) {
        console.log(item);
        if (item.token === void 0 || item.token === '') {
          return reject(void 0);
        }
        return resolve(item.token);
      });
    });
  };
  scrapingMetaData = function() {
    return new Promise(function(resolve, reject) {
      var data, description1, description2, favicon, firstImgUrlInBody, hostName, siteImage, siteName, siteUrl1, siteUrl2, title1, title2;
      data = {};
      console.log('=============>');
      console.log('=======> info');
      console.log(info);
      console.log('=======> タイトル');
      title1 = $('head title').text();
      console.log(title1);
      title2 = $('meta[property="og:title"]').attr('content');
      console.log(title2);
      data.title = title1 || title2;
      console.log('=======> サイトの名前');
      siteName = $('meta[property="og:site_name"').text();
      console.log(siteName);
      data.siteName = siteName;
      console.log('=======> サイトのURL');
      siteUrl1 = $(location).attr('href');
      console.log(siteUrl1);
      siteUrl2 = $('meta[property="og:url"]').attr('content');
      console.log(siteUrl2);
      data.siteUrl = siteUrl1 || siteUrl2;
      if (((typeof info !== "undefined" && info !== null ? info.mediaType : void 0) != null) && info.mediaType === 'image') {
        data.url = info.srcUrl;
        data.type = 'image';
      } else {
        firstImgUrlInBody = $('img').get(0).src;
        data.url = firstImgUrlInBody;
        data.type = 'link';
      }
      hostName = location.host;
      console.log(hostName);
      data.hostName = hostName;
      console.log('=======> 説明');
      description1 = $('meta[name="description"]').attr('content');
      console.log(description1);
      description2 = $('meta[property="og:description"]').attr('content');
      console.log(description2);
      data.description = description1 || description2;
      console.log('=======> サイトの画像');
      siteImage = $('meta[property="og:image"]').attr('content');
      console.log(siteImage);
      data.siteImage = siteImage;
      console.log('=======> faviconのURL');
      favicon = $('link[rel="shortcut icon"]').prop('href');
      console.log(favicon);
      data.favicon = favicon;
      data.isPrivate = true;
      data.isArchive = false;
      console.log(data);
      return resolve(data);
    });
  };
  return (function() {
    alertify.log("保存中 ......");
    return Promise.all([scrapingMetaData(), getToken()]).then(function(arg) {
      var data, token;
      data = arg[0], token = arg[1];
      return save2Server(data, token);
    }).then(function(data) {
      chrome.runtime.sendMessage({
        "newIconPath": 'build/images/blue/icon19.png'
      });
      return alertify.success("保存しました。");
    })["catch"](function(err) {
      return alertify.error("トークンに誤りがあります。\nもう一度確認してみてください。");
    });
  })();
});
