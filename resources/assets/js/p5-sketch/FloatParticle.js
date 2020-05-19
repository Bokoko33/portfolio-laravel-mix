export default class FloatParticle{
    constructor(){
        if(!in_works && !in_works){ //top画面リロードでの生成なら
            this.pos = p5.createVector(Math.random(width),Math.random(height));
            this.vel = p5.createVector(Math.random(-1,1),Math.random(-1,1));
            this.vel.normalize();
            this.vel.mult(100);
            this.fric = 0.9;
            this.r = Math.random(3,10);
        }
        else{ //そうでなければとりあえずどこかに
            this.pos = p5.createVector(9999,9999);
            this.vel = p5.createVector(0,0);
            this.vel.normalize();
            this.vel.mult(100);
            this.fric = 0.9;
            this.r = Math.random(3,10);
        }
        

        // this.out = false; //画面外か
    }

    update(){
        //カーソルが近づくと反発
        if(dist(mouseX,mouseY,this.pos.x,this.pos.y)<50){
            var mouseVec = p5.createVector(mouseX,mouseY);
            var force = p5.Vector.sub(this.pos,mouseVec);
            force.normalize();
            force.mult(2);

            this.vel.add(force);
        }

        this.pos.add(this.vel);

        //topページでは画面外へ出たら反対側から出てくる
        if(!in_works &&  !in_about){
            if(this.pos.x < 0 || this.pos.x > width){
                var x = width - this.pos.x;
    
                this.pos.set(x,this.pos.y);
            }
            if(this.pos.y < 0 || this.pos.y > height){
                var y = height - this.pos.y;
    
                this.pos.set(this.pos.x,y);
            }

            //摩擦で停止
            this.vel.mult(this.fric);
        }
        //work,aboutでは画面外にでたら停止（無駄な計算の抑止？）
        else{
            if(this.pos.x < -200 || this.pos.x > width+200 || this.pos.y < -200 || this.pos.y > height+200){
                this.vel.set(0,0);
            }
        }
    }

    draw(){
        fill(0,20);
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }
}