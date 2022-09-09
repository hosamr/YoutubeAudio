var checkbox = document.getElementById("checkboxSwitchSlider");
if (checkbox) {
    chrome.storage.local.get('IsYoutubeAudio', function (result) {
        checkbox.checked = result.IsYoutubeAudio;
    });
    checkbox.addEventListener('change', function (e) {
        chrome.storage.local.set({ IsYoutubeAudio: this.checked });
    })
}