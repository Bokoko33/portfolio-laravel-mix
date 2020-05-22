import $ from 'jQuery'
import {scrollTop} from './modules/scroll-top' //{}必須らしい
import {smart_phone_menu} from './modules/sp-menu'
import {sketch} from './p5-sketch/sketch'
import p5 from 'p5'
// import './barba/barba.min.js'

new p5(sketch);

$(function(){
  scrollTop();

  smart_phone_menu();

})

//-----Barbaカスタム-----

// 現在と同じページのリンクをクリックした場合、リロードをしない設定
// リロードしたい場合は削除
// var links = document.querySelectorAll('a[href]');
// var cbk = function(e) {
//   if(e.currentTarget.href === window.location.href) {
//     if(window.location.href.indexOf('#') == -1){ //基本ページ内リンクはリロードしないが、ページトップ遷移ができなくなるのでそれを除外
//       e.preventDefault();
//       e.stopPropagation();
//     }
//   }
// };
// for(var i = 0; i < links.length; i++) {
//   links[i].addEventListener('click', cbk);
// }

// // 新しいページが準備できたときにしたい処理
// Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {

//   if ( Barba.HistoryManager.history.length === 1 ) {  // ファーストビュー
//     return; // この時に更新は必要ないです
//   }

//   // メタデータをリフレッシュ
//   var head = document.head;
//   var newPageRawHead = newPageRawHTML.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0];
//   var newPageHead = document.createElement('head');
//   newPageHead.innerHTML = newPageRawHead;
//   var removeHeadTags = [
//     "meta[name='keywords']"
//     ,"meta[name='description']"
//     ,"meta[property^='fb']"
//     ,"meta[property^='og']"
//     ,"meta[name^='twitter']"
//     ,"meta[itemprop]"
//     ,"link[itemprop]"
//     ,"link[rel='prev']"
//     ,"link[rel='next']"
//     ,"link[rel='canonical']"
//   ].join(',');
//   var headTags = head.querySelectorAll(removeHeadTags)
//   for(var i = 0; i < headTags.length; i++ ){
//       head.removeChild(headTags[i]);
//   }
//   var newHeadTags = newPageHead.querySelectorAll(removeHeadTags)
//   for(var i = 0; i < newHeadTags.length; i++ ){
//       head.appendChild(newHeadTags[i]);
//   }
// }); // End Dispatcher


// // ページ遷移トランジション
// var FadeTransition = Barba.BaseTransition.extend({
//   start: function() {

//     // ローディングが終わるとすぐ古いページをフェードアウトさせて、新しいページをフェードイン
//     Promise
//       .all([this.newContainerLoading, this.fadeOut(3000)])
//       .then(this.fadeIn.bind(this));
//   },

//   fadeOut: function() { //古いコンテナを消す速さとか
//     return $(this.oldContainer).animate({ opacity: 0 }, { duration: 200, easing: 'swing', }).promise();
//   },

//   fadeIn: function() {

//     //------------遷移後のスクロール位置を補正する------------------
//     // ヘッダー追従かどうか
//     var headerFixed = false;
//     // URLに「#」が存在するか
//     if(location.hash){
//         var anchor = document.querySelector( location.hash );
//         if(anchor){
//             var rect = anchor.getBoundingClientRect();
//             var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//             if(headerFixed){
//                 var header = document.getElementById('header');
//                 if(header){
//                     top = top - header.clientHeight;
//                 }
//             }
//             var top = rect.top + scrollTop;
//             window.scrollTo(0,top);
//         }else{
//         // アンカー先が存在しなければページトップに
//             window.scrollTo(0,0);
//         }
//     }else{
//     // URLに「#」が存在しなければページトップに
//         window.scrollTo(0,0);
//     }
//     //----------------------------------------------

//     var _this = this;

//     // newContainerはnewContainerLoadingを解決した後に利用できる
//     var $el = $(this.newContainer);

//     // 古いコンテナ
//     $(this.oldContainer).hide();

//     // 新たに読み込まれるbarba-containerの初期設定
//     // visiblityはデフォルトhiddenなのでvisibleに変える
//     $el.css({
//       visibility : 'visible',
//       opacity : 0
//     });

//     $el.animate({ opacity: 1 }, 1000, function() {
//       // 遷移が終了したら.done()
//       // .done()は自動的にDOMから古いコンテナを削除する

//       _this.done();
//     });
//   }
// });

// // Barbaに作成した遷移処理を指定
// Barba.Pjax.getTransition = function() {
//   // if(!all_clear) return;

//   return FadeTransition;
// };

// // barbajsをON にする
// // PrefetchをON にする
// $().ready(function(){
//    Barba.Pjax.start();
//    Barba.Prefetch.init();
// });
// Barba.Pjax.originalPreventCheck = Barba.Pjax.preventCheck;
// Barba.Pjax.preventCheck = function(evt, element) {
//     if(element){

//         if (!element.getAttribute('href')) {
//             return false;
//         }
//         // 外部リンクはtarget="_blank"に
//         var site_url = location.protocol + '//' + location.host;
//         if (!element.href.startsWith(site_url)) {
//             element.setAttribute('target','_blank');
//             return false;
//         }
//         // アンカーリンクであり同一ページでなければbarbaを有効に
//         var url = location.protocol + '//' + location.host + location.pathname;
//         var extract_hash = element.href.replace(/#.*$/,"");
//         if (element.href.startsWith(location.protocol + '//' + location.host)) {
//             if (element.href.indexOf('#') > -1 && extract_hash != url ){
//                 return true;
//             }
//         }
//         // 拡張子が該当する場合はtarget="_blank"に
//         if (/\.(xlsx?|docx?|pptx?|pdf|jpe?g|png|gif|svg)/.test(element.href.toLowerCase())) {
//             element.setAttribute('target','_blank');
//             return false;
//         }
//         // 該当クラスに属していればBarbaを無効に
//         var ignoreClasses = ['ab-item','custom-no-barba'];
//         for (var i = 0; i < ignoreClasses.length; i++) {
//             if (element.classList.contains(ignoreClasses[i])) {
//                 return false;
//             }
//         }
//         if (!Barba.Pjax.originalPreventCheck(evt, element)) {
//             return false;
//         }
//         return true;
//     }
// };
