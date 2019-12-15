
var chkvalidFile = '';
$(document).on('change', '#ImgLogo', function () {
    $('#errorforheight').html('');
    //var fileUpload = $("#ImgLogo :visible")[0];
    var fileUpload = $("input[type=file]:visible")[0];
    var fileReader1 = new FileReader();

    fileReader1.readAsDataURL(fileUpload.files[0]);
    fileReader1.onload = function (e) {
        var image = new Image();
        image.src = e.target.result;
        image.onload = function () {

            var height = this.height;
            var width = this.width;

            //chkvalidFile=""

            var fileReader = new FileReader();
            fileReader.readAsArrayBuffer(base);
            if (height == 60 && width == 180) {
                
                $("#errorfordimensions").html('');
            }
            else {
                $("#errorfordimensions").html('Image pixels should be Height: 60px & width:180px.!!');
                //chkvalidFile = "Image pixels should be Height: 60px & width:180px.!!";
            }

            var fileReader = new FileReader();
            fileReader.readAsArrayBuffer(base);
            fileReader.onloadend = function (e) {
                var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                var header = "";
                for (var i = 0; i < arr.length; i++) {
                    header += arr[i].toString(16);
                }
                fileType = header.toString();
                switch (header.toUpperCase()) {
                    case '89504E47':
                        console.log('image/png');
                        break;
                    case '47494638':
                        console.log('image/gif');
                        break;
                    case 'FFD8FFDB':
                    case 'FFD8FFE1':
                    case 'FFD8FFE0':
                        console.log('image/jpeg');
                        break;
                    
                    default:
                        if (header.slice(0, 4) == '424d')
                            console.log('image/bmp');
                        else {
                            console.log('Unknown filetype');
                            chkvalidFile = chkvalidFile + "Only '.jpeg', '.jpg', '.png', '.gif', '.bmp' formats are allowed.";
                        }
                }

            };
        }
    }
});
(function ($) {
    $(function () {

        $("img").error(function () {
            var sample = $(this)["0"].alt
            $(this).replaceWith("<div>" + sample + "</div>");
        });

        var base = '';
        $(document).delegate(':file', 'change', function () {
            if (this.files && this.files[0]) {
                base = this.files[0];
            }
        });


        $(function () {
            enableScriptAfterPagination();
        })

        function enableScriptAfterPagination() {
            $('.edit-mode').hide();
            $('.edit-retailer, .cancel-retailer').on('click', function () {
                $("#errorfordimensions").html('');
                var tr = $(this).parents('tr:first');
                tr.find('.edit-mode, .display-mode').toggle();
                tr.find('#ImgLogo').val('');

                base = '';

                $('#error').remove();
            });

            $('.reduce-priority').on('click', function () {
                var tr = $(this).parents('tr:first');
                var retailerId = tr.find('#lblId').val();
                var Reduce = true;
                var selectedWebSiteId = $('#ddlWebSites').val();
                $.confirm({
                    text: "Do you want to decrease the priority?",
                    title: "Change Priority to Down",
                    confirm: function () {

                        UpdatePriority(retailerId, selectedWebSiteId, Reduce);

                    },
                    cancel: function () {
                        return;
                    }
                });
            });

            $('.increase-priority').on('click', function () {
                var tr = $(this).parents('tr:first');
                var retailerId = tr.find('#lblId').val();
                var Reduce = false;
                var selectedWebSiteId = $('#ddlWebSites').val();

                $.confirm({
                    text: "Do you want to increase the priority?",
                    title: "Change Priority to Up",
                    confirm: function () {

                        UpdatePriority(retailerId, selectedWebSiteId, Reduce);

                    },
                    cancel: function () {
                        return;
                    }
                });
            });

            $('.delete-retailer').on('click', function () {
                var tr = $(this).parents('tr:first');
                var RetailerId = tr.find('#lblId').val();

                $.confirm({
                    title: "Delete Retailer",
                    text: " All the SKU BuyNow urls related to this Retailer also will be deleted. <br/>Are you sure you would like to delete this retailer?",
                    confirm: function () {

                        if (RetailerId.length > 0) {
                            $.ajax({
                                url: '/Retailer/DeleteRetailerData',
                                data: { RetailerId: RetailerId },
                                type: 'Post',
                                success: function (data) {
                                    var selectedId = $('#ddlWebSites').val();
                                    $.ajax({
                                        type: "Get",
                                        url: '/Retailer/GetRetailers',
                                        data: { WebId: selectedId },
                                        dataType: "",
                                        contentType: 'application/json; charset=utf-8',
                                        success: function (data) {
                                            $('#container-grid').html(data);
                                        },
                                        error: function () {
                                            alert("Error occured!!")
                                        }
                                    });
                                }
                            });
                        }

                    },
                    cancel: function () {
                        return;
                    }
                });

            });

            $('.save-retailer').on('click', function () {
                if ($("#errorfordimensions").text().length<1) {
                    $('#error').remove();
                    var tr = $(this).parents('tr:first');
                    var RetailerId = tr.find('#lblId').val();
                    var Status = tr.find('#ChkStatus').prop("checked");
                    if (Status) {
                        $('#idStatus').addClass("dot active");
                    }
                    else {
                        $('#idStatus').addClass("dot");
                    }


                    var RetailerName = tr.find("#Name").val().trim();
                    var RetailerUrl = tr.find("#Url").val().trim();
                    var Comment = tr.find("#comment").val().trim();
                    var ImageUploaded = base;
                    var validationMsg = validateInputs(RetailerName, RetailerUrl, ImageUploaded);
                    if (validationMsg != null && validationMsg.length > 0) {
                        var newDiv = document.createElement('div');
                        newDiv.setAttribute('id', 'error');
                        var newSpan = document.createElement('span');
                        newSpan.innerHTML = validationMsg;
                        newDiv.appendChild(newSpan);
                        $(this).parents('tr:first').append(newDiv);
                        return;
                    }

                    tr.find("#lblChklogo").text(Status);
                    tr.find("#lblName").text(RetailerName);
                    tr.find("#lblUrl").text(RetailerUrl);
                    tr.find("#comment").text(Comment);
                    tr.find('.edit-mode, .display-mode').toggle();

                    var formdata = new FormData();
                    formdata.append('ImageUploaded', ImageUploaded);
                    formdata.append('RetailerId', RetailerId);
                    formdata.append('RetailerStatus', Status);
                    formdata.append('RetailerName', RetailerName);
                    formdata.append('RetailerBrandUrl', RetailerUrl);
                    formdata.append('Comments', Comment);
                    $.ajax({
                        url: '/Retailer/UpdateRetailerData/',
                        data: formdata,
                        type: 'POST',
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            var selectedId = $('#ddlWebSites').val();
                            $.ajax({
                                type: "Get",
                                url: '/Retailer/GetRetailers',
                                data: { WebId: selectedId },
                                dataType: "",
                                contentType: 'application/json; charset=utf-8',
                                success: function (data) {
                                    $('#container-grid').html(data);
                                },
                                error: function () {
                                    alert("Error occured!!")
                                }
                            });
                        }
                    });
                }
                });

        
        }

        function validateInputs(RetailerName, RetailerUrl, ImageUploaded) {

            var validationMsg;
            if (RetailerName.length < 1) {
                validationMsg = ' Retailer name cannot be empty.';
            }
            if (RetailerUrl.length < 1) {
                if (validationMsg != null)
                    validationMsg = validationMsg.concat(' Retailer url cannot be empty.');
                else
                    validationMsg = 'Retailer url cannot be empty.';
            }
            if (ImageUploaded.size > 0) {
                var imageSize = Math.round(ImageUploaded.size / 1024);
                if (imageSize > 10) {
                    if (validationMsg != null)
                        validationMsg = validationMsg.concat(' Image size should be less than 10 kb.');
                    else
                        validationMsg = 'Image size should be less than 10 kb.';
                }
                else {
                    if (validationMsg != null)
                        validationMsg = validationMsg.concat(chkvalidFile);
                    else
                        validationMsg = chkvalidFile;
                }
            }
            return validationMsg;
        }

        function UpdatePriority(retailerId, selectedWebSiteId, Reduce) {
            if (retailerId.length > 0) {

                $.ajax({
                    url: '/Retailer/UpdateRetailerPriorityByRetailerId',
                    data: {
                        RetailerId: retailerId,
                        webId: selectedWebSiteId,
                        reduce: Reduce
                    },
                    type: 'Post',
                    success: function (data) {
                        $.ajax({
                            type: "Get",
                            url: '/Retailer/GetRetailers',
                            data: { WebId: selectedWebSiteId },
                            dataType: "",
                            contentType: 'application/json; charset=utf-8',
                            success: function (data) {
                                $('#container-grid').html(data);
                            },
                            error: function () {
                                alert(data + "Error occured!!");
                            }
                        });
                    }

                });
            }
        }
    });
})(jQuery);