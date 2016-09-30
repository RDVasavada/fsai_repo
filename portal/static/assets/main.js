function rerun() {
    url = String(window.location.href)
    if ((url.indexOf("dashboard")) > 0 ){
        $.getScript("/static/assets/js/plugins/knob/jquery.knob.js")
        $("input#risks").knob();
        $('<link/>', {
           rel: 'stylesheet',
           type: 'text/css',
           href: "/static/css2/d3chart.css"
        }).appendTo('head');        
        $.getScript("/static/js/user/dashboard.js")
        $.getScript("/static/assets/js/actions.js")
    } else if ((url.indexOf("inbox")) > 0 ) {
        $.getScript("/static/js/user/inbox.js")
        $.getScript("/static/assets/js/actions.js")
    } else if ((url.indexOf("sent")) > 0 ) {
        $.getScript("/static/assets/js/actions.js")
    } else if ((url.indexOf("portfolio_settings")) > 0 ) {
        $.getScript("/static/assets/js/plugins.js")
        $.getScript("/static/assets/js/plugins/stepy/jquery.stepy.min.js")
        $.getScript("/static/js/user/portfolio_settings.js")
        $.getScript("/static/assets/js/actions.js")
    } else if ((url.indexOf("individual_portfolio")) > 0 ) {  
        $.getScript("/static/assets/js/plugins/knob/jquery.knob.js")
        $.getScript("/static/js/user/individual_portfolio.js")
        $.getScript("/static/assets/js/actions.js") 
        $("input#risks").knob();
        $("#pieChart").d3pie();
    } else if ((url.indexOf("individual_stock")) > 0 ) {  
        $.getScript("/static/js/user/individual_stock.js")
        $.getScript("/static/assets/js/actions.js") 
    }else if ((url.indexOf("my_portfolios")) > 0 ) {  
        $.getScript("/static/assets/js/actions.js")
        $.getScript("/static/assets/js/plugins/knob/jquery.knob.js")
        $("input#risks").knob();
        $.getScript("/static/js/user/my_portfolios.js")
    }else if ((url.indexOf("news_portal")) > 0 ) {  
        $.getScript("/static/js/user/news_portal.js")
        $.getScript("/static/assets/js/actions.js")
    }
    else if ((url.indexOf("support")) > 0 ) {  
        $.getScript("/static/js/user/support.js")
        $.getScript("/static/assets/js/actions.js")
    }    
}

(function ($) {
    'use strict';

    $(document).ready(function () {
        // Init here.
        var $body = $('body'),
            $main = $('#main'),
            $site = $('html, body'),
            transition = 'fade',
            smoothState;

        smoothState = $main.smoothState({
            onBefore: function($anchor, $container) {
                var current = $('[data-viewport]').first().data('viewport'),
                    target = $anchor.data('target');
                current = current ? current : 0;
                target = target ? target : 0;
                if (current === target) {
                    transition = 'fade';
                } else if (current < target) {
                    transition = 'moveright';
                } else {
                    transition = 'moveleft';
                }
            },
            onStart: {
                duration: 400,
                render: function (url, $container) {
                    $main.attr('data-transition', transition);
                    $main.addClass('is-exiting');
                    $site.animate({scrollTop: 0});
                }
            },
            onReady: {
                duration: 0,
                render: function ($container, $newContent) {
                    $container.html($newContent);
                    $container.removeClass('is-exiting');
                }
                
            },
            onAfter: function() {
                rerun()    
            }            
        }).data('smoothState');

    });

}(jQuery));