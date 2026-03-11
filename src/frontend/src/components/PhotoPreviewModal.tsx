import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Download, X } from "lucide-react";
import { motion } from "motion/react";

interface PhotoPreviewModalProps {
  open: boolean;
  imageData: string | null;
  filterName: string;
  onClose: () => void;
}

export function PhotoPreviewModal({
  open,
  imageData,
  filterName,
  onClose,
}: PhotoPreviewModalProps) {
  const handleDownload = () => {
    if (!imageData) return;
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `glowsnap-${filterName.toLowerCase().replace(/ /g, "-")}-${Date.now()}.png`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-ocid="photo.dialog"
        className="p-0 border-0 max-w-sm w-full overflow-hidden rounded-2xl"
        style={{ background: "oklch(0.08 0 0)" }}
      >
        {imageData && (
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative"
          >
            <img
              src={imageData}
              alt="Your captured snap"
              className="w-full object-cover max-h-[70vh]"
            />

            <div className="absolute top-4 left-4">
              <span className="glass-gold rounded-full px-3 py-1 text-xs font-body font-semibold gold-text">
                ✨ {filterName}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 glass flex gap-3">
              <Button
                onClick={handleDownload}
                className="flex-1 glass-gold border-0 gold-text font-body font-semibold text-sm h-10"
                variant="outline"
              >
                <Download size={15} className="mr-2" />
                Save
              </Button>
              <Button
                data-ocid="photo.close_button"
                onClick={onClose}
                className="flex-1 bg-white/10 hover:bg-white/20 border-0 text-white font-body text-sm h-10"
                variant="outline"
              >
                <X size={15} className="mr-2" />
                Continue
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
