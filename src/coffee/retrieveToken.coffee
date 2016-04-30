$ ->
  token_in_top_page = $(".user-info__container code").text()
  token_in_account_page = $(".dashboard code").text()
  token = token_in_top_page or token_in_account_page
  item  = token: token

  # inboxが空でないときは保存されない。(両方とも空だから失敗する？)
  chrome.storage.sync.set item, -> console.log 'token ok', token