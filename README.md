Save to Kawpaa
====

Old name is 'Save to Ona it Later'.

Chrome Extension to assist your masturbation life.

This is to be used in conjunction with the web service (<a href="https://kawpaa.eiurur.xyz/" target="_blank">Kawpaa</a>).

## Satus

WIP

## MEMO

以下のページでlinkを保存した場合、例のような値を抽出してサーバに送信する。

> <a href="https://twitter.com/haruyuki_nijyou/status/687040101721874432" target="_blank">はる雪さんはTwitterを使っています: &quot;中学生大家さん https://t.co/VP0YdGl1YE&quot;</a>

| プロパティ名 | 説明                                                                                    | 例                                                                          | デフォルトのクエリ                             |
|--------------|-----------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|------------------------------------------------|
| title        | ページタイトル                                                                          | はる雪さんはTwitterを使っています: "中学生大家さん https://t.co/VP0YdGl1YE" | $('head title').text()                         |
| siteName     | サイトの名前                                                                            |                                                                             | $('meta[property="og:site_name"]').text()      |
| siteUrl      | サイトのURL                                                                             | https://twitter.com/haruyuki_nijyou/status/687040101721874432               | $(location).attr('href')                       |
| url          | イラストまたはリンクのURL                                                               | https://twitter.com/haruyuki_nijyou/status/687040101721874432               |                                                |
| type         | コンテンツの種類(image/link)                                                                        | link                                                                        |                                                |
| hostName     | ホスト名                                                                                | twitter.com                                                                 | location.host                                  |
| description  | サイトの説明                                                                            | “中学生大家さん”                                                            | $('meta[name="description"]').attr('content')  |
| siteImage    | typeがimageであれば、対象の画像URL、typeがlinkであればページで最初に見つかった画像のURL | https://pbs.twimg.com/media/CYjbVOCVAAAEegD.png:large                       | $('meta[property="og:image"]').attr('content') |
| favicon      | ファビコン                                                                              | https://abs.twimg.com/favicons/favicon.ico                                  | $('link[rel="shortcut icon"]').prop('href')    |
| isPrivate    | 非公開か否かのBoolean値。固定値。                                                       | true                                                                        |                                                |
| isArchive    | Archiveに属するコンテンツか否かのBoolean値。固定値。                                    | false                                                                       |                                                |

