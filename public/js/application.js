(function($) {
  // Handles "data-method" on links such as:
  // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
  function handleMethod(link) {
    var href = link.attr('href'),
      method = link.data('method'),
      csrf_token = $('meta[name=csrf-token]').attr('content'),
      csrf_param = $('meta[name=csrf-param]').attr('content'),
      form = $('<form method="post" action="' + href + '"></form>'),
      metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

    if (csrf_param !== undefined && csrf_token !== undefined) {
      metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
    }

    form.hide().append(metadata_input).appendTo('body');
    form.submit();
  }

  // confirm daialog
  function allowAction(element) {
    var message = element.data('confirm');
    return !message || confirm(message);
  }

  // data-method init
  $(document).on('click', 'a[data-confirm], a[data-method]', function(e) {
    var link = $(this);
    if (!allowAction(link)) return false;
    handleMethod(link);
    return false;
  })

  // dropdown init
  $('.dropdown-toggle').dropdown();
})( jQuery );

