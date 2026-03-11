import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlertCircle, FlipHorizontal, Images, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCamera } from "./camera/useCamera";
import { FILTERS, FilterSelector } from "./components/FilterSelector";
import { GalleryModal } from "./components/GalleryModal";
import { PhotoPreviewModal } from "./components/PhotoPreviewModal";
import { useAddPhoto } from "./hooks/useQueries";

const queryClient = new QueryClient();

function GlowCamApp() {
  const [activeFilterId, setActiveFilterId] = useState("natural_glow");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const ornamentImagesRef = useRef<{
    maangTikka: HTMLImageElement;
    jhumkas: HTMLImageElement;
    bindi: HTMLImageElement;
  } | null>(null);
  const animFrameRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  const {
    videoRef,
    startCamera,
    stopCamera,
    isActive,
    isLoading,
    error,
    switchCamera,
  } = useCamera({
    facingMode: "user",
    width: 480,
    height: 640,
  });

  const addPhotoMutation = useAddPhoto();
  const activeFilter =
    FILTERS.find((f) => f.id === activeFilterId) ?? FILTERS[0];

  // Preload ornament images
  useEffect(() => {
    const maangTikka = new Image();
    const jhumkas = new Image();
    const bindi = new Image();
    maangTikka.src =
      "/assets/generated/maang-tikka-transparent.dim_300x200.png";
    jhumkas.src = "/assets/generated/jhumkas-transparent.dim_300x200.png";
    bindi.src = "/assets/generated/bindi-transparent.dim_100x100.png";
    ornamentImagesRef.current = { maangTikka, jhumkas, bindi };
  }, []);

  // Start camera on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: start/stop camera only on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Canvas rendering loop
  const drawFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = displayCanvasRef.current;
    if (!canvas || !video || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(drawFrame);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    frameCountRef.current += 1;
    const frame = frameCountRef.current;

    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 640;

    ctx.filter =
      activeFilter.cssFilter === "none" ? "none" : activeFilter.cssFilter;

    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Draw ornament overlays
    if (activeFilter.isOrnaments) {
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.filter = "none";

      if (activeFilter.ornamentType === "bridal" && ornamentImagesRef.current) {
        const { maangTikka, jhumkas, bindi } = ornamentImagesRef.current;

        if (maangTikka.complete && maangTikka.naturalWidth > 0) {
          const tikkaW = cw * 0.55;
          const tikkaH =
            (tikkaW * maangTikka.naturalHeight) / maangTikka.naturalWidth;
          ctx.drawImage(
            maangTikka,
            (cw - tikkaW) / 2,
            ch * 0.04,
            tikkaW,
            tikkaH,
          );
        }

        if (bindi.complete && bindi.naturalWidth > 0) {
          const bindiSize = cw * 0.06;
          ctx.drawImage(
            bindi,
            (cw - bindiSize) / 2,
            ch * 0.27,
            bindiSize,
            bindiSize,
          );
        }

        if (jhumkas.complete && jhumkas.naturalWidth > 0) {
          const jW = cw * 0.25;
          const jH = (jW * jhumkas.naturalHeight) / jhumkas.naturalWidth;
          const earY = ch * 0.37;
          ctx.drawImage(
            jhumkas,
            0,
            0,
            jhumkas.naturalWidth / 2,
            jhumkas.naturalHeight,
            -cw * 0.02,
            earY,
            jW,
            jH,
          );
          ctx.drawImage(
            jhumkas,
            jhumkas.naturalWidth / 2,
            0,
            jhumkas.naturalWidth / 2,
            jhumkas.naturalHeight,
            cw - jW + cw * 0.02,
            earY,
            jW,
            jH,
          );
        }
      } else if (activeFilter.ornamentType === "nath") {
        ctx.save();
        const nathX = cw * 0.62;
        const nathY = ch * 0.4;
        const nathR = cw * 0.05;
        ctx.beginPath();
        ctx.arc(nathX, nathY, nathR, 0, Math.PI * 2);
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 3;
        ctx.stroke();
        const beadR = cw * 0.015;
        ctx.beginPath();
        ctx.arc(nathX, nathY + nathR + beadR, beadR, 0, Math.PI * 2);
        ctx.fillStyle = "#8B0000";
        ctx.fill();
        const bindiX = cw * 0.5;
        const bindiY = ch * 0.27;
        const bindiR = cw * 0.025;
        const bindiGrad = ctx.createRadialGradient(
          bindiX,
          bindiY,
          0,
          bindiX,
          bindiY,
          bindiR,
        );
        bindiGrad.addColorStop(0, "#FF4500");
        bindiGrad.addColorStop(1, "#8B0000");
        ctx.beginPath();
        ctx.arc(bindiX, bindiY, bindiR, 0, Math.PI * 2);
        ctx.fillStyle = bindiGrad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bindiX, bindiY, bindiR + 2, 0, Math.PI * 2);
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      } else if (activeFilter.ornamentType === "kundan") {
        ctx.save();
        const tikkaStartX = cw * 0.5;
        const tikkaStartY = ch * 0.12;
        const tikkaEndY = ch * 0.22;
        ctx.beginPath();
        ctx.moveTo(tikkaStartX, tikkaStartY);
        ctx.lineTo(tikkaStartX, tikkaEndY);
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(tikkaStartX, tikkaEndY, cw * 0.03, 0, Math.PI * 2);
        ctx.fillStyle = "#D4AF37";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(tikkaStartX, tikkaEndY, cw * 0.016, 0, Math.PI * 2);
        ctx.fillStyle = "#fff8e1";
        ctx.fill();
        const neckCenterX = cw * 0.5;
        const neckCenterY = ch * 0.535;
        const neckRadius = cw * 0.26;
        const gemCount = 9;
        for (let i = 0; i < gemCount; i++) {
          const a = Math.PI + (i / (gemCount - 1) - 0.5) * Math.PI * 0.75;
          const gx = neckCenterX + Math.cos(a) * neckRadius;
          const gy = neckCenterY + Math.sin(a) * neckRadius * 0.4;
          const gemW = cw * 0.04;
          const gemH = cw * 0.05;
          ctx.beginPath();
          ctx.ellipse(gx, gy, gemW / 2, gemH / 2, 0, 0, Math.PI * 2);
          ctx.fillStyle = "#D4AF37";
          ctx.fill();
          ctx.strokeStyle = "#b8860b";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(gx, gy, gemW * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = "#fffde7";
          ctx.fill();
        }
        const earPositions = [
          { x: cw * 0.07, y: ch * 0.36 },
          { x: cw * 0.88, y: ch * 0.36 },
        ];
        for (const ear of earPositions) {
          const ew = cw * 0.035;
          const eh = cw * 0.06;
          ctx.beginPath();
          ctx.ellipse(ear.x, ear.y + eh * 0.3, ew, eh, 0, 0, Math.PI * 2);
          ctx.fillStyle = "#D4AF37";
          ctx.fill();
          ctx.strokeStyle = "#b8860b";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(ear.x, ear.y + eh * 0.3, ew * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = "#fffde7";
          ctx.fill();
          for (let d = 0; d < 3; d++) {
            const dx = ear.x + (d - 1) * ew * 0.7;
            const dy = ear.y + eh + cw * 0.015 + d * 0.5;
            ctx.beginPath();
            ctx.arc(dx, dy, cw * 0.008, 0, Math.PI * 2);
            ctx.fillStyle = "#D4AF37";
            ctx.fill();
          }
        }
        ctx.restore();
      } else if (activeFilter.ornamentType === "maang_tikka_only") {
        // ── Maang Tikka Only ──
        ctx.save();
        const mX = cw * 0.5;
        const mTopY = ch * 0.12;
        const mBotY = ch * 0.25;
        const beadCount = 6;
        // Draw chain with small beads
        for (let i = 0; i <= beadCount; i++) {
          const t = i / beadCount;
          const by = mTopY + (mBotY - mTopY) * t;
          ctx.beginPath();
          ctx.arc(mX, by, cw * 0.008, 0, Math.PI * 2);
          ctx.fillStyle = "#D4AF37";
          ctx.fill();
        }
        // Chain line
        ctx.beginPath();
        ctx.moveTo(mX, mTopY);
        ctx.lineTo(mX, mBotY);
        ctx.strokeStyle = "#c8a020";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        // Pendant circle
        ctx.beginPath();
        ctx.arc(mX, mBotY, cw * 0.032, 0, Math.PI * 2);
        ctx.fillStyle = "#D4AF37";
        ctx.fill();
        ctx.strokeStyle = "#b8860b";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Inner gem
        ctx.beginPath();
        ctx.arc(mX, mBotY, cw * 0.016, 0, Math.PI * 2);
        ctx.fillStyle = "#fff8c0";
        ctx.fill();
        // Teardrop gem below pendant
        ctx.beginPath();
        ctx.ellipse(
          mX,
          mBotY + cw * 0.05,
          cw * 0.014,
          cw * 0.024,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "#e84393";
        ctx.fill();
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      } else if (activeFilter.ornamentType === "nose_ring_only") {
        // ── Nose Ring Only ──
        ctx.save();
        const nrX = cw * 0.4;
        const nrY = ch * 0.44;
        const nrR = cw * 0.035;
        // Gold ring
        ctx.beginPath();
        ctx.arc(nrX, nrY, nrR, 0, Math.PI * 2);
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 2;
        ctx.stroke();
        // Small hanging beads
        for (let b = 0; b < 3; b++) {
          const bAngle = Math.PI * 0.7 + b * (Math.PI * 0.3);
          const bx = nrX + Math.cos(bAngle) * (nrR + cw * 0.012);
          const by = nrY + Math.sin(bAngle) * (nrR + cw * 0.012);
          ctx.beginPath();
          ctx.arc(bx, by, cw * 0.007, 0, Math.PI * 2);
          ctx.fillStyle = b === 1 ? "#cc2200" : "#D4AF37";
          ctx.fill();
        }
        ctx.restore();
      } else if (activeFilter.ornamentType === "jhumka_only") {
        // ── Jhumka Earrings Only ──
        ctx.save();
        const jPositions = [
          { x: cw * 0.08, y: ch * 0.38 },
          { x: cw * 0.9, y: ch * 0.38 },
        ];
        for (const jp of jPositions) {
          const jR = cw * 0.028;
          // Dome top
          ctx.beginPath();
          ctx.arc(jp.x, jp.y, jR, Math.PI, 0);
          ctx.fillStyle = "#D4AF37";
          ctx.fill();
          ctx.strokeStyle = "#b8860b";
          ctx.lineWidth = 1;
          ctx.stroke();
          // Bell body
          ctx.beginPath();
          ctx.ellipse(
            jp.x,
            jp.y + jR * 1.2,
            jR * 0.85,
            jR * 1.3,
            0,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = "#D4AF37";
          ctx.fill();
          ctx.strokeStyle = "#b8860b";
          ctx.lineWidth = 1;
          ctx.stroke();
          // Center gem on bell
          ctx.beginPath();
          ctx.arc(jp.x, jp.y + jR * 1.2, jR * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = "#fffde7";
          ctx.fill();
          // Fringes (5 beads)
          const fringeCount = 5;
          for (let fi = 0; fi < fringeCount; fi++) {
            const fx = jp.x + (fi - (fringeCount - 1) / 2) * jR * 0.45;
            const fy = jp.y + jR * 2.6 + (fi % 2 === 0 ? 0 : cw * 0.012);
            ctx.beginPath();
            ctx.arc(fx, fy, cw * 0.007, 0, Math.PI * 2);
            ctx.fillStyle = "#D4AF37";
            ctx.fill();
          }
        }
        ctx.restore();
      } else if (activeFilter.ornamentType === "necklace_only") {
        // ── Gold Necklace Only ──
        ctx.save();
        const nStartX = cw * 0.2;
        const nEndX = cw * 0.8;
        const nY = ch * 0.55;
        const nCtrlY = nY + ch * 0.06;
        // Draw thin gold arc
        ctx.beginPath();
        ctx.moveTo(nStartX, nY - ch * 0.02);
        ctx.quadraticCurveTo(cw * 0.5, nCtrlY, nEndX, nY - ch * 0.02);
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 2.5;
        ctx.stroke();
        // Small beads along necklace
        const beadN = 9;
        for (let bi = 0; bi <= beadN; bi++) {
          const t = bi / beadN;
          const bx =
            nStartX +
            (nEndX - nStartX) * t +
            (cw * 0.5 - (nStartX + (nEndX - nStartX) * t)) *
              0.15 *
              (1 - Math.abs(t - 0.5) * 2);
          const by =
            nY -
            ch * 0.02 +
            (nCtrlY - (nY - ch * 0.02)) * Math.sin(t * Math.PI) * 0.6;
          ctx.beginPath();
          ctx.arc(bx, by, cw * 0.009, 0, Math.PI * 2);
          ctx.fillStyle = bi === Math.floor(beadN / 2) ? "#fff8c0" : "#D4AF37";
          ctx.fill();
        }
        // Pendant teardrop at center bottom
        const pendX = cw * 0.5;
        const pendY = nCtrlY + ch * 0.01;
        ctx.beginPath();
        ctx.ellipse(
          pendX,
          pendY + cw * 0.022,
          cw * 0.013,
          cw * 0.022,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "#D4AF37";
        ctx.fill();
        ctx.strokeStyle = "#b8860b";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(pendX, pendY + cw * 0.022, cw * 0.007, 0, Math.PI * 2);
        ctx.fillStyle = "#fff8c0";
        ctx.fill();
        ctx.restore();
      } else if (activeFilter.ornamentType === "bindi_only") {
        // ── Bindi Only ──
        ctx.save();
        const bX = cw * 0.5;
        const bY = ch * 0.27;
        const bR = cw * 0.026;
        // Radial gradient bindi
        const bg = ctx.createRadialGradient(bX, bY, 0, bX, bY, bR);
        bg.addColorStop(0, "#FF2200");
        bg.addColorStop(0.6, "#CC0000");
        bg.addColorStop(1, "#7a0000");
        ctx.beginPath();
        ctx.arc(bX, bY, bR, 0, Math.PI * 2);
        ctx.fillStyle = bg;
        ctx.fill();
        // Gold outline
        ctx.beginPath();
        ctx.arc(bX, bY, bR + 2, 0, Math.PI * 2);
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Decorative small dots around bindi
        const dotCount = 6;
        for (let di = 0; di < dotCount; di++) {
          const angle = (di / dotCount) * Math.PI * 2;
          const dx = bX + Math.cos(angle) * (bR + cw * 0.018);
          const dy = bY + Math.sin(angle) * (bR + cw * 0.018);
          ctx.beginPath();
          ctx.arc(dx, dy, cw * 0.006, 0, Math.PI * 2);
          ctx.fillStyle = "#D4AF37";
          ctx.fill();
        }
        ctx.restore();
      } else if (activeFilter.ornamentType === "sparkle") {
        // ── Festive Sparkle ──
        ctx.save();
        // Use a seeded pseudo-random for stable positions, animated by frame
        const sparklePositions = [
          { x: 0.18, y: 0.08 },
          { x: 0.72, y: 0.12 },
          { x: 0.35, y: 0.18 },
          { x: 0.62, y: 0.22 },
          { x: 0.15, y: 0.35 },
          { x: 0.82, y: 0.3 },
          { x: 0.28, y: 0.52 },
          { x: 0.78, y: 0.48 },
          { x: 0.5, y: 0.1 },
          { x: 0.42, y: 0.42 },
          { x: 0.6, y: 0.6 },
          { x: 0.22, y: 0.65 },
          { x: 0.85, y: 0.62 },
          { x: 0.45, y: 0.78 },
          { x: 0.68, y: 0.82 },
          { x: 0.3, y: 0.88 },
          { x: 0.55, y: 0.92 },
          { x: 0.8, y: 0.15 },
        ];
        const colors = ["#fff", "#ffd700", "#ffb3cb", "#fffde7", "#d4af37"];
        sparklePositions.forEach((pos, i) => {
          const twinkle = Math.sin(frame * 0.05 + i * 1.3) * 0.5 + 0.5;
          const size = (5 + (i % 4) * 3) * (0.6 + twinkle * 0.6);
          const sx = cw * pos.x;
          const sy = ch * pos.y;
          const color = colors[i % colors.length];
          const alpha = 0.4 + twinkle * 0.6;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = 1.5;
          ctx.translate(sx, sy);
          ctx.rotate(frame * 0.02 + i * 0.4);
          // Draw 4-point star
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size * 0.25, -size * 0.25);
          ctx.lineTo(size, 0);
          ctx.lineTo(size * 0.25, size * 0.25);
          ctx.lineTo(0, size);
          ctx.lineTo(-size * 0.25, size * 0.25);
          ctx.lineTo(-size, 0);
          ctx.lineTo(-size * 0.25, -size * 0.25);
          ctx.closePath();
          ctx.fill();
          // Center dot
          ctx.beginPath();
          ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();
          ctx.restore();
        });
        ctx.restore();
      }
    }

    animFrameRef.current = requestAnimationFrame(drawFrame);
  }, [activeFilter, videoRef]);

  useEffect(() => {
    if (isActive) {
      animFrameRef.current = requestAnimationFrame(drawFrame);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, drawFrame]);

  const handleCapture = async () => {
    const canvas = displayCanvasRef.current;
    if (!canvas || !isActive || isCapturing) return;
    setIsCapturing(true);
    try {
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedPhoto(dataUrl);
      await addPhotoMutation.mutateAsync({
        imageData: dataUrl,
        filterUsed: activeFilter.name,
      });
      toast.success("Snap saved to gallery! ✨");
    } catch {
      toast.error("Couldn't save snap. Try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-background overflow-hidden">
      <div className="relative w-full max-w-[480px] h-full flex flex-col">
        <div className="relative flex-1 overflow-hidden bg-black">
          <video ref={videoRef} playsInline muted style={{ display: "none" }} />

          <canvas
            ref={displayCanvasRef}
            data-ocid="camera.canvas_target"
            className="w-full h-full object-cover"
          />

          <AnimatePresence>
            {(isLoading || !isActive) && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                data-ocid="camera.loading_state"
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/90"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="w-12 h-12 border-2 border-gold rounded-full border-t-transparent"
                />
                <p className="mt-4 text-white/60 font-body text-sm">
                  Starting camera...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                data-ocid="camera.error_state"
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 gap-4 p-6"
              >
                <AlertCircle size={40} className="text-destructive" />
                <div className="text-center">
                  <p className="text-white font-body font-semibold mb-1">
                    Camera Access Required
                  </p>
                  <p className="text-white/60 font-body text-sm">
                    {error.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="glass-gold rounded-full px-6 py-2.5 gold-text font-body font-semibold text-sm"
                >
                  Retry
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="font-display text-xl font-bold gold-text flex items-center gap-1.5">
                <Sparkles size={18} />
                GlowCam
              </h1>
            </motion.div>
            <motion.button
              type="button"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              data-ocid="gallery.open_modal_button"
              onClick={() => setGalleryOpen(true)}
              className="glass w-10 h-10 rounded-full flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <Images size={18} className="text-white" />
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {activeFilter.id !== "none" && (
              <motion.div
                key={activeFilter.id}
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="absolute top-16 left-1/2 -translate-x-1/2"
              >
                <span className="glass-gold rounded-full px-4 py-1.5 text-xs font-body font-semibold gold-text">
                  ✨ {activeFilter.name}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isCapturing && (
              <motion.div
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-white pointer-events-none z-20"
              />
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass flex-shrink-0 px-4 pt-4 pb-6"
        >
          <div className="mb-5">
            <FilterSelector
              activeFilter={activeFilterId}
              onFilterChange={setActiveFilterId}
            />
          </div>

          <div className="flex items-center justify-center gap-8">
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => switchCamera()}
              disabled={isLoading}
              className="w-12 h-12 rounded-full glass flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Switch camera"
            >
              <FlipHorizontal size={20} className="text-white" />
            </motion.button>

            <motion.button
              type="button"
              data-ocid="camera.primary_button"
              onClick={handleCapture}
              disabled={!isActive || isCapturing || isLoading}
              whileTap={{ scale: 0.9 }}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center disabled:opacity-40 transition-opacity capture-btn-glow"
              aria-label="Capture photo"
            >
              <div className="w-16 h-16 rounded-full border-4 border-black/10 gold-gradient" />
            </motion.button>

            <div className="w-12 h-12" />
          </div>

          <p className="text-center text-[10px] text-white/30 font-body mt-4">
            © {currentYear}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/50 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </motion.div>
      </div>

      <GalleryModal open={galleryOpen} onClose={() => setGalleryOpen(false)} />
      <PhotoPreviewModal
        open={capturedPhoto !== null}
        imageData={capturedPhoto}
        filterName={activeFilter.name}
        onClose={() => setCapturedPhoto(null)}
      />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(0.12 0.005 270 / 0.95)",
            border: "1px solid oklch(0.75 0.15 65 / 0.4)",
            color: "oklch(0.96 0.01 90)",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlowCamApp />
    </QueryClientProvider>
  );
}
