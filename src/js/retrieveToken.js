const codeDOM =
  document.querySelector('.user-info__container code') ||
  document.querySelector('.dashboard code');
const kawpaaToken = codeDOM ? codeDOM.textContent : '';

if (kawpaaToken) {
  chrome.storage.sync.set({ token: kawpaaToken }, () =>
    console.log('token ok', token),
  );
}
