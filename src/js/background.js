class Background {
    constructor() {
        var self = this;
        this.tabs = new Map();
        chrome.storage.onChanged.addListener(function (changes) {
            if ("IsYoutubeAudio" in changes) {
                let IsYoutubeAudio = changes.IsYoutubeAudio.newValue;
                if (IsYoutubeAudio) {
                    self.enableYoutubeAudio();
                }
                else {
                    self.disableYoutubeAudio();
                }
                self.refreshCurrentYoutubePage();
            }
        });
    }

    removeURLRangeKeys = (url) => {
        const removableKeys = ['range', 'rn', 'rbuf'];

        const urlSplits = url.split('?');
        if (urlSplits.length < 2) return;

        var urlKeys = urlSplits[1].split(/&/);
        urlKeys = urlKeys.filter(
            (p) => !removableKeys.map((para) => `${encodeURIComponent(para)}=`).some((enc) => p.startsWith(enc))
        );

        return urlSplits[0].concat("?", urlKeys.join('&'));
    };

    processURL = (data) => {
        const { url, tabId } = data;
        if (!url.includes('mime=audio') || url.includes('live=1')) {
            return;
        }
        const audioURL = this.removeURLRangeKeys(url);

        if (audioURL && this.tabs.get(tabId) !== audioURL) {
            this.tabs.set(tabId, audioURL);
            this.setyoutubeVideoUrl(tabId);

        }
    };

    setyoutubeVideoUrl = (tabId) => {
        if (this.tabs.has(tabId)) {
            chrome.tabs.sendMessage(tabId, { url: this.tabs.get(tabId) });
        }
    };

    enableYoutubeAudio = () => {
            chrome.webRequest.onBeforeRequest.addListener(this.processURL, { urls: ['<all_urls>'] });
            chrome.tabs.onUpdated.addListener(this.setyoutubeVideoUrl);
    }

    disableYoutubeAudio = () => {
        chrome.tabs.onUpdated.removeListener(this.setyoutubeVideoUrl);
        chrome.webRequest.onBeforeRequest.removeListener(this.processURL);
        this.tabs.clear();
    };
    refreshCurrentYoutubePage = () => {
        chrome.tabs.query({ currentWindow: true, active: true, url: '*://*.youtube.com/*' }, function (tabs) {
            if (tabs.length < 1) {
                return;
            }
            chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
        });
    };
}
const background = new Background();