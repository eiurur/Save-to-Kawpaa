(() => {
  const retrieve = () => {
    const codeDOM =
      document.querySelector('.user-info__container code') ||
      document.querySelector('.dashboard code');
    const token = codeDOM ? codeDOM.textContent : '';

    if (!token) return;
    chrome.storage.sync.set({ token }, () => console.log('token ok', token));
  };

  retrieve();
})();
