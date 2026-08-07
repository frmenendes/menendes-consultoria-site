"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Galáxia em WebGL.
 *
 * Por que shader escrito à mão e não uma biblioteca: three.js, Vanta e
 * tsparticles são abstrações sobre exatamente isto, e custam de 100KB a 150KB
 * comprimidos. O site é estático, otimizado para tempo de resposta, e Core Web
 * Vitals é sinal de ranqueamento — carregar 150KB de JavaScript para desenhar
 * um fundo decorativo trabalharia contra o objetivo de aparecer na busca. Aqui
 * são poucos KB, e o trabalho todo acontece na GPU: um quad de tela cheia e um
 * fragment shader. A CPU não participa de nenhum frame.
 *
 * Camada de enriquecimento, nunca de conteúdo. Falha sempre para o estado
 * visível: sem WebGL, com `prefers-reduced-motion`, ou se a criação do contexto
 * falhar, o componente simplesmente não desenha nada e o campo de estrelas em
 * CSS que vive abaixo continua lá. Nenhum caminho de falha esconde texto.
 *
 * Economia deliberada:
 *  - só anima enquanto está de fato na viewport (IntersectionObserver) e com a
 *    aba visível. Rolou para longe, o laço para;
 *  - `devicePixelRatio` limitado a 1.5. Em tela 3x, a diferença é invisível num
 *    fundo difuso e o custo de preenchimento triplica;
 *  - `powerPreference: "low-power"`, porque em máquina com duas GPUs não há
 *    razão para acordar a dedicada por causa de um fundo;
 *  - `alpha: true` e nada de limpar para opaco: a camada compõe sobre o fundo
 *    do site, e não o substitui.
 */

const VERTEX = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

/**
 * O fragment shader.
 *
 * A construção, em ordem: ruído fractal (fbm) para as nuvens de nebulosa, um
 * espiral logarítmico para os braços, e três camadas de estrelas em
 * profundidades diferentes, cada uma derivando em velocidade própria — é a
 * diferença de velocidade entre camadas que produz a sensação de distância.
 *
 * A atenuação nas bordas é parte do desenho, não acabamento: uma camada de tela
 * cheia que termina na borda desenha exatamente a linha reta que o resto deste
 * fundo existe para evitar.
 */
const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;

out vec4 fragColor;

/* Paleta da marca, em linear. Convertida à mão porque o shader compõe em
   linear e o navegador aplica o gamma na saída. */
const vec3 PRIMARY = vec3(0.043, 0.181, 1.000);
const vec3 ACCENT  = vec3(0.386, 0.271, 0.960);
const vec3 NEBULA  = vec3(0.596, 0.463, 0.925);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

/* Ruído fractal: cinco oitavas bastam. Acima disso o detalhe cai abaixo de um
   pixel e só custa preenchimento. */
float fbm(vec2 p) {
  float total = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    total += noise(p) * amplitude;
    p *= 2.03;
    amplitude *= 0.5;
  }
  return total;
}

/* Uma camada de estrelas. A célula do grid decide se há estrela e onde, então
   a distribuição é estável e não cintila ao mover. */
float stars(vec2 uv, float density, float drift, float seed) {
  vec2 p = uv * density + vec2(uTime * drift, uTime * drift * 0.35) + seed;
  vec2 cell = floor(p);
  vec2 local = fract(p) - 0.5;

  float presence = hash(cell + seed);
  if (presence < 0.978) return 0.0;

  vec2 offset = vec2(hash(cell + 1.7), hash(cell + 4.3)) - 0.5;
  float dist = length(local - offset * 0.6);
  float core = smoothstep(0.055, 0.0, dist);

  /* Cintilação: período próprio por estrela, e nunca até apagar de todo. */
  float phase = hash(cell + 9.1) * 6.2831;
  float twinkle = 0.65 + 0.35 * sin(uTime * (0.5 + hash(cell + 2.2)) + phase);

  return core * twinkle;
}

void main() {
  /* Coordenada centrada e corrigida por aspecto: sem isso a galáxia vira uma
     elipse achatada em tela larga. */
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

  float t = uTime * 0.02;

  /* --- núcleo e braços ------------------------------------------------- */
  /* O centro fica fora da tela, no canto superior direito: uma galáxia
     centralizada puxaria o olho para o meio da página, onde vive o texto. */
  vec2 center = vec2(0.62, 0.34);
  vec2 g = uv - center;

  float radius = length(g);
  float angle = atan(g.y, g.x);

  /* Espiral logarítmico. O termo em log(radius) é o que curva os braços; sem
     ele saem raios retos, que leem como estrela do mar, não como galáxia. */
  float spiral = sin(2.0 * (angle + log(radius + 0.08) * 2.4) + t * 2.0);
  float arms = smoothstep(0.1, 1.0, spiral) * exp(-radius * 2.1);

  /* Halo do núcleo, sem estourar: o clamp evita o ponto branco no centro. */
  float core = exp(-radius * 5.5) * 0.55;

  /* --- nuvens ----------------------------------------------------------- */
  vec2 flow = vec2(t * 0.6, -t * 0.35);
  float clouds = fbm(uv * 2.6 + flow);
  clouds = smoothstep(0.42, 0.95, clouds);

  /* --- composição ------------------------------------------------------- */
  vec3 color = vec3(0.0);
  color += NEBULA * arms * 0.30;
  color += ACCENT * core;
  color += PRIMARY * clouds * 0.12;
  color += mix(PRIMARY, NEBULA, clouds) * clouds * arms * 0.35;

  /* Três profundidades. A mais distante é mais densa e mais lenta. */
  float far  = stars(uv, 26.0, 0.0016, 0.0);
  float mid  = stars(uv, 20.0, 0.0042, 17.0);
  float near = stars(uv,  9.0, 0.0090, 41.0);

  color += vec3(0.62, 0.68, 0.85) * far * 0.22;
  color += vec3(0.80, 0.84, 0.95) * mid * 0.32;
  color += vec3(1.00, 0.98, 0.95) * near * 0.45;

  /* --- atenuação nas bordas -------------------------------------------- */
  /* Sem isto a camada termina na borda da tela e desenha uma linha reta, que é
     exatamente o defeito que este fundo existe para não ter. O raio da máscara
     cabe dentro do quadro, então ela chega a zero antes da borda. */
  vec2 fromCenter = (gl_FragCoord.xy / uResolution) - 0.5;
  float vignette = 1.0 - smoothstep(0.28, 0.72, length(fromCenter));

  /* E some de vez no rodapé da camada, para a passagem ser luz virando escuro
     e nunca um corte. */
  float bottom = smoothstep(0.0, 0.30, gl_FragCoord.y / uResolution.y);

  float mask = vignette * bottom;

  /* Alfa vem do próprio brilho: onde não há galáxia, a camada é transparente e
     o fundo do site aparece intacto. */
  float alpha = clamp(max(max(color.r, color.g), color.b), 0.0, 1.0) * mask;
  fragColor = vec4(color * mask, alpha);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // Silencioso em produção: um fundo que não compila não é motivo para poluir
    // o console de quem visita o site. O modo de falha já é o correto — a
    // camada não desenha e o starfield em CSS continua no lugar.
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function GalaxyField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      // O navegador pode descartar o contexto para poupar memória. Sem isto,
      // ele avisa no console a cada montagem.
      failIfMajorPerformanceCaveat: true,
    });
    if (!gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // Dois triângulos cobrindo o clip space inteiro.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");

    // Composição sobre o que já está na página, em vez de substituir.
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let frame = 0;
    let visible = false;
    let running = false;
    // O relógio do shader é acumulado, não `performance.now()`: pausar e
    // retomar não pode fazer a galáxia saltar meio giro à frente.
    let clock = 0;
    let last = 0;

    const resize = () => {
      // Fator de escala limitado: num monitor 3x o custo de preenchimento
      // triplicaria para um ganho invisível num fundo difuso.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);
      if (width === canvas.width && height === canvas.height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const render = (now: number) => {
      // Delta limitado: voltando de uma aba em segundo plano, `now` pulou
      // segundos, e sem o teto a galáxia daria um solavanco.
      clock += Math.min((now - last) / 1000, 0.05);
      last = now;

      resize();
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, clock);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(render);
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(render);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
    };

    // Fora da viewport não há nada para desenhar, e uma aba em segundo plano
    // não deve gastar GPU.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "120px" },
    );
    observer.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      // Libera o contexto na hora, em vez de esperar o coletor: o navegador
      // limita quantos contextos WebGL existem ao mesmo tempo, e navegar entre
      // páginas montaria vários antes de qualquer coleta.
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      // O canvas nasce transparente e só ganha conteúdo depois que o contexto
      // sobe. Sem WebGL ele fica transparente para sempre, que é o estado certo.
    />
  );
}
