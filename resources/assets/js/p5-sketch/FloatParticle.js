import {in_works,in_about} from './sketch'

export default class FloatParticle{
    constructor(_p5){
        this.p = _p5;
        if(!in_works && !in_about){ //top画面リロードでの生成なら
            this.pos = this.p.createVector(this.p.random(this.p.width),this.p.random(this.p.height));
            this.vel = this.p.createVector(this.p.random(-1,1),this.p.random(-1,1));
            this.vel.normalize();
            this.vel.mult(100);
            this.fric = 0.9;
            this.r = this.p.random(3,10);
        }
        else{ //そうでなければとりあえずどこかに
            this.pos = this.p.createVector(9999,9999);
            this.vel = this.p.createVector(0,0);
            this.vel.normalize();
            this.vel.mult(100);
            this.fric = 0.9;
            this.r = this.p.random(3,10);
        }
    }

    update(){
        //カーソルが近づくと反発
        if(this.p.dist(this.p.mouseX,this.p.mouseY,this.pos.x,this.pos.y)<50){
            var mouseVec = this.p.createVector(this.p.mouseX,this.p.mouseY);
            var force = p5.Vector.sub(this.pos,mouseVec);
            force.normalize();
            force.mult(2);

            this.vel.add(force);
        }

        this.pos.add(this.vel);

        //topページでは画面外へ出たら反対側から出てくる
        if(!in_works &&  !in_about){
            if(this.pos.x < 0 || this.pos.x > this.p.width){
                var x = this.p.width - this.pos.x;
    
                this.pos.set(x,this.pos.y);
            }
            if(this.pos.y < 0 || this.pos.y > this.p.height){
                var y = this.p.height - this.pos.y;
    
                this.pos.set(this.pos.x,y);
            }
            
            //摩擦で停止
            this.vel.mult(this.fric);
        }
        //work,aboutでは画面外にでたら停止（無駄な計算の抑止？）
        else{
            if(this.pos.x < -200 || this.pos.x > this.p.width+200 || this.pos.y < -200 || this.pos.y > this.p.height+200){
                this.vel.set(0,0);
                
            }
            
        }
    }

    draw(){
        this.p.fill(0,20);
        this.p.noStroke();
        this.p.ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }
}