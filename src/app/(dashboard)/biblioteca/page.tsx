"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Library, Search, Filter, FolderOpen, Image, Loader2, ExternalLink, Download, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface CloudinaryAsset {
  publicId: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
}

interface CloudinaryFolder {
  name: string;
  assets: CloudinaryAsset[];
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BibliotecaPage() {
  const [folders, setFolders] = useState<CloudinaryFolder[]>([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<CloudinaryAsset | null>(null);

  useEffect(() => {
    fetch("/api/cloudinary")
      .then((r) => r.json())
      .then((data) => {
        setSource(data.source);
        if (data.folders) setFolders(data.folders);
        if (data.totalAssets) setTotalAssets(data.totalAssets);
      })
      .catch(() => setSource("error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-exa-red animate-spin" />
        <span className="ml-3 text-sm text-muted-foreground">Carregando assets do Cloudinary...</span>
      </div>
    );
  }

  if (source === "not_configured") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Image className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Cloudinary nao configurado</h2>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Configure as variaveis CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET no .env para visualizar seus assets.
        </p>
      </div>
    );
  }

  // Filter assets by search
  const filteredFolders = folders.map((folder) => ({
    ...folder,
    assets: folder.assets.filter((a) =>
      search ? a.publicId.toLowerCase().includes(search.toLowerCase()) : true
    ),
  })).filter((f) => f.assets.length > 0);

  const displayFolders = selectedFolder
    ? filteredFolders.filter((f) => f.name === selectedFolder)
    : filteredFolders;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Library className="w-5 h-5 text-exa-red" />
            Biblioteca
          </h1>
          <p className="text-sm text-muted-foreground">
            {totalAssets} assets no Cloudinary — {folders.length} pastas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar assets..."
              className="h-8 pl-8 text-xs w-[200px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {selectedFolder && (
            <Button size="sm" variant="outline" className="gap-2 text-xs" onClick={() => setSelectedFolder(null)}>
              Todas as pastas
            </Button>
          )}
        </div>
      </div>

      {/* Folder navigation */}
      {!selectedFolder && folders.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {folders.map((folder) => (
            <button
              key={folder.name}
              onClick={() => setSelectedFolder(folder.name)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors text-xs"
            >
              <FolderOpen className="w-3.5 h-3.5 text-exa-amber" />
              <span>{folder.name || "raiz"}</span>
              <Badge variant="outline" className="text-[9px] ml-1">{folder.assets.length}</Badge>
            </button>
          ))}
        </div>
      )}

      {/* Assets grid */}
      {displayFolders.map((folder) => (
        <div key={folder.name}>
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <FolderOpen className="w-3.5 h-3.5" />
            {folder.name || "Raiz"}
            <Badge variant="outline" className="text-[9px]">{folder.assets.length} arquivos</Badge>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {folder.assets.map((asset, i) => (
              <motion.div
                key={asset.publicId}
                className="glass-card overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setPreviewAsset(asset)}
              >
                <div className="relative aspect-square bg-muted/20">
                  <img
                    src={asset.url}
                    alt={asset.publicId.split("/").pop() || ""}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white hover:text-white hover:bg-white/20">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-white hover:bg-white/20 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-[10px] text-muted-foreground truncate">
                    {asset.publicId.split("/").pop()}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] text-muted-foreground font-mono">
                      {asset.width}x{asset.height}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono">
                      {formatBytes(asset.bytes)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {displayFolders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Image className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhum asset encontrado</p>
        </div>
      )}

      {/* Preview modal */}
      {previewAsset && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8"
          onClick={() => setPreviewAsset(null)}
        >
          <motion.div
            className="max-w-4xl max-h-[90vh] flex flex-col glass-card overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewAsset.url}
              alt={previewAsset.publicId}
              className="max-h-[70vh] object-contain"
            />
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{previewAsset.publicId.split("/").pop()}</p>
                <p className="text-xs text-muted-foreground">
                  {previewAsset.width}x{previewAsset.height} - {previewAsset.format.toUpperCase()} - {formatBytes(previewAsset.bytes)}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(previewAsset.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={previewAsset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-exa-red text-white text-xs hover:bg-exa-red/80 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Abrir original
                </a>
                <Button size="sm" variant="outline" onClick={() => setPreviewAsset(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
