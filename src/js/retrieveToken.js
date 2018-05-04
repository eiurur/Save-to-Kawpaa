const codeDOM =
  document.querySelector('.user-info__container code') ||
  document.querySelector('.dashboard code');
const token = codeDOM ? codeDOM.textContent : '';

if (token) {
  chrome.storage.sync.set({ token }, () => console.log('token ok', token));
}
