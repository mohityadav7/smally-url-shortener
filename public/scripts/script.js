// switch stylesheets and save theme in using cookies
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function applyDarkTheme(darksheet, lightsheet, darkly, minty) {
    darksheet.disabled = false;
    lightsheet.disabled = true;
    darkly.disabled = false;
    minty.disabled = true;
    // themeSheet.href = "https://bootswatch.com/4/darkly/bootstrap.min.css";
    setCookie("theme", 'dark', 90);
}

function applyLightTheme(darksheet, lightsheet, darkly, minty) {
    lightsheet.disabled = false;
    darksheet.disabled = true;
    // themeSheet.href = "https://bootswatch.com/4/minty/bootstrap.min.css";
    minty.disabled = false;
    darkly.disabled = true;
    setCookie("theme", 'light', 90);
}

function switchTheme() {
    var darksheet = document.getElementById('darkStylesheet');
    var lightsheet = document.getElementById('lightStylesheet');
    var darkly = document.getElementById('darkly');
    var minty = document.getElementById('minty');

    if (darksheet.disabled || !lightsheet.disabled) {
        applyDarkTheme(darksheet, lightsheet, darkly, minty);
    } else {
        applyLightTheme(darksheet, lightsheet, darkly, minty);
    }
}

// check theme cookie and apply theme if theme cookie exist otherwise set new cookie
$(document).ready(function () {
    var theme = getCookie("theme");
    if (theme != "") {
        var darksheet = document.getElementById('darkStylesheet');
        var lightsheet = document.getElementById('lightStylesheet');
        var darkly = document.getElementById('darkly');
        var minty = document.getElementById('minty');
        var theme = getCookie('theme');
        if (theme == 'dark') {
            applyDarkTheme(darksheet, lightsheet, darkly, minty);
        } else {
            applyLightTheme(darksheet, lightsheet, darkly, minty);
        }
    } else {
        setCookie("theme", 'dark', 90);
    }
});

// copy to clipboard
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