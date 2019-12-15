$(document).ready(function () {
   
    $(".pagination").empty();
    var totalRows = $('.product-details').find('tbody tr[id="prodSumHead"]:has(td)').length;
    var recordPerPage = 10;
    var totalPages = Math.ceil(totalRows / recordPerPage);

    if (totalPages > 1) {

        $('<li class="page-item prev"><a class="page-link" href= "#" tabindex= "-1"><i class="material-icons">first_page</i></a></li>').appendTo(".pagination");
        $('<li class="page-item prevStep"><a class="page-link" href= "#" tabindex= "-1">P</a></li>').appendTo(".pagination");
        for (i = 0; i < totalPages; i++) {
            $('<li class="page-item"><a href="#" class="pageNum page-link" >' + (i + 1) + '</a></li> ').appendTo(".pagination");
        }
        $('<li class="page-item nextStep"><a class="page-link" href= "#">N</a></li>').appendTo(".pagination");
        $('<li class="page-item next"><a class="page-link" href="#"><i class="material-icons">last_page</i></a></li>').appendTo(".pagination");

        //For pager
        var pagerPerPage = 10;
       
        $('.pageNumber').hover(function () {
            $(this).addClass('focus');
        }, function () {
            $(this).removeClass('focus');
        });
        $('#example').find('tbody tr[id="prodSumHead"]:has(td)').hide();
        var tr = $('#example tbody tr[id="prodSumHead"]:has(td)');

        for (var i = 0; i <= recordPerPage - 1; i++) {

            $(tr[i]).show();
        }
        $('.pagination').find('.pageNum').hide();
        
        $('.pagination').find('.prev').hide();
        var pager = $('.pagination').find('.pageNum');
        var prev = 0;
        var curr = 1;
        var next = pagerPerPage;
        $('.pagination li:first').next().next().addClass("active");
        for (var i = 0; i < pagerPerPage; i++) {
            $(pager[i]).show();
        }
        if (totalPages < pagerPerPage) {
            $('.pagination').find('.next').hide();
        }

        $('.pageNum').on('click', function (event) {
          //  console.log($(this).text());
            curr = $(this).text();
            $('.page-item').removeClass("active");
            $(this).parent().addClass("active");
            $('.product-details').find('tbody tr[id="prodSumHead"]:has(td)').hide();
            var nBegin = ($(this).text() - 1) * recordPerPage;
            var nEnd = $(this).text() * recordPerPage - 1;
            for (var i = nBegin; i <= nEnd; i++) {
                $(tr[i]).show();
            }
            
            showPrevStep(curr);
            showNextStep(curr);
        });
        $('.next').on('click', function (event) {

            $('.pagination').find('.pageNum').hide();
            var nBegin = next;
            var nEnd = next + pagerPerPage;
            for (var i = nBegin; i < nEnd; i++) {
                $(pager[i]).show();
            }
            prev = next;
            next = nEnd;
            if (prev != 0) {  
                $('.pagination').find('.prev').show();
            }
            if (nEnd >= totalPages) {
                $('.pagination').find('.next').hide();
            }
            $(pager[nBegin]).click();
            $('.pagination').find('.prevStep').show();
        });
        $('.prev').on('click', function (event) {
            $('.pagination').find('.pageNum').hide();
            var nBegin = prev - pagerPerPage;
            var nEnd = prev;
            for (var i = nBegin; i < nEnd; i++) {
                $(pager[i]).show();
            }
            prev = nBegin;
            next = nEnd;
            if (prev == 0) {     
                $('.pagination').find('.prev').hide();
            }

            $('.pagination').find('.next').show();
            $(pager[nEnd - 1]).click();
           
        });
  
        $('.nextStep').on('click', function (event) {
            if (curr == next)
                $('.pagination').find('.next').click();
            else
                $(pager[curr]).click();          
        });
        $('.prevStep').on('click', function (event) {    
            if (curr-1  == prev)
                $('.pagination').find('.prev').click();
            else
                $(pager[curr - 2]).click();    
        });     
            $('.pagination').find('.prevStep').hide();
            $('.pagination').find('.nextStep').show();
    }


    function showPrevStep(curr)
    { 
        if (curr != 1)
            $('.pagination').find('.prevStep').show();
        else
            $('.pagination').find('.prevStep').hide();
    }

    function showNextStep(curr) {
        if (curr == totalPages) 
            $('.pagination').find('.nextStep').hide();
        else
            $('.pagination').find('.nextStep').show();
    }

});

function Pagination(i) {
  
    var recordPerPage = 5;
    var pager = $('.pagination').find('.pageNum');
    var totalRows = $('.product-details').find('tbody tr[id="prodSumHead"]:has(td)').length+1;
    if (totalRows == 1)
    {
        
    }
    else if ((totalRows % recordPerPage) == 1)
    {
        $(pager[i-2]).click();
    }
    else
    $(pager[i-1]).click(); 
}