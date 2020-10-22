# Save to Kawpaa

<div align="center">
  <img src="https://github.com/eiurur/Save-to-Kawpaa/raw/master/images/kawpaa.jpg" alt="columns" width="880" height="auto">
</div>

<p>
This is a Chrome Extension that allows you to register contents to <a href="https://kawpaa.eiurur.xyz/" target="_blank">Kawpaa</a> that aggregates images/videos/text/links used for masturbation.
</p>

# Status

<p align="left">
<a href="https://github.com/eiurur/Save-to-Kawpaa/actions?query=workflow%3Anodejs"><img src="https://github.com/eiurur/Save-to-Kawpaa/workflows/Node.js%20CI/badge.svg?branch=master" alt="Node.js CI"></a>
</p>

# Usage

## How to setup

1. Go to <a href="https://github.com/eiurur/Save-to-Kawpaa/releases" target="_blank">Release page</a>.
2. Download a zip file of latest version. (ex) `Save.to.Kawpaa.v0.14.0.zip`
3. Drop a zip file to <a href="chrome://extensions" target="_blank">chrome://extensions</a>

![](https://github.com/eiurur/Save-to-Kawpaa/raw/master/images/description/drop.jpg)

4. Open option page.

![](https://github.com/eiurur/Save-to-Kawpaa/raw/master/images/description/open_option.jpg)

5. Copy token on <a href="https://kawpaa.eiurur.xyz/account" target="_blank">Kawpaa's account page</a>

![](https://github.com/eiurur/Save-to-Kawpaa/raw/master/images/description/copy.jpg)

<br>

## How to save

**Image**

if you want to save the image, open context menu on the image and click "Save to
Kawpaa with Image".

![](https://github.com/eiurur/Save-to-Kawpaa/raw/master/images/image.png)

**Link**

if you want to save like Pocket the URL for the page you're seeing, click this
icon.

![](https://github.com/eiurur/Save-to-Kawpaa/raw/master/images/link.png)

**Movie**

To be written

**Text**

To be written

## How to browse

Go to Site

> <a href="https://kawpaa.eiurur.xyz/" target="_blank">Kawpaa</a>

<br>

# Support Service

- [x] Danbooru
- [x] DeviantART
- [x] Gelbooru
- [x] <a href="http://ecchi.iwara.tv" target="_blank">Iwara.tv</a>
- [x] Konachan
- [x] Nijie (ニジエ)
- [x] pixiv
- [x] Twitter
- [x] TweetDeck
- [x] SankakuComplex
- [x] yande.re
- [x] 2chan.net (ふたばちゃんねる)
- [x] anime-picutres.net
- [x] nozomi.la

* [ ] DLSite
* [ ] DMM.com
* [ ] pinterest
* [ ] pornhub
* [ ] youtube

<br>

# Shortcut

you can save the link with shortcut

- Windows -- `Ctrl + Shift + U`

- Mac -- `Command + Shift + U`

<br>

# Development

    $ git clone https://github.com/eiurur/Save-to-Kawpaa
    $ cd Save-to-Kawpaa
    $ npm i
    $ npm run build
    $ npm run start

# Memo

If you save link on the following page, it will extract the example value and send it to the server.

> <a href="https://twitter.com/haruyuki_nijyou/status/687040101721874432" target="_blank">はる雪さんは Twitter を使っています : &quot; 中学生大家さん
> https://t.co/VP0YdGl1YE&quot;</a>

| プロパティ名 | 説明                                                                                            | 例                                                                              | デフォルトのクエリ                              |
| ------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------- |
| title        | ページタイトル                                                                                  | はる雪さんは Twitter を使っています : " 中学生大家さん https://t.co/VP0YdGl1YE" | \$('head title').text()                         |
| siteName     | サイトの名前                                                                                    |                                                                                 | \$('meta[property="og:site_name"]').text()      |
| siteUrl      | サイトの URL                                                                                    | https://twitter.com/haruyuki_nijyou/status/687040101721874432                   | \$(location).attr('href')                       |
| url          | イラストまたはリンクの URL                                                                      | https://twitter.com/haruyuki_nijyou/status/687040101721874432                   |                                                 |
| type         | コンテンツの種類 (image/link)                                                                   | link                                                                            |                                                 |
| hostName     | ホスト名                                                                                        | twitter.com                                                                     | location.host                                   |
| description  | サイトの説明                                                                                    | “ 中学生大家さん ”                                                              | \$('meta[name="description"]').attr('content')  |
| siteImage    | type が image であれば、対象の画像 URL、type が link であればページで最初に見つかった画像の URL | https://pbs.twimg.com/media/CYjbVOCVAAAEegD.png:large                           | \$('meta[property="og:image"]').attr('content') |
| favicon      | ファビコン                                                                                      | https://abs.twimg.com/favicons/favicon.ico                                      | \$('link[rel="shortcut icon"]').prop('href')    |
| isPrivate    | 非公開か否かの Boolean 値。固定値。                                                             | true                                                                            |                                                 |
| isArchive    | Archive に属するコンテンツか否かの Boolean 値。固定値。                                         | false                                                                           |                                                 |
