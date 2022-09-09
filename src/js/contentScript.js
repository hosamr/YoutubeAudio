chrome.runtime.onMessage.addListener((request) => {
    chrome.runtime.lastError;
    const url = request.url;
    var youtubeVideo = window.document.getElementsByTagName('video')[0];
    if (typeof youtubeVideo == 'undefined' || url === '' || youtubeVideo.src.includes('mime=audio')) {
        return;
    }
    youtubeVideo.pause();
    let curr = youtubeVideo.currentTime;
    youtubeVideo.src = url;
    youtubeVideo.pause();
    youtubeVideo.currentTime = curr;
    youtubeVideo.play();
});