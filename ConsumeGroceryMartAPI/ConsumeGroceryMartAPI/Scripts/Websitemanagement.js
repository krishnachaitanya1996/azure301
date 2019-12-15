$(document).on('click', 'input:button[name=btnPassKey]', function () {
    var webID = $(this).attr("id");
    $.ajax({
        type: "POST",
        url: '/WebSiteManagement/UpdatePasskey',
        data: { strWebID: webID },
        success: function (data) {
            alert(data);
            window.location.reload();
        },
        error: function () {
            alert("Error occured!!")
        }
    });

});



$(document).ready(function () {
   
    $('#updateModal').on('hidden.bs.modal', function () {
        $('#updateWebTypeError').hide();
        $('#updateWebBrandError').hide();
        $('#updateWebNameError').hide();
        $('#updateWebLocaleError').hide();
        $('#updateWebDomainError').hide();
    });

    $('#AddModel').on('hidden.bs.modal', function () {
        $(this).find('#AddWebsiteManagement').trigger('reset');        
        $('#WebBrandError').hide();      
        $('#WebLocaleError').hide();
        $('#WebDomainError').hide();
    });
    $('#Add_submit').prop('disabled', true);
  
    var WebBrandError = true;   
    var WebLocaleError = true;
    var WebDomainError = true;

    function checkAddEnable() {
        if ( WebBrandError == false && WebLocaleError == false && WebDomainError == false) {
            $('#Add_submit').prop('disabled', false);
        }
        else {
            $('#Add_submit').prop('disabled', true);
        }
    }

   
    $('#WebBrand').bind("keyup focusout", function () {
        if (!(/[a-zA-Z-/]/.test($('#WebBrand').val()))) {
            $('#WebBrandError').html("Enter the Brand");
            WebBrandError = true;
            $('#WebBrandError').show();
        }
        else {
            WebBrandError = false;
            $('#WebBrandError').hide();
        }
        checkAddEnable();
    });
   
    $('#WebLocale').bind("keyup focusout", function () {
        if (!(/[a-zA-Z-/]/.test($('#WebLocale').val()))) {
            $('#WebLocaleError').html("Enter the locale");
            WebLocaleError = true;
            $('#WebLocaleError').show();
        }
        else {
            WebLocaleError = false;
            $('#WebLocaleError').hide();
        }
        checkAddEnable();
    });
    $('#WebDomain').bind("keyup focusout", function () {
        if (!(/[a-zA-Z-/]/.test($('#WebDomain').val()))) {
            $('#WebDomainError').html("Enter the Url");
            WebDomainError = true;
            $('#WebDomainError').show();
        }
        else {
            if (validateUrl($('#WebDomain').val()))
            {
                WebDomainError = false;
                $('#WebDomainError').hide();
            }
            else
            {
                $('#WebDomainError').html("Enter valid Url");
                WebDomainError = true;
                $('#WebDomainError').show();
            }
            
        }
        checkAddEnable();
    });



    //validation for Update Modal
    $('#Update_submit').prop('disabled', true);
   
    var updateWebBrandError = false;  
    var updateWebLocaleError = false;
    var updateWebDomainError = false;
    function checkUpdateEnable() {
        if ( updateWebBrandError == false && updateWebLocaleError == false && updateWebDomainError == false) {
            $('#Update_submit').prop('disabled', false);
        }
        else {
            $('#Update_submit').prop('disabled', true);
        }
    }
    
    $('#updateWebBrand').bind("keyup focusout", function () {
        if (!(/[a-zA-Z-/]/.test($('#updateWebBrand').val()))) {
            $('#updateWebBrandError').html("You should enter the WebBrand");
            updateWebBrandError = true;
            $('#updateWebBrandError').show();
        }
        else {
            updateWebBrandError = false;
            $('#updateWebBrandError').hide();
        }
        checkUpdateEnable();
    });
   
    $('#updateWebLocale').bind("keyup focusout", function () {
        if (!(/[a-zA-Z-/]/.test($('#updateWebLocale').val()))) {
            $('#updateWebLocaleError').html("You should enter the WebLocale");
            updateWebLocaleError = true;
            $('#updateWebLocaleError').show();
        }
        else {
            updateWebLocaleError = false;
            $('#updateWebLocaleError').hide();
        }
        checkUpdateEnable();
    });
    $('#updateWebDomain').bind("keyup focusout", function () {
        if (!(/[a-zA-Z-/]/.test($('#updateWebDomain').val()))) {
            $('#updateWebDomainError').html("You should enter the WebDomain");
            updateWebDomainError = true;
            $('#updateWebDomainError').show();
        }
        else {
            updateWebDomainError = false;
            $('#updateWebDomainError').hide();
        }
        checkUpdateEnable();
    });



    $("#Add_submit").click(function () {
        $.ajax({
            type: "POST",
            url: '/WebSiteManagement/AddToWebMaster',
            data: $("#AddWebsiteManagement").serialize(),
            success: function (data) {
                window.location.reload();
                
            },
            error: function () {
                alert("error occured while adding");
            }
        });
        $('#AddWebsiteManagement')[0].reset();
        $('#AddModel').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        jqxAlert.alert("Data Added Successfully");
    });



    $(document).on("click", "#updateWebMaster", function () {
      
        var webID = $(this).attr("name");
        $.ajax({
            type: "POST",
            url: '/WebSiteManagement/GetWebMasterDetails',
            data: { strWebID: webID },
            success: function (data) {
               
                $("#updateWebBrand").val(data[0].WebBrand);                
                $("#updateWebLocale").val(data[0].WebLocale);
                $("#updateWebDomain").val(data[0].WebDomain);
                $("#WebId").val(webID);
            },
            error: function () {
                alert("Error occured!!")
            }
        });
    });

    $("#Update_submit").click(function () {
        $.ajax({
            type: "POST",
            url: '/WebSiteManagement/UpdateWebMaster',
            data: $("#UpdateWebsiteManagement").serialize(),
            success: function (data) {
                window.location.reload();
               
            },
            error: function () {
                alert("error occured while updating");
            }
        });
        $('#UpdateWebsiteManagement')[0].reset();
        $('#updateModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        jqxAlert.alert("Data Updated successfully");
    });

});

function validateUrl(url) {
    const regex = '^(http:\/\/|https:\/\/)(www.)?((?!,).)*$';
    var urlToTest = new RegExp(regex, "i")
    return urlToTest.test(url);
}


function Pagination() {
    var totalRows = $('.product-details').find('tbody tr:has(td)').length;
    var recordPerPage = 5;
    var totalPages = Math.ceil(totalRows / recordPerPage);
    var $pages = $('<div id="pages"></div>');
    for (i = 0; i < totalPages; i++) {
        $('<a href="#">&nbsp;' + (i + 1) + '</a>').appendTo($pages);
    }
    $pages.appendTo('.product-details');
    $('.pageNumber').hover(function () {
        $(this).addClass('focus');
    }, function () {
        $(this).removeClass('focus');
    });
    $('table').find('tbody tr:has(td)').hide();
    var tr = $('table tbody tr:has(td)');
    for (var i = 0; i <= recordPerPage - 1; i++) {

        $(tr[i]).show();
    }
    $('a').click(function (event) {

        $('.product-details').find('tbody tr:has(td)').hide();
        var nBegin = ($(this).text() - 1) * recordPerPage;
        var nEnd = $(this).text() * recordPerPage - 1;
        for (var i = nBegin; i <= nEnd; i++) {
            $(tr[i]).show();
        }
    })
};


jqxAlert = {

    top: 0,
    left: 0,
    overlayOpacity: 0.2,
    overlayColor: '#ddd',
    alert: function (message, title) {
        if (title == null) title = 'Alert';
        jqxAlert._show(title, message);
    },

    _show: function (title, msg) {
        jqxAlert._hide();
        jqxAlert._handleOverlay('show');
        $("BODY").append(
            '<div class="jqx-alert" style="width: auto; height: auto;overflow: hidden; white - space: nowrap; " id="alert_container">' +
            '<div id="alert_title"></div>' +
            '<div id="alert_content">' +
            '<div id="message"></div>' +
            '<input style="margin-top: 10px;" type="button"  value = "Ok" id= "alert_button" />' +
            '</div>' +
            '</div>');
        $("#alert_title").text(title);
        $("#alert_title").addClass('jqx-alert-header');
        $("#alert_content").addClass('jqx-alert-content');
        $("#message").text(msg);
        $("#alert_button").width(70);
        $("#alert_button").click(function () {
            jqxAlert._hide();
        });
        jqxAlert._setPosition();
    },

    _hide: function () {
        $("#alert_container").remove();
        jqxAlert._handleOverlay('hide');
    },

    _handleOverlay: function (status) {
        switch (status) {
            case 'show':
                jqxAlert._handleOverlay('hide');
                $("BODY").append('<div id="alert_overlay"></div>');
                $("#alert_overlay").css({
                    position: 'absolute',
                    zIndex: 99998,
                    top: '0px',
                    left: '0px',
                    width: '100%',
                    height: $(document).height(),
                    background: jqxAlert.overlayColor,
                    opacity: jqxAlert.overlayOpacity
                });
                break;
            case 'hide':
                $("#alert_overlay").remove();
                break;
        }
    },

    _setPosition: function () {

        var top = (($(window).height() / 2) -
            ($("#alert_container").outerHeight() / 2)) + jqxAlert.top;
        var left = (($(window).width() / 2) -
            ($("#alert_container").outerWidth() / 2)) + jqxAlert.left;
        if (top < 0) {
            top = 0;
        }
        if (left < 0) {
            left = 0;
        }

        $("#alert_container").css({
            top: top + 'px',
            left: left + 'px'
        });

        $("#alert_overlay").height($(document).height());
    }
}

