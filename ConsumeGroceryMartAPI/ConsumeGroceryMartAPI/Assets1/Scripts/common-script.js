
(function ($) {
    $(function () {
        
      
        $('.spin').spin();

        $("header .nav-menu .nav li a").each(function () {
            if ($(this).attr("href") == window.location.pathname) {
                $(this).parent().addClass("active");
            }
        });

        $('[data-toggle="tooltip"]').tooltip();

        $(".modal").on("hidden.bs.modal", function () {
            $('#uploadFeed .modal-body input').val('');
            $('#retailerExcel .modal-body #modalsuccesstext').val('');
        });

        $(".profile").on("click", function (event) {
            event.stopPropagation();
            $(".sub-nav").slideToggle("fast");
        });

        $(document).click(function () {
            $('.sub-nav').hide();
        });

        
    });
})(jQuery);


