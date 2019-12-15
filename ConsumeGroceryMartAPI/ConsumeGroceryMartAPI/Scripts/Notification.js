
    $(document).ready(function () {

        $.ajax({
            type: "POST",
            url: '/Notifications/Notifications',
            success: function (data) {
                if (data.length != 0) {

                    $("#num").text(data.length);
                }
                else {
                    $("#num").hide();
                }
              //  console.log("1 in ajax--success");
                // $('.list-group').empty();
                var disdata = $(".list-group");
                for (var i = 0; i < data.length; i++) {
                    disdata.prepend('<a href="#" class="list-group-item">' + data[i].notificationMessage + '</a>');
                }

                $('#popoverContent').html(disdata);
            },
            error: function () {
                //alert("Something went wrong in notifications");
            }
        });

        

    $('#popoverId').popover({

        html: true,
        ajax: true,
        title: 'Notifications<a class="close" href="#">&times;</a>',
placement: "bottom",
    content: $('#popoverContent').html('')
    });

$('#popoverId').click(function (e) {
    e.stopPropagation();
    $.ajax({
        type: "POST",
        url: '/Notifications/NotificationVisited',

        success: function (data) {
            $("#num").hide();
        },
        error: function () {

        }
    });
});
$('body').on('hidden.bs.popover', function (e) {
    $(e.target).data("bs.popover").inState = { click: false, hover: false, focus: false }
});
$(document).click(function (e) {
    if (($('.popover').has(e.target).length == 0) || $(e.target).is('.close')) {
        $('.popover').removeClass('in').remove();

    }
    
});


});
