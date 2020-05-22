import $ from 'jQuery';

export function scrollTop(){
    
    if(screen.width>700){
        var pagetop = $('.scroll-top');
        // 200px スクロールしたらボタン表示
        $(window).scroll(function () {
            if ($(this).scrollTop() > 200) {
                
                    pagetop.fadeIn(300);
                    // pagetop.css('visibility','visible');
            } else {
                    pagetop.fadeOut(300);
                    // pagetop.css('visibility','hidden');
            }
        });
        pagetop.click(function () {
            $('body, html').animate({ scrollTop: 0 }, 500);
            return false;
        });
    }
  
}

