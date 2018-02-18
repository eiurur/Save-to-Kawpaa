# Save to Kawpaa

Chrome Extension to assist your masturbation life. Old name is 'Save to Ona it
Later'.

This is to be used in conjunction with the web service
(<a href="https://kawpaa.eiurur.xyz/" target="_blank">Kawpaa</a>).

# Usage

## Save

**Image**

if you want to save the image, open context menu on the image and click "Save to
Kawpaa with Image".

![](https://github.com/eiurur/Save-to-Kawpaa/raw/master/images/image.png)

**Link**

if you want to save like Pocket the URL for the page you're seeing, click this
icon.

![](https://github.com/eiurur/Save-to-Kawpaa/raw/master/images/link.png)

## Browse

Go to Site

> <a href="https://kawpaa.eiurur.xyz/" target="_blank">Kawpaa</a>

# Support Service

* [x] Danbooru
* [x] DeviantART
* [x] Gelbooru
* [x] Konachan
* [x] pixiv
* [x] yande.re
* [x] tumblr (x_x unsupport multi-illustrations)
* [x] Twitter
* [x] TweetDeck
* [x] <a href="http://ecchi.iwara.tv" target="_blank">Iwara</a>
* [x] ニジエ

# Shortcut

you can save the link with shortcut

* Windows -- `Ctrl + Shift + U`

* Mac -- `Command + Shift + U`

# Development

    $ git clone https://github.com/eiurur/Save-to-Kawpaa
    $ cd Save-to-Kawpaa
    $ npm i
    $ npm run build
    $ npm run start

# Memo

以下のページで link を保存した場合、例のような値を抽出してサーバに送信する。

> <a href="https://twitter.com/haruyuki_nijyou/status/687040101721874432" target="_blank">はる雪さんは Twitter を使っています : &quot; 中学生大家さん
> https://t.co/VP0YdGl1YE&quot;</a>

| プロパティ名 | 説明                                                                                            | 例                                                                              | デフォルトのクエリ                             |
| ------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------- |
| title        | ページタイトル                                                                                  | はる雪さんは Twitter を使っています : " 中学生大家さん https://t.co/VP0YdGl1YE" | $('head title').text()                         |
| siteName     | サイトの名前                                                                                    |                                                                                 | $('meta[property="og:site_name"]').text()      |
| siteUrl      | サイトの URL                                                                                    | https://twitter.com/haruyuki_nijyou/status/687040101721874432                   | $(location).attr('href')                       |
| url          | イラストまたはリンクの URL                                                                      | https://twitter.com/haruyuki_nijyou/status/687040101721874432                   |                                                |
| type         | コンテンツの種類 (image/link)                                                                   | link                                                                            |                                                |
| hostName     | ホスト名                                                                                        | twitter.com                                                                     | location.host                                  |
| description  | サイトの説明                                                                                    | “ 中学生大家さん ”                                                              | $('meta[name="description"]').attr('content')  |
| siteImage    | type が image であれば、対象の画像 URL、type が link であればページで最初に見つかった画像の URL | https://pbs.twimg.com/media/CYjbVOCVAAAEegD.png:large                           | $('meta[property="og:image"]').attr('content') |
| favicon      | ファビコン                                                                                      | https://abs.twimg.com/favicons/favicon.ico                                      | $('link[rel="shortcut icon"]').prop('href')    |
| isPrivate    | 非公開か否かの Boolean 値。固定値。                                                             | true                                                                            |                                                |
| isArchive    | Archive に属するコンテンツか否かの Boolean 値。固定値。                                         | false                                                                           |                                                |
