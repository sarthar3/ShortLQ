import { useEffect, useRef } from 'react';

const WaterRipple = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported, water ripples disabled.');
      return;
    }

    // Load necessary extensions for floating point textures
    const extensions = {};
    ['OES_texture_float', 'OES_texture_half_float', 'OES_texture_float_linear', 'OES_texture_half_float_linear'].forEach(ext => {
      const e = gl.getExtension(ext);
      if (e) extensions[ext] = e;
    });

    if (!extensions.OES_texture_float) {
      console.warn('OES_texture_float not supported, water ripples disabled.');
      return;
    }

    const textureType = extensions.OES_texture_half_float 
      ? extensions.OES_texture_half_float.HALF_FLOAT_OES 
      : gl.FLOAT;

    const resolution = 512; // Increased for better quality
    const dropRadius = 35; // Larger ripples
    const perturbance = 0.025; // More visible distortion

    // Compile Program Helper
    const createProgram = (vertexSource, fragmentSource) => {
      const compileSource = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          throw new Error('Compile error: ' + gl.getShaderInfoLog(shader));
        }
        return shader;
      };

      const id = gl.createProgram();
      gl.attachShader(id, compileSource(gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(id, compileSource(gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(id);
      if (!gl.getProgramParameter(id, gl.LINK_STATUS)) {
        throw new Error('Link error: ' + gl.getProgramInfoLog(id));
      }

      const locations = {};
      gl.useProgram(id);
      const regex = /uniform (\w+) (\w+)/g;
      const shaderCode = vertexSource + fragmentSource;
      let match;
      while ((match = regex.exec(shaderCode)) !== null) {
        const name = match[2];
        locations[name] = gl.getUniformLocation(id, name);
      }
      return { id, locations };
    };

    const bindTexture = (tex, unit = 0) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
    };

    // Shaders
    const vertexShader = `
      attribute vec2 vertex;
      varying vec2 coord;
      void main() {
        coord = vertex * 0.5 + 0.5;
        gl_Position = vec4(vertex, 0.0, 1.0);
      }
    `;

    const dropShader = `
      precision highp float;
      const float PI = 3.141592653589793;
      uniform sampler2D texture;
      uniform vec2 center;
      uniform float radius;
      uniform float strength;
      varying vec2 coord;
      void main() {
        vec4 info = texture2D(texture, coord);
        float drop = max(0.0, 1.0 - length(center * 0.5 + 0.5 - coord) / radius);
        drop = 0.5 - cos(drop * PI) * 0.5;
        info.r += drop * strength;
        gl_FragColor = info;
      }
    `;

    const updateShader = `
      precision highp float;
      uniform sampler2D texture;
      uniform vec2 delta;
      varying vec2 coord;
      void main() {
        vec4 info = texture2D(texture, coord);
        vec2 dx = vec2(delta.x, 0.0);
        vec2 dy = vec2(0.0, delta.y);
        float average = (
          texture2D(texture, coord - dx).r +
          texture2D(texture, coord - dy).r +
          texture2D(texture, coord + dx).r +
          texture2D(texture, coord + dy).r
        ) * 0.25;
        info.g += (average - info.r) * 2.0;
        info.g *= 0.995;
        info.r += info.g;
        gl_FragColor = info;
      }
    `;

    const renderVertexShader = `
      precision highp float;
      attribute vec2 vertex;
      uniform vec2 topLeft;
      uniform vec2 bottomRight;
      uniform vec2 containerRatio;
      varying vec2 ripplesCoord;
      varying vec2 backgroundCoord;
      void main() {
        backgroundCoord = mix(topLeft, bottomRight, vertex * 0.5 + 0.5);
        backgroundCoord.y = 1.0 - backgroundCoord.y;
        ripplesCoord = vec2(vertex.x, -vertex.y) * containerRatio * 0.5 + 0.5;
        gl_Position = vec4(vertex.x, -vertex.y, 0.0, 1.0);
      }
    `;

    const renderFragmentShader = `
      precision highp float;
      uniform sampler2D samplerBackground;
      uniform sampler2D samplerRipples;
      uniform vec2 delta;
      uniform float perturbance;
      varying vec2 ripplesCoord;
      varying vec2 backgroundCoord;
      void main() {
        float height = texture2D(samplerRipples, ripplesCoord).r;
        float heightX = texture2D(samplerRipples, vec2(ripplesCoord.x + delta.x, ripplesCoord.y)).r;
        float heightY = texture2D(samplerRipples, vec2(ripplesCoord.x, ripplesCoord.y + delta.y)).r;
        vec3 dx = vec3(delta.x, heightX - height, 0.0);
        vec3 dy = vec3(0.0, heightY - height, delta.y);
        vec2 offset = -normalize(cross(dy, dx)).xz;
        float specular = pow(max(0.0, dot(offset, normalize(vec2(-0.6, 1.0)))), 4.0);
        gl_FragColor = texture2D(samplerBackground, backgroundCoord + offset * perturbance) + specular * 0.08;
      }
    `;

    // Create programs
    let dropProgram, updateProgram, renderProgram;
    try {
      dropProgram = createProgram(vertexShader, dropShader);
      updateProgram = createProgram(vertexShader, updateShader);
      renderProgram = createProgram(renderVertexShader, renderFragmentShader);
    } catch (err) {
      console.error('Shader compilation failed:', err);
      return;
    }

    const textureDelta = new Float32Array([1 / resolution, 1 / resolution]);
    gl.useProgram(updateProgram.id);
    gl.uniform2fv(updateProgram.locations.delta, textureDelta);
    gl.useProgram(renderProgram.id);
    gl.uniform2fv(renderProgram.locations.delta, textureDelta);

    // Quad geometry
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
      +1, -1,
      +1, +1,
      -1, +1
    ]), gl.STATIC_DRAW);

    const drawQuad = () => {
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    };

    // Ping-pong render targets for ripple simulation
    const textures = [];
    const framebuffers = [];
    let writeIndex = 0;
    let readIndex = 1;

    for (let i = 0; i < 2; i++) {
      const tex = gl.createTexture();
      const fb = gl.createFramebuffer();

      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, resolution, resolution, 0, gl.RGBA, textureType, null);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

      textures.push(tex);
      framebuffers.push(fb);
    }

    // Background texture configuration
    const backgroundTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, backgroundTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Initial silent/transparent background
    const emptyPixels = new Uint8Array(32 * 32 * 4);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 32, 32, 0, gl.RGBA, gl.UNSIGNED_BYTE, emptyPixels);

    let isMounted = true;
    let backgroundWidth = 32;
    let backgroundHeight = 32;
    let imageLoaded = false;

    // Randomly pick one of 6 background images — new pick on every page load
    const bgImages = [
      '/bg/img1.jpg',
      '/bg/img2.jpg',
      '/bg/img3.jpg',
      '/bg/img4.jpg',
      '/bg/img5.jpg',
      '/bg/img6.jpg',
    ];
    const randomBg = bgImages[Math.floor(Math.random() * bgImages.length)];

    // Load background image
    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    bgImage.onload = () => {
      if (!isMounted) return;
      gl.bindTexture(gl.TEXTURE_2D, backgroundTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bgImage);
      backgroundWidth = bgImage.width;
      backgroundHeight = bgImage.height;
      imageLoaded = true;
      resize();
    };
    bgImage.onerror = () => {
      // Fallback to img1 if random pick fails
      const fallback = new Image();
      fallback.crossOrigin = 'anonymous';
      fallback.onload = () => {
        if (!isMounted) return;
        gl.bindTexture(gl.TEXTURE_2D, backgroundTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fallback);
        backgroundWidth = fallback.width;
        backgroundHeight = fallback.height;
        imageLoaded = true;
        resize();
      };
      fallback.src = '/bg/img1.jpg';
    };
    bgImage.src = randomBg;

    const drop = (x, y, radius, strength) => {
      const longestSide = Math.max(canvas.width, canvas.height);
      const normRadius = radius / longestSide;
      const dropPos = new Float32Array([
        (2 * x - canvas.width) / longestSide,
        (canvas.height - 2 * y) / longestSide
      ]);

      gl.viewport(0, 0, resolution, resolution);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[writeIndex]);
      bindTexture(textures[readIndex], 0);

      gl.useProgram(dropProgram.id);
      gl.uniform2fv(dropProgram.locations.center, dropPos);
      gl.uniform1f(dropProgram.locations.radius, normRadius);
      gl.uniform1f(dropProgram.locations.strength, strength);

      drawQuad();

      // Swap buffer indices
      const temp = writeIndex;
      writeIndex = readIndex;
      readIndex = temp;
    };

    let scaleX = 1;
    let scaleY = 1;
    let topLeftUniform = new Float32Array([0, 0]);
    let bottomRightUniform = new Float32Array([1, 1]);
    let ratioUniform = new Float32Array([1, 1]);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const scale = Math.max(w / backgroundWidth, h / backgroundHeight);
      const bgW = backgroundWidth * scale;
      const bgH = backgroundHeight * scale;

      const bgX = (w - bgW) * 0.5;
      const bgY = (h - bgH) * 0.5;

      topLeftUniform[0] = -bgX / bgW;
      topLeftUniform[1] = -bgY / bgH;

      bottomRightUniform[0] = topLeftUniform[0] + w / bgW;
      bottomRightUniform[1] = topLeftUniform[1] + h / bgH;

      const maxSide = Math.max(w, h);
      ratioUniform[0] = w / maxSide;
      ratioUniform[1] = h / maxSide;
    };

    window.addEventListener('resize', resize);
    resize();

    // Mouse interactions
    let lastX = -999;
    let lastY = -999;
    const handleMouseMove = (e) => {
      const mx = e.clientX;
      const my = e.clientY;

      if (lastX !== -999 && lastY !== -999) {
        const dist = Math.hypot(mx - lastX, my - lastY);
        if (dist > 5) { // More sensitive to movement
          drop(mx, my, dropRadius, 0.025); // Stronger ripples
          lastX = mx;
          lastY = my;
        }
      } else {
        drop(mx, my, dropRadius, 0.025); // Stronger initial ripple
        lastX = mx;
        lastY = my;
      }
    };

    const handleMouseDown = (e) => {
      drop(e.clientX, e.clientY, dropRadius * 2.5, 0.18); // Larger and stronger click ripples
    };

    // Add touch support for mobile devices
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
      }
    };

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      if (touch) {
        drop(touch.clientX, touch.clientY, dropRadius * 2.5, 0.18);
      }
    };

    // Add automatic ambient ripples for more dynamic effect
    const createAmbientRipple = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      drop(x, y, dropRadius * 0.8, 0.008);
    };

    const ambientInterval = setInterval(createAmbientRipple, 3000); // Every 3 seconds

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);

    // Animation Loop
    gl.clearColor(0, 0, 0, 0);
    let animationFrameId;

    const render = () => {
      // 1. Simulation Step (GPU update)
      gl.viewport(0, 0, resolution, resolution);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[writeIndex]);
      bindTexture(textures[readIndex], 0);

      gl.useProgram(updateProgram.id);
      drawQuad();

      // Swap buffers
      const temp = writeIndex;
      writeIndex = readIndex;
      readIndex = temp;

      // 2. Render Step
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(renderProgram.id);
      bindTexture(backgroundTexture, 0);
      bindTexture(textures[readIndex], 1);

      gl.uniform1f(renderProgram.locations.perturbance, perturbance);
      gl.uniform2fv(renderProgram.locations.topLeft, topLeftUniform);
      gl.uniform2fv(renderProgram.locations.bottomRight, bottomRightUniform);
      gl.uniform2fv(renderProgram.locations.containerRatio, ratioUniform);
      gl.uniform1i(renderProgram.locations.samplerBackground, 0);
      gl.uniform1i(renderProgram.locations.samplerRipples, 1);

      drawQuad();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Clean up
    return () => {
      isMounted = false;
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      clearInterval(ambientInterval);
      cancelAnimationFrame(animationFrameId);

      // Clean GL objects
      gl.deleteTexture(backgroundTexture);
      textures.forEach(t => gl.deleteTexture(t));
      framebuffers.forEach(f => gl.deleteFramebuffer(f));
      gl.deleteBuffer(quadBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="water-ripple-canvas"
    />
  );
};

export default WaterRipple;
