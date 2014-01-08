$.fn.form_values = function() {
    function is_multiple_field(form, name) {
        var f = form.find('[name="' + name + '"]');
        return f.attr('multiple') !== undefined;
    }

    var values = {};
    var form = $(this);
    $.each(form.serializeArray(), function(i, field) {
        if (is_multiple_field(form, field.name)) {
            if (!values[field.name]) values[field.name] = [];
            values[field.name].push(field.value);
        } else {
            values[field.name] = field.value;
        }
    });
    return values;
};
