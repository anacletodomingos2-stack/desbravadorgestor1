import React from "react";
import iasdLogoImg from "../assets/iasd-logo.png";
import desbravadoresTriangleImg from "../assets/desbravadores-triangle.png";
import desbravadoresD4Img from "../assets/desbravadores-d4.png";
import docIconImg from "../assets/doc-icon.png";
import userAvatarImg from "../assets/user-avatar.png";

export {
  iasdLogoImg,
  desbravadoresTriangleImg,
  desbravadoresD4Img,
  docIconImg,
  userAvatarImg,
};

/**
 * Official Seventh-day Adventist Church Logo Image
 * Rendered as an authentic <img> tag directly using official PNG asset
 */
export const IasdLogo: React.FC<{
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ size, width = 56, height = 76, className = "", style }) => {
  const w = size ?? width;
  const h = size ?? height;
  return (
    <img
      src={iasdLogoImg}
      alt="Igreja Adventista do Sétimo Dia"
      width={w}
      height={h}
      className={className}
      style={{
        width: w,
        height: h,
        objectFit: "contain",
        display: "block",
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

/**
 * Official Pathfinder Triangle Emblem (D1 / Triângulo Oficial)
 * Rendered as an authentic <img> tag directly using official PNG asset
 */
export const PathfinderEmblem: React.FC<{
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ size = 36, width, height, className = "", style }) => {
  const w = width ?? size;
  const h = height ?? Math.round(w * 1.04);
  return (
    <img
      src={desbravadoresTriangleImg}
      alt="Clube de Desbravadores"
      width={w}
      height={h}
      className={className}
      style={{
        width: w,
        height: h,
        objectFit: "contain",
        display: "block",
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

/**
 * Official Pathfinder Globe & Triangle Emblem (D4 / Globo América do Sul)
 */
export const DesbravadoresD4Emblem: React.FC<{
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ size = 40, className = "", style }) => {
  return (
    <img
      src={desbravadoresD4Img}
      alt="Emblema D4 Desbravadores"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

/**
 * Circular Document / Article Badge Image
 * Used in PDF for "NUMERO D IDENTIFICAÇÃO" and "TOTAL DE DESBRAVADORES"
 */
export const DocCircleIcon: React.FC<{
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ size = 24, className = "", style }) => {
  return (
    <img
      src={docIconImg}
      alt="Documento"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        borderRadius: "50%",
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

/**
 * Circular Member Avatar / Silhouette Image
 * Used in PDF for member rows and photo frame placeholders
 */
export const UserCircleIcon: React.FC<{
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ size = 30, className = "", style }) => {
  return (
    <img
      src={userAvatarImg}
      alt="Desbravador"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        borderRadius: "50%",
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};
