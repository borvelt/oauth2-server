import jQuery from 'jquery'

var hash = document.URL.substr(document.URL.indexOf('#') + 1)
hash = hash.split('&')
var data = {}
for (var i = 0; i < hash.length; i++) {
  var array
  array = hash[i].split('=')
  data[array[0]] = array[1]
}
jQuery
  .ajax({
    url: 'http://localhost:3000/oauth2/introspection',
    data: {
      token: data.access_token,
    },
    beforeSend: function(request) {
      request.setRequestHeader('Authorization', 'Bearer ' + data.access_token)
      request.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded',
      )
    },
    type: 'POST',
  })
  .done(function(result) {
    var html = ''
    for (var i = 0; i < result.scopes.length; i++) {
      html +=
        '<li>' +
        result.scopes[i].name +
        '<ol>' +
        result.scopes[i].description +
        '</ol>' +
        '</li>'
    }
    jQuery('#container').html(html)
  })
  .fail(function() {
    jQuery('#container').html('There Is No Access For This Token.')
  })
