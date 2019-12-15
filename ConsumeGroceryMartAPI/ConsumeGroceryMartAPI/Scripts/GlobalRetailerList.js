
$(document).ready(function () {
    //$('.select-box').hide();
    var selectedFilterValue = $('#ddlFilter').val();
    if (selectedFilterValue == "0") {
        $("#btnBlock").css("display", "none");
        $("#btnUnBlock").css({ "display":"block","float":"right"});
    }
    else if (selectedFilterValue == "1") {
        $("#btnUnBlock").css("display", "none");
        $("#btnBlock").css({ "display": "block", "float": "right" });
    } 
    $.ajax({
        type: "GET",
        url: '/GlobalRetailerManagement/GlobalRetailerManagement',
        data: { filterValue: selectedFilterValue },
        success: function (data) {
            $('.product-details').html(data);
            Pagination();
           
        },
        error: function () {
            alert("Error occured!!")
        }
    });
});
$(document).on('click', '#btnUpload', function () {
    var formdata = new FormData();
    var ExcelUploaded = $("#ExcelUploaded")[0].files[0];
    var WebIdExcel = $('#webidForexcel').val();
    formdata.append('ExcelUploaded', ExcelUploaded);
    formdata.append('WebId', WebIdExcel);
   
    if (ExcelUploaded == null) {

        $('#alert').html("Please upload the Excelfile.!!!");
        $(".modal").on("hidden.bs.modal", function () {
            $('#uploadExcel .success-msg #alert').empty();
        });

    }
    else if (!($("#ExcelUploaded")[0].files[0].type === 'application/vnd.ms-excel' || $("#ExcelUploaded")[0].files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {

        $('#alert').html("Please upload the correct file format. Only Excel file is allowed.!!!");
        $(".modal").on("hidden.bs.modal", function () {
            $('#uploadExcel .success-msg #alert').empty();
        });
        $('#ExcelUploaded').val(null);
    }
    else {

        $.ajax({

            type: 'POST',
            url: '/GlobalRetailerManagement/UploadExcel',
            data: formdata,
            processData: false,
            contentType: false,
            success: function (data) {

                $('#alert').html(data);
                $(".modal").on("hidden.bs.modal", function () {
                    $('#uploadExcel .success-msg #alert').empty();
                });
            
                $.ajax({
                    type: "Get",
                    url: '/GlobalRetailerManagement/GlobalRetailerManagement/',
                    dataType: "",
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        $('#uploadExcel').modal('hide');
                        $('.modal-backdrop').css("display", "none");
                        $('#ExcelUploaded').val(null);
                        $('#alert').html(null);
                        $('.product-details').html(data);
                    },
                    error: function () {
                        alert("Error occured!!")
                    }
                });
            },
            error: function (jqXHR) { alert("Error : " + jqXHR); }
        });
    }
});

$(document).on('click', '.btnExcelClose', function () {

    $('#ExcelUploaded').val(null);
    $('#alert').html(null);
});
$(document).on('change', '#ddlFilter', function () {
    $('#txtSearch').val(null);

    var selectedFilterValue = $('#ddlFilter').val();
    if (selectedFilterValue == "0") {
        $("#btnBlock").css("display", "none");
        $("#btnUnBlock").css({ "display": "block", "float": "right" });
    }
    else if (selectedFilterValue == "1") {
        $("#btnUnBlock").css("display", "none");
        $("#btnBlock").css({ "display": "block", "float": "right" });
    } 

    $.ajax({
        type: "GET",
        url: '/GlobalRetailerManagement/GlobalRetailerManagement',
        data: { filterValue: selectedFilterValue },
        success: function (data) {
            $('.product-details').html(data);
            Pagination();

        },
        error: function () {
            alert("Error occured!!")
        }
    });
});
$(document).on('click', '#btnBlock', function () {
    var selectedRetailers = '';
    var selectedRetailerID = '';
    var sGloballyBlocked = true;
    var isChecked = $("input:checkbox[name=chkBox]:checked").length;
    if (isChecked <= 0)
      
        jqxAlert.alert('Please select the checkbox to block the Retailers.!!!');
        
    else {
        $("input:checkbox[name=chkBox]:checked").each(function () {
            //alert("Id: " + $(this).attr("id") + " Value: " + $(this).val());
            selectedRetailers += $(this).val() + "^";
            selectedRetailerID += $(this).attr("id") + "^";
        });

        $.ajax({
            type: "POST",
            url: '/GlobalRetailerManagement/UpdateRetailers',
            data: {
                strSelectedRetailers: selectedRetailers,
                strselectedRetailerID: selectedRetailerID,
                isGloballyBlocked: sGloballyBlocked

            },
            success: function (data) {
                $('#txtSearch').val(null);
                $.confirm({
                    text: data,
                    title: "Alert!",
                    confirm: function () {                      
                        GetRetailerManagementDetails();
                    },
                    cancel: function () {
                        return;
                    }
                });
               
                Pagination();

            },
            error: function () {
                alert("Error occured!!")
            }
        });
    }


});

$(document).on('click', '#btnUnBlock', function () {
    var selectedRetailers = '';
    var selectedRetailerID = '';
    var sGloballyBlocked = false;
    var isChecked = $("input:checkbox[name=chkBox]:checked").length;
    if (isChecked <= 0)
        jqxAlert.alert('Please select the checkbox to block the Retailers.!!!');       
    else {
        $("input:checkbox[name=chkBox]:checked").each(function () {

            selectedRetailers += $(this).val() + "^";
            selectedRetailerID += $(this).attr("id") + "^";
        });

        $.ajax({
            type: "POST",
            url: '/GlobalRetailerManagement/UpdateRetailers',
            data: { strSelectedRetailers: selectedRetailers, strselectedRetailerID: selectedRetailerID, isGloballyBlocked: sGloballyBlocked },
            success: function (data) {              
                $('#txtSearch').val(null);
                $('.btn btn-primary').text('Ok');
                $.confirm({                  
                    text: data,
                    title: "Alert",
                    confirm: function () {
                       
                        GetRetailerManagementDetails();
                        Pagination();
                    },
                    cancel: function () {
                        return;
                    }
                });
        
            },
            error: function () {
                alert("Error occured!!")
            }
        });

    }

});

function GetRetailerManagementDetails()
{

    var selectedFilterValue = $('#ddlFilter').val();
    $.ajax({
        type: "GET",
        url: '/GlobalRetailerManagement/GlobalRetailerManagement',
        data: { filterValue: selectedFilterValue },
        success: function (data) {
            $('.product-details').html(data);
            Pagination();
        },
        error: function () {
            alert("Error occured!!")
        }
    });

}

$(document).on('keyup', '#txtSearch', function () {
    var value = $(this).val().toUpperCase();

    $("table tr").each(function (index) {
        if (index !== 0) {

            $row = $(this);

            var id = $row.find("td:first").text().toUpperCase();

            if (id.indexOf(value) !== 0) {
                $row.hide();
            }
            else {
                $row.show();
                
            }
        }
    });
});
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
        $("body").append(
            '<div class="jqx-alert" style="width: auto; height: auto;overflow: hidden; white-space:nowrap;"id="alert_container">' +
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
