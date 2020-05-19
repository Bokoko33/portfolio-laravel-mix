import p5 from 'p5'
import 'node_modules/p5/lib/p5.min.js'
import FloatParticle from './FloatParticle'
import DrawParticle from './DrawParticle'

import $ from 'jquery'

//メインビジュアル関連
var vertexNum = 9; //頂点数
var invertNum = 3; //反転回数
var dp = new Array();
var angle ;
var canvas;
var count = 0;
var centerX; //X座標の中心
var endDraw = false;  //描画終了
var posNum = 4; //残像の数　4がちょうど良いかなあ
var interval = 10; //残像の間隔（フレーム）


//漂流物関連
var fpNum = 30;
var fp = new Array();
var in_works = false; //ワークページかどうか
var in_about = false; //about..
var lineNum = 2; //一つに対して何個近くのやつと繋げるか

// var all_clear = false; //全てのfpが除外された


var bgImage;
// var clickCount = 0;



export function sketch (p5){
    function drawInit(){
        angle = Math.TWO_PI / vertexNum;
        for(var i=0;i<vertexNum;i++){
            var fvel = new p5.createVector(1,0);
            fvel.rotate(angle*i);
            fvel.mult(0.12);
    
            var _dp = new DrawParticle(fvel.x,fvel.y);
            dp.push(_dp);
        }
        // fill(255,10);
        // noStroke();
        // rect(0, 0, p5.windowWidth, p5.windowHeight);
    }
    
    function floatInit(){
        for(var i=0;i<fpNum;i++){
            var _fp = new FloatParticle();
            fp.push(_fp);
        }
    }
    p5.windowResized = () =>{
        resizeCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(250,250,250);
    }
    p5.setup = () =>{
        canvas = createCanvas(p5.windowWidth,p5.windowHeight);
        canvas.parent('p5canvas');
        p5.background(250,250,250);
        centerX = p5.width/2;
        drawInit();
        $('#defaultCanvas0').fadeIn(2000);
    }

    p5.draw = () =>{
        //workに行く時に散る
        $('.menu #work,.menu #about,.menu #contact').on('click',function(){
            for(var i=0;i<fp.length;i++){
                var centerVec = p5.createVector(p5.width/2,p5.height/2);
                var newVel = p5.Vector.sub(fp[i].pos,centerVec);
                // var newVel = p5.createVector(Math.random(-1,1),Math.random(-1,1));
                newVel.normalize();
                newVel.mult(100);
                fp[i].vel.set(newVel.x,newVel.y);
            }
        });
        //topに行く時再生成
        $('#I,.menu #top').on('click',function(){
            for(var i=0;i<fp.length;i++){
                fp[i].pos = p5.createVector(Math.random(p5.width),Math.random(p5.height));
                fp[i].vel = p5.createVector(Math.random(-1,1),Math.random(-1,1));
                fp[i].vel.normalize();
                fp[i].vel.mult(100);
            }
        });

        //背景に関する処理
        if(in_works || p5.windowWidth<480){ //スマホでは残像なし
            p5.background(250,18);

        }
        else{
            
            var a = dist(centerX,p5.height/2,p5.mouseX,p5.mouseY);
            if(a>150) a = 18;
            else a = 0;
            p5.background(250,a);
        
        }

        //漂流物
        var clearFlag = true;
        for(var i=0;i<fp.length;i++){
            fp[i].update();
            fp[i].draw();
        

            //近いやつをつなぐ
            p5.stroke(0,20);
            p5.noFill();
            var lastDist = 0; //前回決定した距離を保管
            for(var j=0;j<lineNum;j++){
                var minId = 0;
                var minDist = 9999;
                for(var k=0;k<fp.length;k++){
                    var len = p5.Vector.dist(fp[i].pos,fp[k].pos);
                    if(j!=k && len<minDist && len>lastDist){
                        minDist = len;
                        minId = k;
                    }
                }
                lastDist = minDist;
                line(fp[i].pos.x,fp[i].pos.y,fp[minId].pos.x,fp[minId].pos.y);   
            }
        }

        //メインビジュアル
        if(in_works) stroke(250,40);
        else p5.stroke(0,40);
        p5.strokeWeight(0.5);
        p5.noFill();

        for(var i=0;i<dp.length;i++){
            dp[i].update();
        }
        
        // 反転回数分描画
        if(p5.windowWidth>480){
            push();
            translate(centerX,p5.height/2);
            for(var i=0;i<invertNum;i++){

                p5.beginShape();

                p5.curveVertex(dp[dp.length-1].pos.x,dp[dp.length-1].pos.y);
                for(var k=0;k<dp.length;k++){
                    p5.curveVertex(dp[k].pos.x, dp[k].pos.y);
                }
                p5.curveVertex(dp[0].pos.x, dp[0].pos.y);
                p5.curveVertex(dp[1].pos.x, dp[1].pos.y);

                p5.endShape();


                //残像分の処理
                for(var a=0;a<posNum*interval;a+=interval){
                    p5.beginShape();

                    p5.curveVertex(dp[dp.length-1].afterPosX[a],dp[dp.length-1].afterPosY[a]);
                    for(var b=0;b<dp.length;b++){
                        p5.curveVertex(dp[b].afterPosX[a], dp[b].afterPosY[a]);
                    }
                    p5.curveVertex(dp[0].afterPosX[a], dp[0].afterPosY[a]);
                    p5.p5.curveVertex(dp[1].afterPosX[a], dp[1].afterPosY[a]);

                    p5.endShape();
                }

                rotate(2*Math.PI / invertNum);
            }

            pop();
        }
        

        count ++ ;

        //横にずらす
        if(count>160){
            centerX += (2.8*p5.windowWidth/4 - centerX)*0.05;
        }
        //ページごとに表示非表示の処理
        var url = location.href;
        if(url.indexOf('work') != -1){
            in_works = true;
        }
        else{
            in_works = false;
        }
        if(url.indexOf('about') != -1){
            in_about = true;
        }
        else{
            in_about = false;
        }

        //コンテンツ表示
        if(count>220 && !endDraw){
            endDraw = true;
            $('.contents').fadeIn(2000);
            floatInit();
        }
        if(p5.windowWidth<480 && !endDraw){ //スマホならアニメーション飛ばす
            endDraw = true;
            $('.contents').fadeIn(2000);
            floatInit();
        }
    }
}
