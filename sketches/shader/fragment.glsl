uniform float time;
uniform float progress;
uniform float playhead;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;




void main()	{
  vec3 color1 = vec3(0.531, 0.800, 0.742);
  vec3 color2 = vec3(0.198, 0.256, 0.606);
  float pi = 3.1414926;
  float fline = sin(vUv.y*6.*pi);

  float threshold = 0.05;

  float fline_a = abs(fline);

  float k = 0.;
  float sk = 0.;
  if (fline < 0.) {
    k = -1.;
  } else {
    k = 1.;
  };

  if (fline_a < threshold) {
    sk = (threshold - fline_a) / threshold;
    k = k*(1. - sk) + fline_a * sk;
  }

  k = (k + 1.) / 2.;

  float fog = 1. - clamp( (vPosition.z - 2. - playhead * 6.)/20., 0., 1.);
  vec3 finalColor = mix(color1, color2, k);
	finalColor = mix(vec3(0.), finalColor, fog);
	gl_FragColor = vec4(finalColor,1.);
}