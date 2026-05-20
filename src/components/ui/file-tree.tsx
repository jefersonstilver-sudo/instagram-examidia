"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  extension?: string;
}

interface FileTreeProps {
  data: FileNode[];
  className?: string;
}

interface FileItemProps {
  node: FileNode;
  depth: number;
  isLast: boolean;
}

const getFileIcon = (extension?: string) => {
  const iconMap: Record<string, { color: string; icon: string }> = {
    tsx: { color: "text-[oklch(0.65_0.18_220)]", icon: "\u269B" },
    ts: { color: "text-[oklch(0.6_0.15_230)]", icon: "\u25C6" },
    js: { color: "text-[oklch(0.8_0.18_90)]", icon: "\u25C6" },
    css: { color: "text-[oklch(0.65_0.2_280)]", icon: "\u25C8" },
    json: { color: "text-[oklch(0.75_0.15_85)]", icon: "{}" },
    md: { color: "text-muted-foreground", icon: "\u25CA" },
    png: { color: "text-[oklch(0.65_0.12_160)]", icon: "\u25D1" },
    mp4: { color: "text-exa-red", icon: "\u25B6" },
    prisma: { color: "text-[oklch(0.6_0.15_280)]", icon: "\u25C8" },
    default: { color: "text-muted-foreground", icon: "\u25C7" },
  };
  return iconMap[extension || "default"] || iconMap.default;
};

function FileItem({ node, depth, isLast }: FileItemProps) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const [isHovered, setIsHovered] = useState(false);
  const isFolder = node.type === "folder";
  const hasChildren = isFolder && node.children && node.children.length > 0;
  const fileIcon = getFileIcon(node.extension);

  return (
    <div className="select-none">
      <div
        className={cn(
          "group relative flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer",
          "transition-all duration-200 ease-out",
          isHovered && "bg-muted/40"
        )}
        onClick={() => isFolder && setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {depth > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 flex"
            style={{ left: `${(depth - 1) * 16 + 16}px` }}
          >
            <div className={cn("w-px transition-colors duration-200", isHovered ? "bg-exa-red/40" : "bg-border/30")} />
          </div>
        )}

        <div className={cn("flex items-center justify-center w-4 h-4 transition-transform duration-200 ease-out", isFolder && isOpen && "rotate-90")}>
          {isFolder ? (
            <svg width="6" height="8" viewBox="0 0 6 8" fill="none" className={cn("transition-colors", isHovered ? "text-exa-red" : "text-muted-foreground")}>
              <path d="M1 1L5 4L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <span className={cn("text-xs", fileIcon.color)}>{fileIcon.icon}</span>
          )}
        </div>

        <div className={cn("flex items-center justify-center w-5 h-5 rounded transition-all duration-200", isFolder ? (isHovered ? "text-exa-amber scale-110" : "text-exa-amber/70") : "")}>
          {isFolder ? (
            <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor">
              <path d="M1.5 1C0.671573 1 0 1.67157 0 2.5V11.5C0 12.3284 0.671573 13 1.5 13H14.5C15.3284 13 16 12.3284 16 11.5V4.5C16 3.67157 15.3284 3 14.5 3H8L6.5 1H1.5Z" />
            </svg>
          ) : (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" className={cn(fileIcon.color, "opacity-60")}>
              <path d="M1.5 0C0.671573 0 0 0.671573 0 1.5V14.5C0 15.3284 0.671573 16 1.5 16H12.5C13.3284 16 14 15.3284 14 14.5V4.5L9.5 0H1.5Z" />
            </svg>
          )}
        </div>

        <span className={cn("font-mono text-sm transition-colors duration-200", isFolder ? (isHovered ? "text-foreground" : "text-foreground/90") : (isHovered ? "text-foreground" : "text-muted-foreground"))}>
          {node.name}
        </span>

        {isHovered && (
          <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-exa-red" />
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="transition-all duration-300 ease-out">
          {node.children!.map((child, index) => (
            <FileItem
              key={child.name}
              node={child}
              depth={depth + 1}
              isLast={index === node.children!.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ data, className }: FileTreeProps) {
  return (
    <div className={cn("bg-background/50 rounded-lg border border-border/50 p-3 font-mono", className)}>
      <div className="flex items-center gap-2 pb-3 mb-2 border-b border-border/30">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-exa-red" />
          <div className="w-2.5 h-2.5 rounded-full bg-exa-amber" />
          <div className="w-2.5 h-2.5 rounded-full bg-exa-green" />
        </div>
        <span className="text-xs text-muted-foreground ml-2">explorer</span>
      </div>
      <div className="space-y-0.5">
        {data.map((node, index) => (
          <FileItem key={node.name} node={node} depth={0} isLast={index === data.length - 1} />
        ))}
      </div>
    </div>
  );
}
