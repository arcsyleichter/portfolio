"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface InteractiveSynapseNetworkProps {
  /** Content to render on top of the network canvas */
  children?: ReactNode;
  /** Color of each node (any valid CSS color) */
  nodeColor?: string;
  /** Color of the traveling pulse (any valid CSS color) */
  pulseColor?: string;
  /** Color of the connecting lines (any valid CSS color) */
  connectionColor?: string;
  /** Base fill color the animation trails fade into (any valid CSS color) */
  backgroundColor?: string;
  /** How many nodes to simulate */
  nodeCount?: number;
  /** Maximum distance (px) for a connection */
  connectionRadius?: number;
  /** Opacity of the fading background trail (0-1) */
  trailOpacity?: number;
  /** ARIA label for assistive technologies */
  ariaLabel?: string;
  /** Additional CSS classes on the wrapper */
  className?: string;
}

class SynapsePulse {
  progress = 0;

  constructor(
    public start: SynapseNode,
    public end: SynapseNode,
    private speed: number,
    private color: string
  ) {}

  update() {
    this.progress += this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const x = this.start.x + (this.end.x - this.start.x) * this.progress;
    const y = this.start.y + (this.end.y - this.start.y) * this.progress;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class SynapseNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  connections: SynapseNode[] = [];
  pulses: SynapsePulse[] = [];
  activation = 0;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 2;
  }

  update(
    width: number,
    height: number,
    mouse: { x: number; y: number },
    connectionRadius: number,
    pulseColor: string
  ) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.hypot(dx, dy);
    const target = Math.max(0, 1 - dist / (connectionRadius * 0.8));
    this.activation += (target - this.activation) * 0.1;

    if (this.activation > 0.5 && Math.random() > 0.98 && this.connections.length) {
      const to = this.connections[Math.floor(Math.random() * this.connections.length)];
      this.pulses.push(new SynapsePulse(this, to, 0.03, pulseColor));
    }

    this.pulses = this.pulses.filter((p) => p.progress < 1);
    this.pulses.forEach((p) => p.update());
  }

  draw(ctx: CanvasRenderingContext2D, nodeColor: string) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.globalAlpha = Math.max(0.25, this.activation);
    ctx.fillStyle = nodeColor;
    ctx.fill();
    ctx.globalAlpha = 1;

    this.pulses.forEach((p) => p.draw(ctx));
  }
}

export function InteractiveSynapseNetwork({
  children,
  nodeColor = "#d9a521",
  pulseColor = "#faf8f5",
  connectionColor = "#b8860b",
  backgroundColor = "#1a1a1a",
  nodeCount = 80,
  connectionRadius = 170,
  trailOpacity = 0.15,
  ariaLabel = "Interaktív, egérre reagáló hálózat-animáció",
  className = "",
}: InteractiveSynapseNetworkProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nodes: SynapseNode[] = [];
    const mouse = { x: -9999, y: -9999 };

    function buildNetwork() {
      nodes = Array.from({ length: nodeCount }, () => new SynapseNode(width, height));
      nodes.forEach((n1) => {
        nodes.forEach((n2) => {
          if (n1 !== n2 && Math.hypot(n1.x - n2.x, n1.y - n2.y) < connectionRadius) {
            n1.connections.push(n2);
          }
        });
      });
    }

    function resize() {
      const rect = wrapper!.getBoundingClientRect();
      width = canvas!.width = rect.width;
      height = canvas!.height = rect.height;
    }

    resize();
    buildNetwork();

    function drawStaticFrame() {
      ctx!.fillStyle = backgroundColor;
      ctx!.fillRect(0, 0, width, height);
      nodes.forEach((n) => n.draw(ctx!, nodeColor));
    }

    if (reduced) {
      drawStaticFrame();
      const resizeObserver = new ResizeObserver(() => {
        resize();
        drawStaticFrame();
      });
      resizeObserver.observe(wrapper);
      return () => resizeObserver.disconnect();
    }

    function onMouseMove(e: MouseEvent) {
      const rect = wrapper!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    const resizeObserver = new ResizeObserver(() => {
      resize();
      buildNetwork();
    });
    resizeObserver.observe(wrapper);

    let rafId = 0;
    function animate() {
      ctx!.globalAlpha = 1;
      ctx!.fillStyle = backgroundColor;
      ctx!.globalAlpha = trailOpacity;
      ctx!.fillRect(0, 0, width, height);
      ctx!.globalAlpha = 1;

      nodes.forEach((n1) => {
        n1.connections.forEach((n2) => {
          const a = Math.max(0.05, n1.activation, n2.activation) * 0.2;
          ctx!.beginPath();
          ctx!.moveTo(n1.x, n1.y);
          ctx!.lineTo(n2.x, n2.y);
          ctx!.globalAlpha = a;
          ctx!.strokeStyle = connectionColor;
          ctx!.stroke();
          ctx!.globalAlpha = 1;
        });
      });

      nodes.forEach((n) => {
        n.update(width, height, mouse, connectionRadius, pulseColor);
        n.draw(ctx!, nodeColor);
      });

      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [nodeColor, pulseColor, connectionColor, backgroundColor, nodeCount, connectionRadius, trailOpacity, reduced]);

  const a11yProps = children
    ? { role: "img" as const, "aria-label": ariaLabel }
    : { "aria-hidden": true as const };

  return (
    <div ref={wrapperRef} {...a11yProps} className={cn("relative overflow-hidden", className)}>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 block h-full w-full" />
      {children && <div className="relative h-full w-full">{children}</div>}
    </div>
  );
}

export default InteractiveSynapseNetwork;
