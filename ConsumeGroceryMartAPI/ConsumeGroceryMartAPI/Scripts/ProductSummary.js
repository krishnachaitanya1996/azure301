$(document).ready(function () {
   
    $('.has-error').hide();
    $('#AddingDetailsDiv').hide();
    $('#SkuDetails').hide(); 
    $('#newProductBtn').hide();
    $('#AddingDetailsDivClose').hide();

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
                    url: '/ProductSummary/ProductSummary',
                    data: { webID: selectedWebSiteId },

                    success: function (data) {

                        $(".product-details").html(data);

                    },
                    error: function () {
                        alert("Error occured!")
                    }
                });
            }
            else {
                alert("You have no access to any of the sites");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            var errorMsg = 'Ajax request failed: ' + xhr.responseText;
            $('#content').html(errorMsg);
        }
    });
    
});

$(window).load(function () {
    $(".popover-title").on("click", function (event) {
        alert('hi');       
    });

    printTable();
});
function printTable() {
    setTimeout(function () {
        if ($('.table-scroll') != 'undefined') {

            $('.table-scroll .search-fil>tr').each(function () {
                var a = $(this).find(".retailer-name > div").text();
                var b = $(this).find(".product-name > div").text();
                var e = $(this).find(".product-name > div > p > a").attr("href");
                var c = $(this).find(".skuname > div").text();
                var retailers = $(this).find('.retailer-table>tbody>tr>td>a');
                $(retailers).each(function () {
                    var retaileralttext = '';
                    var retailertext = '';
                    var retailerURL = '';
                    if ($(this).find('img').length != 0) {
                        retaileralttext = $(this).find("img").attr("alt");
                        retailerURL = $(this).closest("a").attr("href");
                    }
                    if ($(this).find('div').length != 0) {
                        retailertext = $(this).find('div').text();
                        retailerURL = $(this).closest("a").attr("href");
                    }
                    if (retaileralttext != '') {
                        var d = $(".exceldownload tbody").append(
                            '<tr><td>' + a + '</td>' +
                            '<td>' + b + '</td>' +
                            '<td>' + e + '</td>' +
                            '<td>' + c + '</td>' +
                            '<td>' + retaileralttext + '</td>' +
                            '<td>' + retailerURL + '</td></tr>'
                        );
                    }
                    else {
                        var d = $(".exceldownload tbody").append(
                             '<tr><td>' + a + '</td>' +
                             '<td>' + b + '</td>' +
                             '<td>' + e + '</td>' +
                             '<td>' + c + '</td>' +
                             '<td>' + retailertext + '</td>' +
                             '<td>' + retailerURL + '</td></tr>'
                         );
                    }
                                  
                });
            })
        }
        else {
            printTable();
        }

        $(".exceldownload").tableExport({
            // Filetype(s) for the export
            formats: ["xlsx"],
            fileName: "Sheet1"
        });

        $(".exceldownload").find(".btn-toolbar>button").html("<i class='material-icons'>file_download</i> Export")

    }, 500);



}


$(document).on('change', '#ddlWebSites', function () {
    sessionStorage.setItem("retainedWebId", $('#ddlWebSites').val());
    var selectedWebSiteId = $('#ddlWebSites').val();
    $('#txtSearch').val(null);
    $(".spin").show();
    $(".product-details tbody").hide();
    $.ajax({
        type: "GET",
        url: '/ProductSummary/ProductSummary',
        data: { webID: selectedWebSiteId },
        
        success: function (data) {
            $(".spin").hide();
            
            $('.exceldownload > caption').remove();
            $(".exceldownload tbody").empty();
            $(".product-details tbody").show();
            $(".product-details").html(data);          
            setTimeout(function(){
                printTable();},500);
            
        },
        error: function () {
            alert("Error occured!!")
        }
    });
});
$(document).on('click', '.btnExcelClose', function () {

    $('#ExcelUploaded').val(null);
});
$(document).on('click', '.btn-add', function () {

    var selectedWebSiteId = $('#ddlWebSites').val();
    var urlInput = $('#txtInput').val();   
    $(".spin").show();
    if (selectedWebSiteId == '' || urlInput == '')
    {
      
        $('#uploadFeed #alert').html('Please provide the feed URL to proceed further.!!!');
        $(".modal").on("hidden.bs.modal", function () {
            $('#uploadFeed .success-msg #alert').empty();
        });
    }
    else
    {
        $.ajax({
            type: "GET",
            url: '/ProductSummary/UploadFeed',
            dataType: "",
            contentType: 'application/json; charset=utf-8',
            data: { webID: selectedWebSiteId, xmlInput: urlInput },
            success: function (data) {
                $(".spin").hide();
                $('#uploadFeed #alert').html(data);
                $('#txtInput').val("");
                $(".modal").on("hidden.bs.modal", function () {
                    $('#uploadFeed .success-msg #alert').empty();
                });
             
                $.ajax({
                    type: "Get",
                    url: '/ProductSummary/ProductSummary/',
                    data: { WebId: WebIdExcel },
                    dataType: "",
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        $('.product-details').html(data);
                    },
                    error: function () {
                        alert("Error occured!!")
                    }
                });
            },
            error: function () {
                alert("Error occured!!")
            }
        });
    }      
});

$(document).on('change','.btnUpload',function () {


    if ($("#ExcelUploaded")[0].files[0] === null) {
        $('#ExcelUploaded_error').html("You Should Select a File");
        $('#ExcelUploaded_error').show();
        $('#excelUpload').prop('disabled', true);
        $('#excelUpload').addClass('disabled');
    } else if (!($("#ExcelUploaded")[0].files[0].type === 'application/vnd.ms-excel' || $("#ExcelUploaded")[0].files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        $('#ExcelUploaded_error').html("Should be an Excel File");
        $('#ExcelUploaded_error').show();
        $('#excelUpload').prop('disabled', true);
        $('#excelUpload').addClass('disabled');
    }
    else {
        $('#ExcelUploaded_error').hide();
        $('#excelUpload').prop('disabled', false);
        $('#excelUpload').removeClass('disabled');
    }
}); 


$(document).off('click', '.btnUpload').on('click', '.btnUpload', function (e) {
    $('.btnUpload').unbind('click');  
    $(".spin").show();
        e.preventDefault();
        var selectedValue = $('#ddlWebSites').val();
        $('#WebId').val(selectedValue);
        $('#webidForexcel').val(selectedValue);
        var formdata = new FormData();
        var ExcelUploaded = $("#ExcelUploaded")[0].files[0];
        var WebIdExcel = $('#webidForexcel').val();
        formdata.append('ExcelUploaded', ExcelUploaded);
        formdata.append('WebId', WebIdExcel);
     
        if (ExcelUploaded == null)
        {
            
            $('#alert').html("Please upload the Excelfile.!!!");
            $(".modal").on("hidden.bs.modal", function () {
                $('#uploadExcel .success-msg #alert').empty();
            });
        }
        else if (!($("#ExcelUploaded")[0].files[0].type === 'application/vnd.ms-excel' || $("#ExcelUploaded")[0].files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            
            $('#alert').html("Please upload the correct file format. Only Excel file is allowed.!!!");
            $('#ExcelUploaded').val(null);
        }
        else
        {
         
            $.ajax({

                type: 'POST',
                url: '/ProductSummary/UploadExcel',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (data) {
                    $(".spin").hide();
                    $('.exceldownload > caption').remove();
                    $(".exceldownload tbody").empty();

                    $('#alert').html(data);

                    setTimeout(function () {
                        printTable();
                    }, 500);

                    $(".modal").on("hidden.bs.modal", function () {
                        $('#uploadExcel .success-msg #alert').empty();
                    });
                    $.ajax({
                        type: "Get",
                        url: '/ProductSummary/ProductSummary/',
                        data: { WebId: WebIdExcel },
                        dataType: "",
                        contentType: 'application/json; charset=utf-8',
                        success: function (data) {                          
                            $('#ExcelUploaded').val(null);
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

$(document).on('keyup', '#txtSearch', function () {
    var value = $(this).val().toLowerCase();
    var lastcolumn = $(".search-fil tr td .retailer-table tr");
    $(".search-fil tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        lastcolumn.show();
    });

    if (value == "")
    {
        var examplerows = $("#example>tbody>tr");
        examplerows.hide();
        for (var i = 0; i < 10; i++)
        {
            var row = examplerows[i];
            $(row).show();
        }
    }
    
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

var totalDiv;
var totalImg;
$(document).on('click','#ExcelUpload',function () { $("#form0")[0].reset(); });


var dropdowndata;
$(document).on('click','#uploadAdd',function () {
    $('#SkuDetails').hide();
    $('#ProductForm')[0].reset();
    $('#submitForm').prop('disabled', true);
    $('.replicated').remove();
    $('.has-error').hide();
    $('#SkuNameDiv').hide();
    $('#AddingDetailsDiv').hide();
    $('#ProductNameListDiv').show();
    $('.retailer-name-list').find('tbody').find('*').remove();
    $('#replicateDiv .retailer-name-list').hide();
    var grabbedWebId = $('#ddlWebSites').val();
    $('#WebId').val(grabbedWebId);

    $.ajax({
        url: '/ProductSummary/GetAllProductsName',
        dataType: 'json',
        type: 'get',
        data: {
            WebId: grabbedWebId
        },
        success: function (data) {
            $('#ProductNameList').find("option:gt(0)").remove();
            $.each(data, function (key, value) {
                $('#ProductNameList').append('<option value="' + value.ProductId + '">' + value.ProductName + '</option>');
            });
        }
    });

    $.ajax({
        url: '/ProductSummary/GetAllRetailersNamebyWebId',
        dataType: 'json',
        type: 'get',
        data: {
            WebId: grabbedWebId
        },
        success: function (data) {
            dropdowndata = data;
        }
    });
});


$(document).on('change','#ProductNameList',function () {
    $('#SkuNameListDiv').show();
    $('#SkuNameDiv').hide();
    $('#SkuDetails').show();
    $('.replicated').remove();
    $('.has-error').hide();

    $.ajax({
        type: "GET",
        url: '/ProductSummary/GetAllSkewbyProductId',
        data: { ProductId: $("#ProductNameList").val() },
        success: function (data) {
            $('#SkuNameList').find("option:gt(0)").remove();
            $('#SkuNameList').append('<option value="Add">Add SKU</option>');
            $.each(data, function (key, value) {
                $('#SkuNameList').append('<option value="' + value.Gtin + '">' + value.SkuName + '</option>');
            });
            $('#SkuNameList').append('<option value="" selected disabled hidden>Choose here</option>');
        },
        error: function () {
            alert("Error occured!")
        }
    });
});
$(document).on('click','#addNewProduct',function (e) {
    e.preventDefault();
    $('#submitForm').prop('disabled', true);
    $('#ProductNameListDiv').hide();
    $('.retailer-name-list').find('tbody').find('*').remove();
    $('#replicateDiv .retailer-name-list').hide();
    $('#AddingDetailsDiv').show();
    $('#ProductNameListDiv').hide();
    $('#SkuDetails').show();
    $('#ProductName').val('');
    $('#ProductUrl').val('');
    $('#BuyNowUrlList').val('');
    $('#SkuNameListDiv').hide();
    $('#GTIN').val('');
    $('#GTIN').prop('disabled', false);
    $('#SkuNameDiv').show();
    $('#RetailerNameList').find("option:gt(0)").remove();
    $.each(dropdowndata, function (key, value) {
        $('#RetailerNameList').append('<option value="' + value.RetailerId + '">' + value.RetailerName + '</option>');
    });
});

$(document).on('click','#AddingDetailsDivClose',function (e) {
    $('.replicated').remove();
    e.preventDefault();
    $('#ProductName').val('');
    $('#ProductUrl').val('');
    $('#AddingDetailsDiv').hide();
    $('#ProductNameListDiv').show();
    $('#SkuDetails').show();
});
$(document).on('click','#SkuDetailsClose',function () {
    $('#SkuDetails').hide();
});

$('#replicateDiv .retailer-name-list').hide();

$(document).on('click','#plusbtn',function () {
    if ($('#RetailerNameList option').length == 1 || $('#RetailerNameList').val() == null) {
        return false;
    }
    $('#retailerTD').hide();
    if (RetailerNameListerr != false || BuyNowUrlListerr != false) {
        $('#AddGrid_error').html('Select Retailer and Buy Now Url');
        $('#AddGrid_error').show();
        setTimeout(function () { $('#AddGrid_error').hide(); }, 4000);
        return false;
    }

    $('#AddGrid_error').hide();


    $('#replicateDiv .retailer-name-list').show();

    $('#replicateDiv .retailer-name-list tbody').append(

        '<tr><td class="retailerName">' + $('#RetailerNameList option:Selected ').text() + '</td>' +

        '<td class="buyNow">' + '<div class="buy_nw">' + $('#BuyNowUrlList').val() + '</div>' + '</td>' +

        '<td>' + '<a href="#" id="deleteTemp" title="Delete"><i class="material-icons">delete</i></a>' + '</td>'
        +
        '<td style="visibility:hidden" class = "retailerTD1"> <input type="hidden" id="retailerId" name="RetailerNameList" value="' + $('#RetailerNameList').val() + '"/> </td>' +
        '<td style="visibility:hidden" class="retailerTD2"> <input type="hidden" name="BuyNowUrlList" value="' + $('#BuyNowUrlList').val() + '"/> </td></tr>'

    );

    if ($('#RetailerNameList option').length == 2) {
        $('#RetailerNameList').find('option').remove();
        $('#RetailerNameList').append('<option value="00000000-0000-0000-0000-000000000000">Choose</option>');
        $('#BuyNowUrlList').prop('disabled', true);
        $('#submitForm').prop('disabled', false);
        $('#BuyNowUrlList').val('All Retailers are chosen');
    } else {
        $('#RetailerNameList').find(' option:selected ').remove();
        $('#BuyNowUrlList').val(null);
        BuyNowUrlListerr = true;
    }
});

$(document).on('click', '.crossbtn', function () {
    $(this).closest('.replicated').remove();
});

$(document).on('click', '#deleteTemp', function () {
    if ($('#RetailerNameList option').length == 1) {
        $('#BuyNowUrlList').val('');
        $('#BuyNowUrlList').prop('disabled', false);
    }
    var optionText = $(this).closest('tr').find('td:first-child').text();
    var optionVal = $(this).closest('tr').find('.retailerTD1').children().val();
    $('#RetailerNameList').append('<option value="' + optionVal + '">' + optionText + '</option>');
    $(this).closest('tr').remove();
});

$(document).on('focusin', '.RetailerNameReplicated', function () {
    var currdd = this;
    $(this).find("option:gt(0)").remove();
    $.each(dropdowndata, function (key, value) {
        $(currdd).append('<option value="' + value.RetailerId + '">' + value.RetailerName + '</option>');
    });
});


$(document).on('click','#submitForm',function (e) {
    if ($('#ProductName').val() != null && $('.retailer-name-list>tbody>tr').length == 0 || $('#BuyNowUrlList').val().length != 0 && $('#BuyNowUrlList').val() != 'All Retailers are chosen') {
        $('#BuyNowUrlList_error').html('Add The Buy Now Url');
        $('#BuyNowUrlList_error').show();
        $('#plusbtn').css('background', 'red');
        setTimeout(function () { $('#BuyNowUrlList_error').hide(); }, 4000);
        setTimeout(function () { $('#plusbtn').css('background', '#ccc'); }, 1000);
        return false;
    }
    $('#BuyNowUrlList').prop('disabled', false);
    e.preventDefault();
    $('#BuyNowUrlList').val(null);
    if ($('#SkuName').val() == '') {
        var skVal = $('#SkuNameList option:selected ').text();
        $('#SkuName').val(skVal);
    }
    $('#GTIN').prop('disabled', false);

    if ($('#ProductName').val().length > 0) {
        $('#ProductNameList').val(null);
    }
    var ProductName;
    var ProductUrl;
    $.ajax({
        type: "POST",
        url: '/ProductSummary/AddProduct',
        dataType: 'json',
        data: {
            ProductId: $('#ProductNameList').val(),
            ProductName: $('#ProductName').val(),
            ProductUrl: $('#ProductUrl').val(),
            WebId: $('#ddlWebSites').val()
        },
        success: function (SuccessData) {
            $('#ProductNameDiv').append('');
            $('#ProductID').val(SuccessData);
            $.ajax({
                type: "POST",
                url: '/ProductSummary/AddProductSummaryInDB/',
                data: $("#ProductForm").serialize(), // serializes the form's elements.
                success: function (data) {

                    var selectedId = $('#ddlWebSites').val();
                    $.ajax({
                        type: "Get",
                        url: '/ProductSummary/ProductSummary/',
                        data: { WebId: selectedId },
                        dataType: "",
                        contentType: 'application/json; charset=utf-8',
                        success: function (data) {
                            $(".product-details").html(data);
                        },
                        error: function () {
                            alert("Error occured!!")
                        }
                    });

                    $('#ProductForm')[0].reset();
                    $('#myModal').modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    alert(data); // show response
                }
            });

        }
    });

});

//----------------------------Validations----------------------------------------
//++++++++++++++++++++++++++For New Product+++++++++++++++++++++++++++++++++++++++


var productNameerr = false;
var productUrlerr = false;
productNameerr = null;
productUrlerr = null;


$(document).on('keyup','#ProductName',function () {
    if ($('#ProductName').val().length < 1) {
        $('#ProductName_error').html("Enter Product Name");
        $('#ProductName_error').show();
        productNameerr = true;
        $('#submitForm').prop('disabled', true);
    } else {
        productNameerr = false;
        $('#ProductName_error').hide();
        if (productNameerr == false && productUrlerr == false) {
            $('#submitForm').prop('disabled', false);
        } else {
            $('#submitForm').prop('disabled', true);
        }
    }
});

$('#ProductUrl').keyup(function () {
    if ($('#ProductUrl').val().length < 1) {
        $('#ProductUrl_error').html("Enter Product Url");
        $('#ProductUrl_error').show();
        productUrlerr = true;
        $('#submitForm').prop('disabled', true);
    } else {
        productUrlerr = false;
        $('#ProductUrl_error').hide();
        if (productNameerr == false && productUrlerr == false) {
            checkEnable();
        } else {
            $('#submitForm').prop('disabled', true);
        }
    }
});

//+++++++++++++++++++++++++++For Skew++++++++++++++++++++++++++++++++++++

var SkuNameerr = false;
var GTINerr = false;
var RetailerNameListerr = false;
var BuyNowUrlListerr = false;
var disableState = false;

SkuNameerr = null;
GTINerr = null;
RetailerNameListerr = null;
BuyNowUrlListerr = null;
disableState = null;

function checkEnable() {
    if (SkuNameerr == false && GTINerr == false && BuyNowUrlListerr == false && RetailerNameListerr == false) {
        $('#submitForm').prop('disabled', false);
    } else {
        $('#submitForm').prop('disabled', true);
    }

}
$(document).on('change','#SkuNameList',function () {
    var neddedRetailers = [];
    var abc = dropdowndata;

    dropdowndata.forEach(function (value, key) {
        neddedRetailers.push({
            RetailerId: value.RetailerId,
            RetailerName: value.RetailerName
        });
    });
    if ($('#SkuNameList').val() == 'Add') {

        $('#SkuNameListDiv').hide();
        $('#SkuNameDiv').show();
        $('#GTIN').val('');
        $('#GTIN').prop('disabled', false);
        SkuNameerr = true;
        gtinerror = true;
        $('#RetailerNameList').find("option:gt(0)").remove();
        $.each(neddedRetailers, function (key, value) {
            $('#RetailerNameList').append('<option value="' + value.RetailerId + '">' + value.RetailerName + '</option>');
        });
    } else {
        var gtinVal = $("#SkuNameList").val();
        $('#GTIN').val(gtinVal);
        totalDiv = $("div:contains('" + gtinVal + "')").closest('tr').find('.retailer-logo').children('a').find('div');
        totalImg = $('div:contains("' + gtinVal + '")').closest('tr').find('.retailer-logo').children('a').find('img');
        if (totalDiv.length > 0) {
            for (var i = 0; i < totalDiv.length; i++) {
                neddedRetailers.forEach(function (value, key) {
                    if ($(totalDiv[i]).text() == value.RetailerName) {
                        neddedRetailers.splice(key, 1);
                        return false;
                    }
                });
            }
        }
        if (totalImg.length > 0) {
            for (var i = 0; i < totalImg.length; i++) {
                neddedRetailers.forEach(function (value, key) {
                    if ($(totalImg[i]).attr('alt') == value.RetailerName) {
                        neddedRetailers.splice(key, 1);
                        return false;
                    }
                });
            }
        }

        $('#RetailerNameList').find("option:gt(0)").remove();
        $.each(neddedRetailers, function (key, value) {
            $('#RetailerNameList').append('<option value="' + value.RetailerId + '">' + value.RetailerName + '</option>');
        });

        $('#GTIN').prop('disabled', true);
        SkuNameerr = false;
        $('#SkuName_error').hide();
        GTINerr = false;
        $('#GTIN_error').hide();
        checkEnable();
    }
});

$(document).on('keyup','#SkuName',function () {
    if ($('#SkuName').val().length < 1) {
        $('#SkuName_error').html("Enter SkuName");
        $('#SkuName_error').show();
        SkuNameerr = true;
        checkEnable();
    } else {
        SkuNameerr = false;
        $('#SkuName_error').hide();
        checkEnable();
    }
});

$(document).on('change','#RetailerNameList',function () {
    RetailerNameListerr = false;
    checkEnable();
});

$(document).on('keyup','#GTIN',function () {
    if ($('#GTIN').val().length < 1) {
        $('#GTIN_error').html("Enter GTIN");
        $('#GTIN_error').show();
        GTINerr = true;
        checkEnable();
    } else {
        var reg = /^\d+$/;
        if (reg.test($('#GTIN').val())) {
            GTINerr = false;
            $('#GTIN_error').hide();
            checkEnable();
        }
        else {
            $('#GTIN_error').html("GTIN Should be a Number");
            $('#GTIN_error').show();
            GTINerr = true;
            checkEnable();
        }
    }
});

$(document).on('keyup','#BuyNowUrlList',function () {
    if ($('#BuyNowUrlList').val().length < 1) {
        $('#BuyNowUrlList_error').html("Enter Buy Now Url");
        $('#BuyNowUrlList_error').show();
        BuyNowUrlListerr = true;
        checkEnable();
    } else {
        var urlreg = "^(http:\/\/|https:\/\/)(www.)?((?!,).)*$";
        var urlvalid = new RegExp(urlreg, "i");
        if (urlvalid.test($('#BuyNowUrlList').val())) {
            BuyNowUrlListerr = false;
            $('#BuyNowUrlList_error').hide();
            checkEnable();
        }
        else {
            $('#BuyNowUrlList_error').html("Enter A valid Buy Now Url(eg. https://us.pg.com)");
            $('#BuyNowUrlList_error').show();
            BuyNowUrlListerr = true;
            checkEnable();
        }
    }
});


$(document).on('keyup', '.BuyNowUrlReplicated', function () {

    var tempval = this;
    var buynowreplca = $(".BuyNowUrlReplicated");
    if ($(tempval).val().length < 1) {
        $(tempval).closest('.form-group').find('span').html("Enter Buy Now Url");
        $(tempval).closest('.form-group').find('span').show();
        checkEnable();
        $('#submitForm').prop('disabled', true);

    } else {
        $(tempval).closest('.form-group').find('span').hide();
        checkEnable();
        $('#submitForm').prop('disabled', false);
        $(".BuyNowUrlReplicated").each(function () {
            if ($(this).val().length < 1) {
                $('#submitForm').prop('disabled', true);
            }
        });

    }
});


$(document).on('click','#update_submit',function (e) {
    if (!($('#ForupdateBuyNowUrlList').val().length == 0)) {
        $('#ForupdateBuyNowUrlList_error').html('Add The Buy Now Url');
        $('#ForupdateBuyNowUrlList_error').show();
        $('#btnupdateplus').css('background', 'red');
        setTimeout(function () { $('#ForupdateBuyNowUrlList_error').hide(); }, 4000);
        setTimeout(function () { $('#btnupdateplus').css('background', '#ccc'); }, 1000);
        return false;
    }

    var pag = $('.pagination').find('.active').text();
    e.preventDefault();
    var flag = 0;
    var innerDivs = document.getElementsByClassName("retailerurls1");
    for (var i = 0; i < innerDivs.length; i++) {
        if (innerDivs[i].value.length == 0) {
            retailerurlerror = true;
            flag = 1;
        }
    }
    if (flag == 0) {
        $.ajax({
            type: "post",
            url: '/ProductSummary/UpdateProduct',
            data: $("#ProductUpdate").serialize(),
            success: function (res) {
                var selectedWebSiteId = $('#ddlWebSites').val();
                $.ajax({
                    type: "GET",
                    url: '/ProductSummary/ProductSummary',
                    data: { webID: selectedWebSiteId },
                    success: function (data) {
                        $(".product-details").html(data);
                        document.getElementById("closefromprogram").click();
                        Pagination(pag);
                    },
                    error: function () {
                        alert("Error occured!")
                    }
                });
            },
            error: function () { alert("Error occured!!") }
        });
    }
});
var gtinerror = false;
var pnameerror = false;
var purlerror = false;
var retailerurlerror = false;
var skuerror = false;
$(document).on('keyup','#Gtin',function () {
    if ($.isNumeric($("#Gtin").val())) {
        $("#errormsgforgtin").hide();
        gtinerror = false;
        checkupdateenable();
    }
    else {
        $("#errormsgforgtin").show();
        gtinerror = true;
        checkupdateenable();
    }
});
$(document).on('keyup','#sku',function () {
    if ($("#sku").val().length == 0) {
        $("#errormsgforsku").show();
        skuerror = true;
        checkupdateenable();
    }
    else {
        $("#errormsgforsku").hide();
        skuerror = false;
        checkupdateenable();
    }
});
$(document).on('keyup','#purl',function () {
    if ($("#purl").val().length == 0) {
        $("#errormsgforurl").show();
        purlerror = true;
        checkupdateenable();
    }
    else {
        $("#errormsgforurl").hide();
        purlerror = false;
        checkupdateenable();
    }
});
$(document).on('keyup','#pname',function () {
    if ($("#pname").val().length == 0) {
        $("#errormsgforname").show();
        pnameerror = true
        checkupdateenable();
    }
    else {
        $("#errormsgforname").hide();
        pnameerror = false;
        checkupdateenable();
    }
});
$(document).on('keyup', '.edit-retailer-name-list input', function () {
    var valuofurl = this.value;
    var errDIVRef = this.closest('tr');
    errDIV = $(errDIVRef).find('.error');
    var sample = $('#test tr').find('[id = "wanted"]');
    console.log(sample);
    var urlreg = "^(http:\/\/|https:\/\/)(www.)?((?!,).)*$";
    var urlvalid = new RegExp(urlreg, "i");
    if (valuofurl.length == 0) {
        errDIV.show();
    }
    else if (!urlvalid.test(valuofurl)) {
        //condition
        errDIV.html('Enter A valid Buy Now Url(eg. https://us.pg.com)');
        errDIV.show();
        $($(sample[i]).find('[id="errorretailerurl"]')).css('display', 'inline-block');
    }
    else {
        errDIV.hide();

    }
});
function checkupdateenable() {
    if (pnameerror == false && purlerror == false && gtinerror == false && skuerror == false) {
        $("#update_submit").prop('disabled', false);
    }
    else {
        $("#update_submit").prop('disabled', true);
    }
}

$(document).on('click','#delete_submit',function (e) {
    var pag = $('.pagination').find('.active').text();
    e.preventDefault();
    $.ajax({
        type: "post",
        url: '/ProductSummary/DeleteProduct',
        data: $("#deleteproduct").serialize(),
        success: function (res) {
            var selectedWebSiteId = $('#ddlWebSites').val();
            $.ajax({
                type: "GET",
                url: '/ProductSummary/ProductSummary',
                data: { webID: selectedWebSiteId },
                success: function (data) {
                    $('.exceldownload > caption').remove();
                    $(".exceldownload tbody").empty();

                    $(".product-details").html(data);

                    setTimeout(function () {
                        printTable();
                    }, 500);

                    document.getElementById("closefromprogramdelete").click();

                    Pagination(pag);
                },
                error: function () {
                    alert("Error occured!")
                }
            });
        },
        error: function () { alert("Error occured!!") }
    });
});
var ForupdateBuyNowUrlListErr = true;

$(document).on('keyup','#ForupdateBuyNowUrlList',function () {
    if ($('#ForupdateBuyNowUrlList').val().length < 1) {
        $('#ForupdateBuyNowUrlList_error').html("Enter Buy Now Url");
        $('#ForupdateBuyNowUrlList_error').show();
        ForupdateBuyNowUrlListErr = true;

    } else {
        var urlregurl = "^(http:\/\/|https:\/\/)(www.)?((?!,).)*$";
        var urlvalidurl = new RegExp(urlregurl, "i");
        if (urlvalidurl.test($('#ForupdateBuyNowUrlList').val())) {
            $('#ForupdateBuyNowUrlList_error').hide();
            ForupdateBuyNowUrlListErr = false;
        }
        else {
            $('#ForupdateBuyNowUrlList_error').html("Enter A valid Buy Now Url(eg. https://us.pg.com)");
            $('#ForupdateBuyNowUrlList_error').show();
            ForupdateBuyNowUrlListErr = true;
        }
    }
});


$(document).on('click','#updateplusbtn',function () {
    if ($('#ForUpdateRetailerNameList').val() == null || ForupdateBuyNowUrlListErr == true) {
        $('#ForupdateBuyNowUrlList_error').html('Select Retailer and Buy Now Url');
        $('#ForupdateBuyNowUrlList_error').show();
        setTimeout(function () { $('#ForupdateBuyNowUrlList_error').hide(); }, 4000);
        return false;
    }

    $('#addbuynowurlbtn').hide();
    $('#removebuynowurlbtn').show();
    $('.edit-retailer-name-list').show();
    $('.edit-retailer-name-list tbody').append(
        '<tr class="tobeappended">' +
        '<td class="editRetailerName">' + $('#ForUpdateRetailerNameList option:Selected ').text() + '</td>' +

        '<td class="editBuyNow" > ' + '<div>' + $('#ForupdateBuyNowUrlList').val() + '</div>' + '</td > ' +

        '<td>' + '<a href="#" class="updatedeleteTemp" title= "Delete" > <i class="material-icons">delete</i></a >' + '</td> ' +
        '<td style= "visibility:hidden" class="updateretailerTD1" > <input type="hidden" id="updateretailerId" name="UpdateRetailerNameList" value="' + $('#ForUpdateRetailerNameList').val() + '" /> </td> ' +
        '<td style= "visibility:hidden" class="updateretailerTD2" > <input type="hidden" name="updateBuyNowUrlList" value="' + $('#ForupdateBuyNowUrlList').val() + '" /> </td></tr> '
    );

    $('#ForUpdateRetailerNameList').find(' option:selected ').remove();
    $('#ForupdateBuyNowUrlList').val(null);
    ForupdateBuyNowUrlListErr = true;
});

$(document).on('click', '.updatedeleteTemp', function () {
    var optionText = $(this).closest('tr').find('td:first-child').text();
    var optionVal = $(this).closest('tr').find('.updateretailerTD1').children().val();
    $('#ForUpdateRetailerNameList').append('<option value="' + optionVal + '">' + optionText + '</option>');
    $(this).closest('tr').remove();
});

$(document).on('click','#addbuynowurlbtn',function () {
    $('#editforbuynowurls').show();
    $('#addbuynowurlbtn').hide();
    $('#removebuynowurlbtn').show();
    $('#ForupdateBuyNowUrlList').val(null);
    $('#ForUpdateRetailerNameList').find("option:gt(0)").remove();
    $.each(neededRetailers, function (key, value) {
        $('#ForUpdateRetailerNameList').append('<option value="' + value.RetailerId + '">' + value.RetailerName + '</option>');
    });
});

$(document).on('click','#removebuynowurlbtn',function () {
    $('#removebuynowurlbtn').hide();
    $('#addbuynowurlbtn').show();
    $('#editforbuynowurls').hide();
});
