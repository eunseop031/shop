import Image from "next/image";
import type { Product } from "@/lib/types";

const SHAPES: Record<string, { d: string; extra?: string; stroke?: string }> = {
  tee: { d: "M140 90 L100 110 L50 170 L90 205 L120 180 L120 420 L280 420 L280 180 L310 205 L350 170 L300 110 L260 90 Q200 130 140 90Z" },
  long: { d: "M140 90 L100 105 L40 330 L80 345 L125 200 L125 420 L275 420 L275 200 L320 345 L360 330 L300 105 L260 90 Q200 130 140 90Z" },
  outer: { d: "M140 80 L95 100 L35 340 L80 355 L122 190 L122 450 L278 450 L278 190 L320 355 L365 340 L305 100 L260 80 L200 130Z", extra: "M200 130 L200 450" },
  pants: { d: "M130 70 L270 70 L292 430 L214 430 L200 190 L186 430 L108 430Z", extra: "M130 100 L270 100" },
  shorts: { d: "M130 120 L270 120 L292 300 L212 300 L200 210 L188 300 L108 300Z", extra: "M130 148 L270 148" },
  cap: { d: "M95 290 Q95 160 200 160 Q305 160 305 290 L385 305 Q385 325 305 320 L95 320Z", extra: "M200 160 L200 290" },
  bag: { d: "M100 200 L300 200 L322 430 L78 430Z", extra: "M150 200 Q150 105 200 105 Q250 105 250 200" },
};

function shapeFor(p: Pick<Product, "category" | "subcategory">) {
  if (p.category === "outer") return SHAPES.outer;
  if (p.category === "bottom") return p.subcategory === "쇼츠" ? SHAPES.shorts : SHAPES.pants;
  if (p.category === "accessory") return p.subcategory === "가방" ? SHAPES.bag : SHAPES.cap;
  return p.subcategory === "티셔츠" ? SHAPES.tee : SHAPES.long;
}

const BG = ["#eeeeeb", "#e6e6e2", "#f4f4f1", "#dcdcd7"];
const SCALE = [1, 1.2, 0.85, 1.5];

type Props = {
  product: Product;
  variant?: number;
  hex?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function ProductImage({ product, variant = 0, hex, className = "", sizes, priority }: Props) {
  const url = product.images[variant];
  if (url) {
    return (
      <Image
        src={url}
        alt={`${product.name} 이미지 ${variant + 1}`}
        fill
        sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }

  const shape = shapeFor(product);
  const fill = hex ?? product.colors[0].hex;
  const v = variant % 4;
  return (
    <svg
      role="img"
      aria-label={`${product.name} 이미지 ${variant + 1}`}
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 h-full w-full ${className}`}
    >
      <rect width="400" height="500" fill={BG[v]} />
      <g transform={`translate(200 250) scale(${SCALE[v]}) translate(-200 -250)`}>
        <path
          d={shape.d}
          fill={fill}
          stroke="rgba(0,0,0,0.22)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {shape.extra && (
          <path d={shape.extra} fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="3" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
}
