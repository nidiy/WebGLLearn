attribute vec4 a_Position;
//物体表面色
attribute vec4 a_Color;
//法向量
attribute vec4 a_Normal;
uniform mat4 u_mvpMatrix;
//光线颜色
uniform vec3 u_LightColor;
//归一化的世界坐标（灯光向量）
uniform vec3 u_LightDirection;
varying vec4 v_Color;
void main(){
  gl_Position=u_mvpMatrix*a_Position;
  //对向量进行归一化
  vec3 normal=normalize(vec3(a_Normal));
  //计算光线方向和法向量的点积(dot点积函数)
  float nDotl=max(dot(u_LightDirection,normal),0.0);
  //计算漫反射的颜色
  vec3 diffuse=u_LightColor*vec3(a_Color)*nDotl;
  v_Color=vec4(diffuse,a_Color.a);
}
