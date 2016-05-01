do ->
  codeDOM = document.querySelector('.user-info__container code') or document.querySelector('.dashboard code')
  console.log codeDOM

  token = if codeDOM then codeDOM.textContent else ''
  console.log token

  return unless token
  item  = token: token

  # inboxが空でないときは保存されない。(両方とも空だから失敗する？)
  chrome.storage.sync.set item, -> console.log 'token ok', token