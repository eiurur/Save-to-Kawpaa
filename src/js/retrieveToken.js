(() => {
  const codeDOM = document.querySelector('.user-info__container code') || document.querySelector('.dashboard code');
  const token = codeDOM ? codeDOM.textContent : '';
  if (!token) { return; }

  // inboxが空でないときは保存されない。(両方とも空だから失敗する？)
  chrome.storage.sync.set({token}, () => console.log('token ok', token));
})