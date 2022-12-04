fetch('https://v.redd.it/c6aqs8dq9k2a1')
    .then(res => {
        return res.text();
    })
    .then(body => {
        const urls = body.match(urlRegex());
        const mediaUrls = urls.filter(url => url.includes("v.redd.it"));
        let mediaUrl = mediaUrls[0].split("https://v.redd.it/")[1];
        mediaId = mediaUrl.split("/")[0];
        testUrls(mediaId);
    });

function testUrls(mediaId) {
    console.log('Hold on, Fetching the Best Quality');
    _res.forEach(res => {
        fetch(`https://v.redd.it/${mediaId}/DASH_${res}`)
        .then(response => {
            if (response.status === 200 && !oneDownload) {
                oneDownload = true;
                url1 = `https://v.redd.it/${mediaId}/DASH_${res}`;
            }
        });
    });
}