import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";

actor {
  // Photo type definition
  type Photo = {
    id : Nat;
    imageData : Text; // base64 string
    timestamp : Time.Time;
    filterUsed : Text;
  };

  // Storage for photos
  var nextPhotoId = 0;
  let photoStore = List.empty<(Nat, Photo)>();

  // Add photo
  public shared ({ caller }) func addPhoto(imageData : Text, filterUsed : Text) : async () {
    let photo : Photo = {
      id = nextPhotoId;
      imageData;
      timestamp = Time.now();
      filterUsed;
    };

    photoStore.add((nextPhotoId, photo));
    nextPhotoId += 1;
  };

  // Get all photos
  public query ({ caller }) func getAllPhotos() : async [Photo] {
    let iter = photoStore.values().map(func(entry) { entry.1 });
    iter.toArray();
  };

  // Delete photo by id
  public shared ({ caller }) func deletePhoto(photoId : Nat) : async () {
    let filteredPhotos = photoStore.filter(
      func((id, _)) { id != photoId }
    );
    if (filteredPhotos.size() == photoStore.size()) {
      Runtime.trap("Photo does not exist");
    };
    photoStore.clear();
    filteredPhotos.values().forEach(
      func(entry) {
        photoStore.add(entry);
      }
    );
  };
};
