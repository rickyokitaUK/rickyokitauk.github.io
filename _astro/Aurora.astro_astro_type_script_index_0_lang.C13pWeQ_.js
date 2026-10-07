const w=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`,E=`#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uLightMode;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \\
  int index = 0;                                            \\
  for (int i = 0; i < 2; i++) {                               \\
     ColorStop currentColor = colors[i];                    \\
     bool isInBetween = currentColor.position <= factor;    \\
     index = int(mix(float(index), float(i), float(isInBetween))); \\
  }                                                         \\
  ColorStop currentColor = colors[index];                   \\
  ColorStop nextColor = colors[index + 1];                  \\
  float range = nextColor.position - currentColor.position; \\
  float lerpFactor = (factor - currentColor.position) / range; \\
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \\
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;

  if (uLightMode > 0.5) {
    // Translucent tint (premultiplied) so the light page and its particles stay visible.
    float energy = clamp(max(intensity, 0.0), 0.0, 1.0);
    float coverage = clamp(auroraAlpha * (0.55 + 0.45 * energy), 0.0, 0.86) * 0.45;
    vec3 chroma = pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 0.0001);
    fragColor = vec4(chroma * coverage, coverage);
  } else {
    fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
  }
}`,L=e=>{const t=parseInt(e.replace("#",""),16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]};function f(e,t,o){const r=e.createShader(t);if(e.shaderSource(r,o),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw new Error(e.getShaderInfoLog(r)||"shader");return r}function F(e){const t=document.createElement("canvas"),o=t.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1});if(!o)return;let r;try{if(r=o.createProgram(),o.attachShader(r,f(o,o.VERTEX_SHADER,w)),o.attachShader(r,f(o,o.FRAGMENT_SHADER,E)),o.linkProgram(r),!o.getProgramParameter(r,o.LINK_STATUS))throw new Error(o.getProgramInfoLog(r)||"link")}catch(a){console.warn("Aurora disabled:",a);return}const v=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,v),o.bufferData(o.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),o.STATIC_DRAW);const s=o.getAttribLocation(r,"position");o.enableVertexAttribArray(s),o.vertexAttribPointer(s,2,o.FLOAT,!1,0,0),o.useProgram(r),o.clearColor(0,0,0,0),o.enable(o.BLEND),o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA);const i=a=>o.getUniformLocation(r,a),g=i("uTime"),C=i("uResolution"),A=i("uLightMode");o.uniform1f(i("uAmplitude"),Number(e.dataset.amplitude)||1),o.uniform1f(i("uBlend"),Number(e.dataset.blend)||.5),o.uniform3fv(i("uColorStops"),new Float32Array((e.dataset.stops||"").split(",").flatMap(L)));const S=Number(e.dataset.speed)||1;e.classList.remove("hero-aurora"),e.appendChild(t);const y=.5,u=()=>{const a=y;t.width=Math.max(1,Math.round(e.clientWidth*a)),t.height=Math.max(1,Math.round(e.clientHeight*a)),o.viewport(0,0,t.width,t.height),o.uniform2f(C,t.width,t.height)};addEventListener("resize",u),u();const b=()=>document.documentElement.classList.contains("dark"),l=matchMedia("(prefers-reduced-motion: reduce)");let n=0;const m=a=>{o.uniform1f(g,a*.001*S),o.uniform1f(A,b()?0:1),o.clear(o.COLOR_BUFFER_BIT),o.drawArrays(o.TRIANGLES,0,3)},R=1e3/30;let d=-1/0;const h=a=>{a-d>=R-2&&(d=a,m(a)),n=requestAnimationFrame(h)},c=()=>{cancelAnimationFrame(n),l.matches?m(12e3):document.hidden||(n=requestAnimationFrame(h))};document.addEventListener("visibilitychange",()=>document.hidden?cancelAnimationFrame(n):c()),l.addEventListener("change",c),new MutationObserver(()=>l.matches&&c()).observe(document.documentElement,{attributes:!0,attributeFilter:["class"]}),c(),t.getBoundingClientRect(),t.classList.add("is-visible")}const p=()=>document.querySelectorAll("[data-aurora]").forEach(F),x=()=>"requestIdleCallback"in window?requestIdleCallback(p,{timeout:2e3}):setTimeout(p,300);document.readyState==="complete"?x():addEventListener("load",x,{once:!0});
