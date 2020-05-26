import {posNum,interval} from './sketch'

export default class DrawParticle{
    constructor(_p5,_x,_y){
        this.p = _p5;
        this.pos = this.p.createVector(_x*10,_y*10);
        this.afterPosX = new Array();
        this.afterPosY = new Array();
        
        for(let i=0;i<posNum;i++){
            this.afterPosX[i] = this.pos.x;
            this.afterPosY[i] = this.pos.y;
        }

        this.fpos = this.p.createVector(this.pos.x*100,this.pos.y*100);
        //初速に少しばらつきを持たせる
        this.vel = this.p.createVector(_x,_y);
        this.vel.rotate(this.p.random(-1*this.p.PI/10,this.p.PI/10));

        this.fric = 0.9895;
        this.noiseArg = this.p.random(100); //ノイズの引数に使う

        this.offset = 160;
        this.delta = 0.06; //パーティクルの移動量
    }
    
    update(){
        //pattern1
        // 範囲内でランダム(noise)に動き回る計算
        let xmin = this.offset - (this.fpos.x - this.pos.x);
        let xmax = 2*this.offset - xmin;

        let ymin = this.offset - (this.fpos.y - this.pos.y);
        let ymax = 2*this.offset - ymin;

        let x = this.p.map(this.p.noise(this.noiseArg),0,1,-xmin,xmax);
        let y = this.p.map(this.p.noise(this.noiseArg),0,1,-ymin,ymax);

        let v = this.p.createVector(x,y);
        this.vel.add(v);
        // this.vel.set(x,y);
        this.vel.mult(this.delta);


        this.pos.add(this.vel);

        this.afterPosX.unshift(this.pos.x);
        this.afterPosY.unshift(this.pos.y);

        if(this.afterPosX.length>posNum*interval){
            this.afterPosX.pop(this.pos.x);
            this.afterPosY.pop(this.pos.y);
        }
        
        //摩擦
        // this.vel.mult(this.fric);
       
        this.noiseArg += 0.005;
    }
}