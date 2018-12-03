function switchTheme() {
    console.log("changing stylesheet\nBefore:");
    var sheets = document.styleSheets;
    for (var x = 0; x < sheets.length; ++x) {
        console.log(sheets[x]);
    }
    var darksheet = document.getElementById('darkStylesheet');
    var lightsheet = document.getElementById('lightStylesheet');
    var themeSheet = document.getElementById('themeStylesheet');

    if (darksheet.disabled || !lightsheet.disabled) {
        darksheet.disabled = false;
        lightsheet.disabled = true;
        themeSheet.href = "https://bootswatch.com/4/darkly/bootstrap.min.css";
    } else {
        lightsheet.disabled = false;
        darksheet.disabled = true;
        themeSheet.href = "https://bootswatch.com/4/minty/bootstrap.min.css";
    }
    console.log("after:\n")
    var sheets = document.styleSheets;
    for (var x = 0; x < sheets.length; ++x) {
        console.log(sheets[x]);
    }
}

function copyToClipBoard() {
    node = document.getElementById('result');
    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
    document.execCommand("copy");
}

// add onclick event on qr button to view qr codes
$(document).ready(function () {
    $('#getQRCodeButton').on('click', function () {
        const shortedUrl = $('#result')[0].text;
        const unshortedUrl = $('#originalUrl')[0].text;
        $.ajax({
            type: "get",
            url: '/qr/',
            data: 'url=' + shortedUrl,
            success: function (svg) {
                var qrShorted = $('#qr-shorted-img');
                qrShorted.html(svg);
                console.log("success");
            },
            error: function (err) {
                console.log('error: ' + err.message);
            }
        });
        $.ajax({
            type: "get",
            url: '/qr/',
            data: 'url=' + unshortedUrl,
            success: function (svg) {
                var qrUnshorted = $('#qr-unshorted-img');
                qrUnshorted.html(svg);
                console.log("success");
            },
            failure: function (err) {
                console.log('failed with error: ' + err);
            }
        });
    });
});

// add on click listener on view qr buttons
$(document).ready(function () {
    $('.viewQRCodeButton').on('click', function () {
        var row = this.parentNode.parentNode;
        var unshortedUrl = row.childNodes[3].childNodes[1].text;
        var shortedUrl = row.childNodes[5].childNodes[1].text;
        console.log('unshortedUrl: ' + unshortedUrl);
        console.log('shortedUrl: ' + shortedUrl);
        $.ajax({
            type: "get",
            url: '/qr/',
            data: 'url=' + shortedUrl,
            success: function (svg) {
                var qrShorted = $('#qr-shorted-img');
                qrShorted.html(svg);
                console.log("success");
            },
            error: function (err) {
                console.log('error: ' + err.message);
            }
        });
        $.ajax({
            type: "get",
            url: '/qr/',
            data: 'url=' + unshortedUrl,
            success: function (svg) {
                var qrUnshorted = $('#qr-unshorted-img');
                qrUnshorted.html(svg);
                console.log("success");
            },
            failure: function (err) {
                console.log('failed with error: ' + err);
            }
        });
    });
});