$(document).ready(function () {
  $('#shortUrlCreatorForm').submit(function (e) {
    e.preventDefault();
    var u = $('#url').val();
    var k = $('#key').val();

    $.ajax({
        type: 'POST',
        url: '/shorten',
        data: {
          url: u,
          key: k
        }
      })
      .done(function () {
        console.log("success");
        $('.result').html = 'success!';
      })
      .fail(function () {
        console.log("error");
      })
      .always(function () {
        console.log("complete");
      })
  });
});