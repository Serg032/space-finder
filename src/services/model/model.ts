export interface Space {
  id: string;
  location: string;
  name: string;
  photoUrl?: string;
}

export type CreateSpaceCommand = Omit<Space, "id">;

export type QuerySpaceCommand = Omit<Space, "id" | "location">;
