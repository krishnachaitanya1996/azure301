$(document).ready(function () {

    $(".uploadexcel").click(function () {
        $("#excelUploadForm")[0].reset();
    });



    $.ajax({
        url: '/WebList/WebList',
        type: 'get',
        success: function (data) {

            $('.select-box').html(data);

            if (sessionStorage.getItem("retainedWebId") != null) {

                var selectedWebSiteId = sessionStorage.getItem("retainedWebId");
                $('#ddlWebSites').val(sessionStorage.getItem("retainedWebId"));
                $("#ddlWebSites").trigger("chosen:updated");
            }
            else {
                var selectedWebSiteId = $('#ddlWebSites').val();
            }
            if (selectedWebSiteId != null) {
                $.ajax({
                    type: "GET",
                    url: '/Retailer/GetRetailers',
                    data: { webID: selectedWebSiteId },

                    success: function (data) {
                        $(".retailer-details").html(data);
                    },
                    error: function () {
                        alert("Error occured!")
                    }
                });
            }
            else {
                alert("You have no access to any of the sites!");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            var errorMsg = 'Ajax request failed: ' + xhr.responseText;
            $('#content').html(errorMsg);
        }
    });




});


$(document).on('change', '#ddlWebSites', function () {
    sessionStorage.setItem("retainedWebId", $('#ddlWebSites').val());
    var selectedWebSiteId = $('#ddlWebSites').val();
    $('#txtSearch').val(null); 
    $.ajax({
        type: "GET",
        url: '/Retailer/GetRetailers',
        data: { webID: selectedWebSiteId },

        success: function (data) {
            LoadExposeRetailer(selectedWebSiteId);
            $(".retailer-details").html(data);
        },
        error: function () {
            alert("Error occured!")
        }
    });
});

function LoadExposeRetailer(webId) {
    $.ajax({
        type: 'GET',
        url: '/Retailer/GetRetailerExposeOrder',
        data: { webId: webId },
        success: function (data) {
            $('.retailer-order').html(data);
        },
        error: function ()
        { }
    });
}

$(document).on('click', '.Change', function () {
    if ($('.Change').text() == "Change") {
        $('.Change').html("Update");
        $('.cancelRetailerUpdate').removeClass('hide');
        $('.order').removeClass('hide');
    }
    else {
        UpdateExposeRetailer();

        $('.Change').html("Change");
        $('.cancelRetailerUpdate').addClass('hide');
        $('.order').addClass('hide');
    }
});

$(document).on('click', '.cancelRetailerUpdate', function () {
    $('.Change').html("Change");
    $('.cancelRetailerUpdate').addClass('hide');
    $('.order').addClass('hide');
});
function UpdateExposeRetailer() {
    var selectedWebSiteId = $('#ddlWebSites').val();
    var selectedOrder = $('#order').val();
    $('.selected-order').html(selectedOrder);
    $.ajax({
        type: "POST",
        data: { webId: selectedWebSiteId, exposeOrder: selectedOrder },
        url: '/Retailer/UpdateRetailerExposeOrder'
    });
}
$(document).on('change', '#ddlWebSites', function () {
    var selectedValue = $('#ddlWebSites').val();
    $('#WebId').val(selectedValue);
    $('#webidForexcel').val(selectedValue);
});

$(function () {
    $('#ExcelUploaded_error').hide();
    $('#Retailername_error').hide();
    $('#ImageUploaded_error').hide();
    $('#RetailerHomeUrl_error').hide();
    $('#RetailerBrandUrl_error').hide();


    var Retailername_errorVar = false;
    var ImageUploaded_errorVar = false;
    var RetailerHomeUrl_errorVar = false;
    var RetailerBrandUrl_errorVar = false;
    var ExcelUploaded_errorVar = false;

    ImageUploaded_errorVar = null;
    Retailername_errorVar = null;
    RetailerHomeUrl_errorVar = null;
    RetailerBrandUrl_errorVar = null;
    ExcelUploaded_errorVar = null;

    function checkEnable() {
        if (ImageUploaded_errorVar == false && RetailerBrandUrl_errorVar == false && Retailername_errorVar == false && RetailerHomeUrl_errorVar == false) {
            $('#submitForm').prop('disabled', false);
            $('#submitForm').removeClass('disabled');
        } else {
            $('#submitForm').prop('disabled', true);
            $('#submitForm').addClass('disabled');
        }
    }

    $('.close').click(function () {
        $('#RetailerForm')[0].reset();
        $('#ExcelUploaded_error').hide();
        $('#Retailername_error').hide();
        $('#ImageUploaded_error').hide();
        $('#RetailerHomeUrl_error').hide();
        $('#RetailerBrandUrl_error').hide();
    })

    $('#uploadAddBtn').click(function () {
        $('#RetailerForm')[0].reset();
        $('#ExcelUploaded_error').hide();
        $('#Retailername_error').hide();
        $('#ImageUploaded_error').hide();
        $('#RetailerHomeUrl_error').hide();
        $('#RetailerBrandUrl_error').hide();
    })

    $('#RetailerName').keyup(function () {
        if ($('#RetailerName').val().length < 1) {
            $('#Retailername_error').html("Enter Retailer Name");
            $('#Retailername_error').show();
            Retailername_errorVar = true;
            checkEnable();
        } else {
            Retailername_errorVar = false;
            $('#Retailername_error').hide();
            checkEnable();
        }
    });

    $('#RetailerHomeUrl').keyup(function () {
        if ($('#RetailerHomeUrl').val().length < 1) {
            $('#RetailerHomeUrl_error').html("Enter Retailer Home Url");
            $('#RetailerHomeUrl_error').show();
            RetailerHomeUrl_errorVar = true;
            checkEnable();
        } else {
            if (validateUrl($('#RetailerHomeUrl').val())) {
                RetailerHomeUrl_errorVar = false;
                $('#RetailerHomeUrl_error').hide();
                checkEnable();
            }
            else {
                $('#RetailerHomeUrl_error').html("Enter valid Url");
                $('#RetailerHomeUrl_error').show();
                RetailerHomeUrl_errorVar = true;
                checkEnable();
            }
        }
    });

    $('#RetailerBrandUrl').keyup(function () {
        if ($('#RetailerBrandUrl').val().length < 1) {
            $('#RetailerBrandUrl_error').html("Enter Retailer Brand Url");
            $('#RetailerBrandUrl_error').show();
            RetailerBrandUrl_errorVar = true;
            checkEnable();
        } else {
            if (validateUrl($('#RetailerBrandUrl').val())) {
                RetailerBrandUrl_errorVar = false;
                $('#RetailerBrandUrl_error').hide();
                checkEnable();
            }
            else {
                $('#RetailerBrandUrl_error').html("Enter valid Url");
                $('#RetailerBrandUrl_error').show();
                RetailerBrandUrl_errorVar = true;
                checkEnable();
            }
        }
    });

    //$('#ImageUploaded').change(function () {

    //    var fileReader = new FileReader();
    //    fileReader.onloadend = function (e) {
    //        var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
    //        var header = "";
    //        for (var i = 0; i < arr.length; i++) {
    //            header += arr[i].toString(16);
    //        }
    //        console.log(header);
    //        switch (header.toUpperCase()) {
    //            case '89504E47':
    //                console.log('image/png');
    //                break;
    //            case '47494638':
    //                console.log('image/gif');
    //                break;
    //            case 'FFD8FFDB':
    //            case 'FFD8FFE0':
    //                console.log('image/jpeg');
    //                break;
    //            default:
    //                if (header.slice(0, 4) == '424d')
    //                    console.log('image/bmp');
    //                else {
    //                    console.log('Unknown filetype');
    //                    $('#ImageUploaded_error').html("Only '.jpeg', '.jpg', '.png', '.gif', '.bmp' formats are allowed.");
    //                    $('#ImageUploaded_error').show();
    //                    ImageUploaded_errorVar = true;
    //                    checkEnable();
    //                }
    //        }

    //    };
    //    fileReader.readAsArrayBuffer($("#ImageUploaded")[0].files[0]);

    //    if ($("#ImageUploaded")[0].files[0] == null) {
    //        $('#ImageUploaded_error').html("You Should Select an Image");
    //        $('#ImageUploaded_error').show();
    //        ImageUploaded_errorVar = true;
    //        checkEnable();
    //    } else if ($("#ImageUploaded")[0].files[0].size >= (10 * 1024)) {
    //        $('#ImageUploaded_error').html("Size Limit is 10 kb and your file exceeds Limit");
    //        $('#ImageUploaded_error').show();
    //        ImageUploaded_errorVar = true;
    //        checkEnable();
    //    }
    //    else {
    //        ImageUploaded_errorVar = false;
    //        $('#ImageUploaded_error').hide();
    //        checkEnable();
    //    }
    //});
    $('#ImageUploaded').change(function () {
       
        var fileUpload = $("#ImageUploaded")[0];

      
        var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.jpg|.png|.gif)$");
        if (regex.test(fileUpload.value.toLowerCase())) {           
            if (typeof (fileUpload.files) != "undefined") {             
                var fileReader = new FileReader();
              
                fileReader.readAsDataURL(fileUpload.files[0]);
                fileReader.onload = function (e) {
                   
                    var image = new Image();
                   
                    image.src = e.target.result;
                    image.onload = function () {
                      
                        var height = this.height;
                        var width = this.width;

                        if (height == 60 && width == 180) {

                            fileReader.onloadend = function (e) {

                                var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                                var header = "";
                                for (var i = 0; i < arr.length; i++) {
                                    header += arr[i].toString(16);
                                }
                                console.log(header);
                                switch (header.toUpperCase()) {
                                    case '89504E47':
                                        console.log('image/png');
                                        break;
                                    case '47494638':
                                        console.log('image/gif');
                                        break;
                                    case 'FFD8FFDB':
                                    case 'FFD8FFE0':
                                        console.log('image/jpeg');
                                        break;
                                    default:
                                        if (header.slice(0, 4) == '424d')
                                            console.log('image/bmp');
                                        else {
                                            console.log('Unknown filetype');
                                            $('#ImageUploaded_error').html("Only '.jpeg', '.jpg', '.png', '.gif', '.bmp' formats are allowed.");
                                            $('#ImageUploaded_error').show();
                                            ImageUploaded_errorVar = true;
                                            checkEnable();
                                        }
                                }

                            };
                            fileReader.readAsArrayBuffer($("#ImageUploaded")[0].files[0]);

                            if ($("#ImageUploaded")[0].files[0] == null) {
                                $('#ImageUploaded_error').html("You Should Select an Image");
                                $('#ImageUploaded_error').show();
                                ImageUploaded_errorVar = true;
                                checkEnable();
                            } else if ($("#ImageUploaded")[0].files[0].size >= (10 * 1024)) {
                                $('#ImageUploaded_error').html("Size Limit is 10 kb and your file exceeds Limit");
                                $('#ImageUploaded_error').show();
                                ImageUploaded_errorVar = true;
                                checkEnable();
                            }
                            else {
                                ImageUploaded_errorVar = false;
                                $('#ImageUploaded_error').hide();
                                checkEnable();
                            }
                        }
                        else {
                            $('#ImageUploaded_error').html("Image pixels should be Height:60px & width:180px.!!!");
                            $('#ImageUploaded_error').show();
                            ImageUploaded_errorVar = true;
                            checkEnable();
                        }

                    };
                }
            }
        }


    });
    $('#ExcelUploaded').change(function () {


        if ($("#ExcelUploaded")[0].files[0] == null) {
            $('#ExcelUploaded_error').html("You Should Select a File");
            $('#ExcelUploaded_error').show();
            $('#excelUpload').prop('disabled', true);
            $('#excelUpload').addClass('disabled');
        } else if (!($("#ExcelUploaded")[0].files[0].type == 'application/vnd.ms-excel' || $("#ExcelUploaded")[0].files[0].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            $('#ExcelUploaded_error').html("Should be an Excel File");
            $('#ExcelUploaded_error').show();
            $('#excelUpload').prop('disabled', true);
            $('#excelUpload').addClass('disabled');
        }
        else {
            $('#ExcelUploaded_error').hide();
            $('#excelUpload').prop('disabled', false);
            $('#excelUpload').removeClass('disabled');
            $("#ExcelUploaded")[0].files[0].val(null);

        }
    });
}); // validations

var base = '';
$(document).delegate(':file', 'change', function () {
    if (this.files && this.files[0]) {
        base = this.files[0];
    }

    $(function () {
        $("#submitForm").unbind("click");
        $("#submitForm").on("click", function (e) {
            var selectedValue = $('#ddlWebSites').val();
            $('#WebId').val(selectedValue);
            $('#webidForexcel').val(selectedValue);
            e.preventDefault();

            var ImageUploaded = base;
            var formdata = new FormData();
            var RetailerName = $('#RetailerName').val();
            var RetailerHomeUrl = $('#RetailerHomeUrl').val();
            var RetailerBrandUrl = $('#RetailerBrandUrl').val();
            var DefaultRetailer = $("#DefaultRetailer").is(':checked')
            var WebId = $('#WebId').val();
            formdata.append('RetailerName', RetailerName);
            formdata.append('RetailerHomeUrl', RetailerHomeUrl);
            formdata.append('RetailerBrandUrl', RetailerBrandUrl);
            formdata.append('DefaultRetailer', DefaultRetailer);
            formdata.append('WebId', WebId);
            formdata.append('ImageUploaded', ImageUploaded);

            $('#myModal').on('hidden.bs.modal', function () {
                $('#existErrorMsg').hide();
            });
            $.ajax({
                type: 'POST',
                url: 'AddRetailerData/',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data) {
                        jqxAlert.alert("Retailer Added.");
                        $('#RetailerForm')[0].reset();
                        $('#myModal').modal('hide');
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                        var selectedId = $('#ddlWebSites').val();
                        $.ajax({
                            type: "Get",
                            url: '/Retailer/GetRetailers/',
                            data: { WebId: selectedId },
                            dataType: "",
                            contentType: 'application/json; charset=utf-8',
                            success: function (data) {
                                $(".retailer-details").html(data);
                            },
                            error: function () {
                                alert("Error occured!!")
                            }
                        });
                    }
                    else {
                       
                        $('#existErrorMsg').text("Retailer already exists.");
                        $('#existErrorMsg').show();
                    }
                },
                error: function (jqXHR) { alert("Error : " + jqXHR); }
            });

        });
    });
});

$(document).on('click', '.getcountrylist', function () {
    $('#importFromGlobal .success-msg>#modalsuccesstext').text('');
    $("#listforcountry").empty();
    $("#globalMaster").empty();

    $.ajax({
        type: "post",
        url: '/GlobalRetailerManagement/GetGlobalCountryList',
        success: function (res) {
            $.each(res, function (i) {
                var optionhtml = '<option class="Sites" value="' +
                    res[i].Value + '">' + res[i].Text + '</option>';

                $("#listforcountry").append(optionhtml);
            });
        },
        error: function () {
            alert("Error occured!!")
        }
    });

});



$(document).on('change', '#listforcountry', function () {
    selected_data = $("#listforcountry").val();

    $("#globalMaster").hide();
    $("#progressImage").show();

    if (selected_data == 'Select Country') {
        $("#globalMaster").empty();

        $("#progressImage").hide();
    }

    else {
        $.ajax({
            type: "POST",
            url: "/GlobalRetailerManagement/GetGlobalRetailersByCountry",

            data: { 'country': selected_data },

            success: function (data) {
                $("#progressImage").hide();
                $("#globalMaster").show();
                $("#globalMaster").html(data);

            },
            error: function (ts) {
                $("#globalMaster").html('No retailers Available!!!.');

            }
        });
    }
});

$(document).on('click', '#btnImportMaster', function (e) {
    e.preventDefault();
    $('#importFromGlobal .success-msg>#modalsuccesstext').text('');
    var selectedWebSiteId = $('#ddlWebSites').val();
    var retailers = [];
    $($("table > tr[id='globalRetailer']:visible")).find('.checkbox').each(function () { //iterate all listed checkbox items
        if (this.checked) {
            var row = $(this).closest("#globalRetailer");
            retailers.push({ RetailerId: row.find('#retId').text(), RetailerName: row.find('.retailer-name').text(), RetailerHomeUrl: row.find('.retailer-url').text(), WebId: selectedWebSiteId });
        }
    });
    if (retailers.length < 1) {
        $('#importFromGlobal .success-msg>#modalsuccesstext').append("Select retailer");
        return;
    }
    $.ajax({

        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: '/Retailer/ImportGlobalRetailersToRetailerSummary',
        data: JSON.stringify(retailers),
        success: function (data) {
            $('#importFromGlobal .success-msg>#modalsuccesstext').append(data);

            $.ajax({
                type: "GET",
                url: '/Retailer/GetRetailers',
                data: { webID: selectedWebSiteId },

                success: function (data) {

                    $(".retailer-details").html(data);
                },
                error: function () {
                    alert("Error occured!")
                }
            });
        },
        failure: function () {
            $('#importFromGlobal .success-msg>#modalsuccesstext').append(data);
        }
    });
});

$(document).on('click', '#selectall', function () {
    var status = this.checked; // "select all" checked status
    $($("table > tr[id='globalRetailer']:visible")).find('.checkbox').each(function () { //iterate all listed checkbox items

        this.checked = status; //change ".checkbox" checked status
    });
});


$(function () {

    $(document).on('click', '#upload', function () {
        var selectedRetailers = $('#ddlWebSites option:selected').text();
        $('#uploadmsg').html('You are updating retailers for ' + '<b>' + selectedRetailers + '</b>');
    });

    $("#excelUpload").on("click", function (e) {
        var selectedValue = $('#ddlWebSites').val();
        $('#WebId').val(selectedValue);
        $('#webidForexcel').val(selectedValue);
        e.preventDefault();
        var formdata = new FormData();
        var ExcelUploaded = $("#ExcelUploaded")[0].files[0];
        var WebIdExcel = $('#webidForexcel').val();
        formdata.append('ExcelUploaded', ExcelUploaded);
        formdata.append('WebId', WebIdExcel);
        if (ExcelUploaded == null) {

            $('#retailerExcel .success-msg #alert').html("Please upload the Excelfile.!!!");
            $(".modal").on("hidden.bs.modal", function () {
                $('#retailerExcel .success-msg #alert').empty();
            });
            $('#ExcelUploaded').val(null);
        }
        else if (!($("#ExcelUploaded")[0].files[0].type === 'application/vnd.ms-excel' || $("#ExcelUploaded")[0].files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {

            $('#retailerExcel .success-msg #alert').html("Please upload the correct file format. Only Excel file is allowed.!!!");
            $(".modal").on("hidden.bs.modal", function () {
                $('#retailerExcel .success-msg #alert').empty();
            });
            $('#ExcelUploaded').val(null);
        }
        else {
            $.ajax({

                type: 'POST',
                url: 'UploadExcelData/',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (data) {
                    $('#alert').html(data);
                    $(".modal").on("hidden.bs.modal", function () {
                        $('#retailerExcel .success-msg #alert').empty();
                    });

                    $('#ExcelUploaded').val(null);
                    $('#modalsuccesstext').html(data);
                    $("#retailerExcel.modal").on("hidden.bs.modal", function () {
                        $('#modalsuccesstext').empty();
                        $('#excelUpload').attr('disabled', 'disabled');
                    });

                    $.ajax({
                        type: "Get",
                        url: '/Retailer/GetRetailers/',
                        data: { WebId: WebIdExcel },
                        dataType: "",
                        contentType: 'application/json; charset=utf-8',
                        success: function (data) {
                            $('.retailer-details').html(data);
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

});

setTimeout(function () {
    $(".retailer-details.retailer-table .product-details  tbody").addClass("search-fil");
}, 4000);

$(document).on('keyup', '#txtSearch', function () {
    var value = $(this).val().toLowerCase();
    $(".search-fil tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });

});

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
            '<input style="margin-top: 20px;" type="button"  value = "Ok" id= "alert_button" />' +
            '</div>' +
            '</div>');
        $("#alert_title").text(title);
        $("#alert_title").addClass('jqx-alert-header');
        $("#alert_content").addClass('jqx-alert-content');
        $("#message").text(msg);
        //$("#alert_button").width(70);
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
                    position: 'fixed',
                    zIndex: 99998,
                    top: '0px',
                    left: '0px',
                    width: '100%',
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

function validateUrl(url) {
    const regex = '^(http:\/\/|https:\/\/)(www.)?((?!,).)*$';
    var urlToTest = new RegExp(regex, "i")
    return urlToTest.test(url);
}