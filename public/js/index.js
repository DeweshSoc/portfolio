
$(window).on("load", () => {
  setInterval(function () {
    $("#loader").fadeOut("slow");
  },0);
});



$(window).on('scroll', function () {    
    if ($(this).scrollTop() > 50) {
        // console.log(this);
        if (!$('.navigation').hasClass('expand')) {
            $('.navigation').addClass('expand');
        }
    } else {
        if ($('.navigation').hasClass('expand')) {
            $('.navigation').removeClass('expand');
        }
    // console.log($(this).scrollTop());
    }
});
let mainNav = $('.nav-items');
let navBarToggle = $('#nav-toggler');

navBarToggle.on("click", function () {
  mainNav.slideToggle();
});















