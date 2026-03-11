import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Photo } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllPhotos() {
  const { actor, isFetching } = useActor();
  return useQuery<Photo[]>({
    queryKey: ["photos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPhotos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      imageData,
      filterUsed,
    }: { imageData: string; filterUsed: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.addPhoto(imageData, filterUsed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}

export function useDeletePhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (photoId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deletePhoto(photoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });
}
