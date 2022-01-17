// *********************************************************
// STYLING HELPER FUNCTIONS
// *********************************************************
function focusDanger(element) {
  element.addClass('focus-danger');
  element.removeClass('focus-success');
  element.removeClass('focus-info');
}

function focusSuccess(element) {
  element.addClass('focus-success');
  element.removeClass('focus-danger');
  element.removeClass('focus-info');
}

function focusInfo(element) {
  element.addClass('focus-info');
  element.removeClass('focus-danger');
  element.removeClass('focus-success');
}

// check existence using XMLHttpRequest
// not in use
// function UrlExists(url, callback) {
//     var http = new XMLHttpRequest();
//     http.open('HEAD', url);
//     http.onreadystatechange = function () {
//         if (this.readyState == this.DONE) {
//             console.log('here');
//             callback(this.status != 404);
//         }
//     };
//     http.send();
// }

// *********************************************************************
// HELPER FUNCTIONS
// *********************************************************************
const debounce = (delay, fn) => {
  let timer = null;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
};

function isURL(str, callback) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  // return pattern.test(str);
  callback(pattern.test(str));
}

// for test
function issURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return pattern.test(str);
}

// check existence using jquery AJAX
// function urlExists(url, callback) {
//     $.ajax({
//         type: 'HEAD',
//         url: url,
//         success: function () {
//             callback(true);
//         },
//         error: function () {
//             callback(false);
//         }
//     });
// }

// Outputs on page whether url is valid or not
// function go(url) {
//     $('#urlValidation').text("Checking...");
//     urlExists(url, function (exists) {
//         if (exists) {
//             $('#urlValidation').text("Looks good!");
//             focusSuccess($('#url'));
//             console.log('exists');
//         } else {
//             $('#urlValidation').text("Please enter a valid URL");
//             focusDanger($('#url'));
//             console.log('Doesnt exist');
//         }
//     });
// }

// *********************************************************************
// URL VALIDATION
// *********************************************************************
function checkUrl() {
  var input = $('#url')[0].value;
  console.log('checking ' + input);
  if (input.length == 0) {
    focusInfo($('#url'));
  } else {
    isURL(input, function (exists) {
      if (exists) {
        $('#urlValidation').text('Looks good!');
        focusSuccess($('#url'));
        console.log('exist');
      } else {
        $('#urlValidation').text('Please enter a valid URL');
        focusDanger($('#url'));
        console.log('Doesnt exist');
      }
    });
  }
}

// function checkUrl2() {
//     var input = $('#url')[0].value;
//     var modifiedInput = input;
//     if ((input.substr(0, 7) != 'http://') && (input.substr(0, 8) != 'https://')) {
//         modifiedInput = 'http://' + input;
//     } else {
//         modifiedInput = input;
//     }
//     modifiedInput = 'https://cors.io/?' + modifiedInput;
//     go(modifiedInput);
// }

// *********************************************************************
// CHECK IF KEY IS AVAILABLE OR ALREADY IN USE
// *********************************************************************
// variable to store previous XMLHttpRequest object return by $.ajax()
var xhr;

function checkKeyAvailability() {
  var inputKey = $('#key')[0].value;

  // abort previous request if any
  if (xhr) {
    xhr.abort();
  }

  // return ajax promise
  return (xhr = $.ajax({
    type: 'GET',
    url: '/keycheck/' + inputKey,
    async: false,
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log('textStatus: ' + textStatus + 'error: ' + errorThrown);
  }));
}

// *********************************************************************
// CUSTOM KEY VALIDATION
// *********************************************************************
let checkCustomKey = debounce(300, function () {
  var key = $('#key')[0].value;
  key = key.trim();

  var regexp = new RegExp('^[a-zA-Z0-9-_]+$');
  var isValid = regexp.test(key);
  console.log('isValid: ' + isValid);
  if (!isValid && key.length != 0) {
    $('#keyValidation').text('Only letters, numbers, and dashes are allowed.');
    focusDanger($('#key'));
  } else {
    if (key.length <= 2) {
      if (key.length == 0) {
        $('#keyValidation').text('');
        focusSuccess($('#key'));
      } else {
        $('#keyValidation').text('Too short  :/');
        focusDanger($('#key'));
      }
    } else {
      const keyValidation = $('#keyValidation');
      document.getElementById('keyValidation').innerHTML = 'Checking...';
      var promise = checkKeyAvailability();
      promise.done(function (data) {
        console.log('data: ' + data);
        if (data == 'a') {
          console.log('available');
          focusSuccess($('#key'));
          keyValidation.text('Available');
        } else if (data == 'na') {
          console.log('not available');
          focusDanger($('#key'));
          keyValidation.text('Not available');
        }
      });
    }
  }
});
