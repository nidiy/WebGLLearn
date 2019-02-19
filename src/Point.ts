export class Point
{
  public x:number=0;
  public y:number=0;
  constructor(x:number=0,y:number=0){
    this.x=x;
    this.y=y;
  }
  public add(p:Point):this
  {
    this.x+=p.x;
    this.y+=p.y;
    return this
  }
  public sub(p:Point):this
  {
    this.x-=p.x;
    this.y-=p.y;
    return this;
  }
}
