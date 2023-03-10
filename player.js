
// Load playlist id from url params
var playlist = new URLSearchParams(window.location.search).get('playlist')

// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
var player;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('ytplayer', {
        width: '960',
        height: '540',
        playerVars: {
            autoplay: 0,
            listtype: 'playlist',
            list: playlist
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    var playerIndex = getCookie(playlist + ".index")
    console.log('Starting at index ' + playerIndex)
    var playerTime = getCookie(playlist + ".time")
    console.log('Starting at time ' + playerTime)
    player.loadPlaylist(playlist, playerIndex, playerTime)
}

function onPlayerStateChange(event) {
}

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
        console.log('Opened window')
    } else {
        var playerTime = player.getCurrentTime()
        console.log('Saving at time ' + playerTime)
        document.cookie = playlist + ".time=" + playerTime

        var playerIndex = player.getPlaylistIndex()
        document.cookie = playlist + ".index=" + playerIndex
        console.log('Saving at video index ' + playerIndex);

        console.log('Minimized window')
    }
});

// returns the cookie with the given name, or 0 if not found
// Modified to return a default index of 0 instead of undefined
// Source: https://github.com/javascript-tutorial/en.javascript.info/blob/master/6-data-storage/01-cookie/cookie.js
// License: https://github.com/javascript-tutorial/en.javascript.info/blob/master/LICENSE.md
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : 0;
}