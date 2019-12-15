$(document).ready(function () {

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
                    url: '/Dashboard/Dashboard',
                    data: { webID: selectedWebSiteId },

                    success: function (data) {

                        $(".product-details").html(data);

                    },
                    error: function () {
                        alert("Error occured!")
                    }
                });
            }
            else
            {
                alert("You have no acess to any sites");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            var errorMsg = 'Ajax request failed: ' + xhr.responseText;
            $('#content').html(errorMsg);
        }
    });

    

});

$("#Dasboard_update_submit").click(function (e) {
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
            url: '@Url.Action("UpdateDashboard", "Dashboard")',
            data: $("#dashboardUpdate").serialize(),
            success: function (res) {               
                $('#modalsuccesstext').html(res);
                $('#modalsuccesstext').show();
                var selectedWebSiteId = $('#ddlWebSites').val();
                $.ajax({
                    type: "GET",
                    url: '/Dashboard/Dashboard',
                    data: { webID: selectedWebSiteId },

                    success: function (data) {
                        $(".product-details").html(data);
                        //document.getElementById("closefromprogram").click();
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
$("#test").keyup(function (event) {
    var sample = $(this).find('[id = "wanted"]');
    for (var i = 0; i < sample.length; i++) {
        if ($(sample[i]).find('[id="retailerurl"]').val().length == 0) {
            $($(sample[i]).find('[id="errorretailerurl"]')).css('display', 'inline-block');
        }
        else {
            $($(sample[i]).find('[id="errorretailerurl"]')).css('display', 'none');
        }
    }
});

$(document).on('change','#ddlWebSites',function () {
    sessionStorage.setItem("retainedWebId", $('#ddlWebSites').val());
    var selectedWebSiteId = $('#ddlWebSites').val();
    $('.spin').spin().show();
    $('.product-details>tbody').hide();
    
    $.ajax({
        type: "GET",
        url: '/Dashboard/Dashboard',
        data: { webID: selectedWebSiteId },
        success: function (data) {
            $('.spin').spin().hide();
            $('.product-details>tbody').show(2000);
            $('.product-details').html(data);        
        },
        error: function () {
            alert("Error occured!!")
        }
    });
});
