// import Sample from './sample'

import $ from 'jQuery';
import {scrollTop} from './scroll-top'; //{}必須らしい
import {sketch} from './p5-sketch/sketch'


// window.$ = window.jQuery = require('jquery');

// const sample = new Sample({
//   elements: [ ...document.querySelectorAll('.js-target') ],
//   classNameActive: 'is-active'
// })

// setTimeout(() => {
//   sample.activate()
// }, 500)

new p5(sketch);

$(function(){
  scrollTop();
})
