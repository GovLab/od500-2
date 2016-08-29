$(document).ready(function () {
    // Smooth Scrolling Function
    $('a[href*=#]:not([href=#])').click(function () {
        var $targ = $(this.hash),
            host1 = this.hostname,
            host2 = location.hostname,
            path1 = this.pathname.replace(/^\//, ''),
            path2 = location.pathname.replace(/^\//, '');

        if (!$targ.length) {
            $targ = $('[name=' + this.hash.slice(1) + ']');
        }

        if ($targ.length && (host1 === host2 || path1 === path2)) {
            $('html, body').animate({ scrollTop: $targ.offset().top }, 1000);

            return false;
        }

        return true;
    });

    // Modal Click Behavior
    $('.js-open-modal').click(function () {
        $('.js-target-modal').addClass('js-active');
        $('#overlay').addClass('js-active');
        $('body').addClass('js-body-modal-active');
    });

    $('.js-close-modal').click(function () {
        $('.js-target-modal').removeClass('js-active');
        $('#overlay').removeClass('js-active');
        $('body').removeClass('js-body-modal-active');
    });

    // Sticky Click Behavior
    $('.js-close-sticky').click(function () {
        $('.js-target-sticky').removeClass('js-active');
    });

    // Search Click Behavior
    $('.js-trigger-search').click(function (e) {
        e.preventDefault();
        $(this).parent().addClass('js-active');
        $('#overlay').addClass('js-active');
    });


    // Table Search
    $('.js-open-table-search').click(function (e) {
        e.preventDefault();
        $(this).parent().siblings('.table-sortable__search').toggleClass('table-sortable__search--active');
    });

    // Main Menu Click Behavior
    $('.js-trigger-menu').click(function (e) {
        $(this).next().addClass('js-active-menu');
    });

    // General Click Behavior for Overlay
    $('#overlay').click(function () {
        $('.js-active').removeClass('js-active');
        $('.js-active-menu').removeClass('js-active-menu');
    });

    // Slider
    $('.slider').slick({
        arrows: true,
        draggable: false,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    draggable: true
                }
            }
        ]
    });

    // Timeline Default
    var timelineItems = $(".timeline-boxes__item");
    var latestTimelineItem = timelineItems[timelineItems.length -1]
    $(latestTimelineItem).addClass("timeline-boxes__item--latest");

    $(".timeline-boxes").on("mouseover", function() {
        $(latestTimelineItem).removeClass("timeline-boxes__item--latest")
    }).on("mouseout", function() {
        $(latestTimelineItem).addClass("timeline-boxes__item--latest")
    });

    $( ".timeline-boxes li" ).hover(function() { 
      $('.timeline-boxes').toggleClass('timeline-boxes--active-' + $(this).index()); 
    });



    // List.js Implementation
    var fuzzyOptions = {
      searchClass: "fuzzy-search",
      location: 0,
      distance: 100,
      threshold: 0.4,
        multiSearch: true
    };
    var options = {
    valueNames: [ {name:'company__name', attr:'data-target'}, 'company__category', 'company__type', 'company__founded', {name:'company__location', attr:'data-target'}, 'company__last-update' ],
        plugins: [ ListFuzzySearch() ]                  
    };

    var companyList = new List('company_data', options);

    function searchReset() {
        $(".search").val("");
        companyList.search();
    }

    // Filter by name and location
    $(".fuzzy-search").keyup(function() {
        if (this.id=="company__name--input") {
            var searchString = $(this).val();
            companyList.fuzzySearch.search(searchString, ["company__name"]);
        } else if (this.id=="company__location--input") {
            var searchString = $(this).val();
            companyList.fuzzySearch.search(searchString, ["company__location"]);
        } 
    });

    $(".js-open-table-search").on("click", function(e) {
       $($(this).attr('data-target')).focus();
    }) 
    
    // Xs and ESC TO CLOSE OUT FORM
    var searchButtons = $('.table-sortable__search').find("button[type='submit']")

    searchButtons.on("click", function(e) {
        e.preventDefault();
        if ($(this).parent().hasClass("table-sortable__search--active")) {
            $(this).parent().removeClass("table-sortable__search--active")
            searchReset()
        }
    })

    $("body").keyup(function(event) {
        if ( event.keyCode == "27" ) {
            $(this).parent().find('.table-sortable__search').removeClass("table-sortable__search--active");
            searchReset();
        }
    });

    // SORT ICON
    var sortClickButtons = $(".table-sortable__control > i:contains('keyboard_arrow_down')");
    sortClickButtons.on("click", function() {
        $(this).text() == "keyboard_arrow_down" ? $(this).text("keyboard_arrow_up") : $(this).text("keyboard_arrow_down")
        
    });

}); // doc.ready
