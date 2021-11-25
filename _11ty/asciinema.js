module.exports = function(id, title) {
    const params = "autoplay=1&loop=1&cols=112";
    const src = `https://asciinema.org/a/${id}/embed?${params}`;
    return `
<div id="asciicast-container-${id}" class="asciicast" style="display: block; float: none; overflow: hidden; padding: 0px; margin: 20px 0px;">
<iframe src="${src}" title="${title}" id="asciicast-iframe-${id}" name="asciicast-iframe-${id}" scrolling="no" allow="fullscreen" style="border: 0;" hidden onload="this.removeAttribute('hidden');"></iframe>
<noscript><img src="https://asciinema.org/a/${id}.png"></noscript>
</div>
`;
};
