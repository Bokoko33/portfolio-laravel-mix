// import p5 from 'p5'
import FloatParticle from './FloatParticle'
import DrawParticle from './DrawParticle'

import $ from 'jquery'

//メインビジュアル関連
const vertexNum = 9; //頂点数
const invertNum = 3; //反転回数
let dp = new Array();
let angle ;
let canvas;
let count = 0;
let centerX; //X座標の中心
let endDraw = false;  //描画終了
const posNum = 4; //残像の数（4がちょうど良いかなあ）
const interval = 10; //残像の間隔（フレーム）


//漂流物関連
const fpNum = 30;
let fp = new Array();
let in_works = false; //ワークページかどうか
let in_about = false; //about..
const lineNum = 2; //一つに対して何個近くのやつと繋げるか

export function sketch (p5){
    function drawInit(){
        angle = p5.TWO_PI / vertexNum;
        for(let i=0;i<vertexNum;i++){
            let fvel = new p5.createVector(1,0);
            fvel.rotate(angle*i);
            fvel.mult(0.12);
    
            let _dp = new DrawParticle(p5,fvel.x,fvel.y);
            dp.push(_dp);
        }
    }
    
    function floatInit(){
        for(let i=0;i<fpNum;i++){
            let _fp = new FloatParticle(p5);
            fp.push(_fp);
        }
    }
    p5.windowResized = () =>{
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(250,250,250);
    }
    p5.setup = () =>{
        canvas = p5.createCanvas(p5.windowWidth,p5.windowHeight);
        canvas.parent('p5canvas');
        p5.background(250,250,250);
        centerX = p5.width/2;
        drawInit();
        $('#defaultCanvas0').fadeIn(2000);
    }

    p5.draw = () =>{
        //ページごとに表示非表示の処理
        let url = location.href;
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
        //workに行く時に散る
        $('.menu #work,.menu #about,.menu #contact').on('click',function(){
            for(let i=0;i<fp.length;i++){
                let centerVec = p5.createVector(p5.width/2,p5.height/2);
                let newVel = p5.Vector.p5.sub(fp[i].pos,centerVec);
                
                newVel.normalize();
                newVel.mult(100);
                fp[i].vel.set(newVel.x,newVel.y);
            }
        });
        //topに行く時再生成
        $('#I,.menu #top').on('click',function(){
            for(let i=0;i<fp.length;i++){
                fp[i].pos = p5.createVector(p5.random(p5.width),p5.random(p5.height));
                fp[i].vel = p5.createVector(p5.random(-1,1),p5.random(-1,1));
                fp[i].vel.normalize();
                fp[i].vel.mult(100);
            }
        });

        //背景に関する処理
        if(in_works || p5.windowWidth<480){ //スマホでは残像なし
            p5.background(250,18);

        }
        else{
            
            let alph = p5.dist(centerX,p5.height/2,p5.mouseX,p5.mouseY);
            if(alph>150) alph = 18;
            else alph = 0;
            p5.background(250,alph);
        
        }

        //漂流物
        if(!in_works && !in_about){
            for(let i=0;i<fp.length;i++){
                fp[i].update();
                fp[i].draw();
            
    
                //近いやつをつなぐ
                p5.stroke(0,20);
                p5.noFill();
                let lastDist = 0; //前回決定した距離を保管
                for(let j=0;j<lineNum;j++){
                    let minId = 0;
                    let minDist = 9999;
                    for(let k=0;k<fp.length;k++){
                        let len = p5.dist(fp[i].pos.x,fp[i].pos.y,fp[k].pos.x,fp[k].pos.y);
                        if(j!=k && len<minDist && len>lastDist){
                            minDist = len;
                            minId = k;
                        }
                    }
                    lastDist = minDist;
                    p5.line(fp[i].pos.x,fp[i].pos.y,fp[minId].pos.x,fp[minId].pos.y);   
                }
            }
        }
        

        //メインビジュアル
        if(in_works) p5.stroke(250,40);
        else p5.stroke(0,40);
        p5.strokeWeight(0.5);
        p5.noFill();

        for(let i=0;i<dp.length;i++){
            dp[i].update();
        }
        
        // 反転回数分描画
        if(p5.windowWidth>480){
            p5.push();
            p5.translate(centerX,p5.height/2);
            for(let i=0;i<invertNum;i++){

                p5.beginShape();

                p5.curveVertex(dp[dp.length-1].pos.x,dp[dp.length-1].pos.y);
                for(let k=0;k<dp.length;k++){
                    p5.curveVertex(dp[k].pos.x, dp[k].pos.y);
                }
                p5.curveVertex(dp[0].pos.x, dp[0].pos.y);
                p5.curveVertex(dp[1].pos.x, dp[1].pos.y);

                p5.endShape();


                //残像分の処理
                for(let a=0;a<posNum*interval;a+=interval){
                    p5.beginShape();

                    p5.curveVertex(dp[dp.length-1].afterPosX[a],dp[dp.length-1].afterPosY[a]);
                    for(let b=0;b<dp.length;b++){
                        p5.curveVertex(dp[b].afterPosX[a], dp[b].afterPosY[a]);
                    }
                    p5.curveVertex(dp[0].afterPosX[a], dp[0].afterPosY[a]);
                    p5.curveVertex(dp[1].afterPosX[a], dp[1].afterPosY[a]);

                    p5.endShape();
                }

                p5.rotate(2*p5.PI / invertNum);
            }

            p5.pop();
        }
        

        count ++ ;

        //横にずらす
        if(count>160){
            centerX += (2.8*p5.windowWidth/4 - centerX)*0.05;
        }

        //コンテンツ表示
        if(count>220 && !endDraw){
            endDraw = true;
            $('.top__contents--laterP5').fadeIn(2000);
            floatInit();
        }
        if(p5.windowWidth<480 && !endDraw){ //スマホならアニメーション飛ばす
            endDraw = true;
            $('.top__contents--laterP5').fadeIn(2000);
            floatInit();
        }
    }
}
