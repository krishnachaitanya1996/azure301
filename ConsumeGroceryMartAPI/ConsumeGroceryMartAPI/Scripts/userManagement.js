var selected_data;
$(document).ready(function () {
    $('.select-box').hide();
    $("[value='Select Some Options']").val("Select Sites");
    $("#Brands").change(function () {
        selected_data = $("#Brands").val();
        $.ajax({
            type: "POST",
            url: "/User/GetSites",
            data: { 'brandName': selected_data },
            dataType: "json",
            success:
            function (data) {
                var selected_sites = [];
                $("#For_all").show();
                selected_sites = $("#allsites").val();
                $("#allsites").empty();
                $(".Multiselect").trigger("chosen:updated");
                $.each(data, function (i) {
                    var optionhtml = '<option class="Sites" value="' +
                        data[i].WebID + '">' + data[i].WebDomain + '/' + data[i].WebLocale + '</option>';
                    $("#allsites").append(optionhtml);
                    $(".Multiselect").trigger("chosen:updated");
                });
            },
            error: function () {
                alert("Error occured!!")
            }
        });
    });
    $("#All").click(function () {
        $(".Sites").prop('selected', true);
        $(".Multiselect").trigger("chosen:updated");
    });
    $("#Remove_All").click(function () {
        $(".Sites").prop('selected', false);
        $(".Multiselect").trigger("chosen:updated");
    });
    $.ajax({
        url: "/User/UserRoleMapping",
        success: function (roledata) {
            $("#roledataa").html(roledata);
        }
    });
});
$("#submitform").click(function (e) {

    e.preventDefault();
    var sites = $("#allsites").val();
    var username = $("#email").val();
    if (sites != null && username != null) {
        $.ajax({
            url: "/User/AddAccessToSites",
            type: "POST",
            data: $("#UserRoleAssign").serialize(),
            success: function (data) {
                $('#UserRoleAssign')[0].reset();
                $(".Multiselect").trigger("chosen:updated");
                $('#msgscss').html(data);
                $('#msgscss').fadeIn('fast');
                $('#errormsg').hide();
                setTimeout(function () {
                    $('#msgscss').fadeOut('slow');
                    $('#msgscss').html('');
                }, 4000);
            },
            error: function () {
                alert("role assign error");
            }

        });
    }
    //else if(sites=null)
    //{
    //    $("#errormsgforsite").show();
    //}
    //else if (username = null) {
    //    $("#errormsgforemial").show();
    //}
    else {
        $(".success-msg").css("display", "none")
        $("#errormsg").show();
    }
});