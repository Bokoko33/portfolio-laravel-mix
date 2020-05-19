export default class DrawParticle{
    constructor(_x,_y){
      this.pos = p5.createVector(_x*10,_y*10);
      this.afterPosX = new Array();
      this.afterPosY = new Array();
      
      for(var i=0;i<posNum;i++){
          this.afterPosX[i] = this.pos.x;
          this.afterPosY[i] = this.pos.y;
      }

      this.fpos = p5.createVector(this.pos.x*100,this.pos.y*100);
      //初速に少しばらつきを持たせる
      this.vel = p5.createVector(_x,_y);
    //   this.vel.mult(Math.random(1));
      this.vel.rotate(Math.random(-PI/10,PI/10));

      this.fric = 0.9895;
      this.noiseArg = Math.random(100); //ノイズの引数に使う

      this.offset = 160;
      this.delta = 0.06; //パーティクルの移動量
    }
    
    update(){
        //pattern1
        // 範囲内でランダム(noise)に動き回る計算
        var xmin = this.offset - (this.fpos.x - this.pos.x);
        var xmax = 2*this.offset - xmin;

        var ymin = this.offset - (this.fpos.y - this.pos.y);
        var ymax = 2*this.offset - ymin;

        var x = map(noise(this.noiseArg),0,1,-xmin,xmax);
        var y = map(noise(this.noiseArg),0,1,-ymin,ymax);

        var v = p5.createVector(x,y);
        this.vel.add(v);
        // this.vel.set(x,y);
        this.vel.mult(this.delta);

        //pattern2
        //速度ベクトルをランダムに少しづつ回転
        // var rot = map(noise(this.noiseArg)*this.delta*2 - this.delta,-this.delta,this.delta,-0.015*PI,0.015*PI);
        // this.vel.rotate(rot);


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