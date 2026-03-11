import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Photo } from "../backend.d";
import { useDeletePhoto, useGetAllPhotos } from "../hooks/useQueries";

interface GalleryModalProps {
  open: boolean;
  onClose: () => void;
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function GalleryModal({ open, onClose }: GalleryModalProps) {
  const { data: photos, isLoading } = useGetAllPhotos();
  const deleteMutation = useDeletePhoto();

  const handleDelete = (photo: Photo) => {
    deleteMutation.mutate(photo.id);
  };

  const sortedPhotos = photos
    ? [...photos].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-ocid="gallery.modal"
        className="glass max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col border-0"
        style={{ background: "oklch(0.1 0.005 270 / 0.95)" }}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="font-display text-xl gold-text flex items-center gap-2">
            <span>✨</span> My GlowSnap Gallery
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto scroll-hide">
          {isLoading && (
            <div
              data-ocid="gallery.loading_state"
              className="flex items-center justify-center py-12"
            >
              <div className="w-8 h-8 border-2 border-gold rounded-full border-t-transparent animate-spin" />
            </div>
          )}

          {!isLoading && sortedPhotos.length === 0 && (
            <div
              data-ocid="gallery.empty_state"
              className="flex flex-col items-center justify-center py-12 gap-3"
            >
              <div className="text-4xl">📸</div>
              <p className="text-muted-foreground text-sm font-body">
                No snaps yet. Capture your first glow!
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 p-1">
            <AnimatePresence>
              {sortedPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id.toString()}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.04 }}
                  className="relative group rounded-xl overflow-hidden aspect-[3/4] bg-muted"
                >
                  <img
                    src={photo.imageData}
                    alt={`Snap with ${photo.filterUsed} filter`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white/90 text-[10px] font-body font-medium">
                      {photo.filterUsed}
                    </p>
                    <p className="text-white/60 text-[9px]">
                      {formatDate(photo.timestamp)}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid={`gallery.delete_button.${index + 1}`}
                    onClick={() => handleDelete(photo)}
                    disabled={deleteMutation.isPending}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/80"
                    aria-label="Delete photo"
                  >
                    <Trash2 size={12} className="text-white" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
