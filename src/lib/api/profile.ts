import { publicApiWithAuth } from "./client";
import type { Profile, UpdateProfilePayload } from "@/types/profile";

export async function getProfile(accessToken: string) {
  return publicApiWithAuth(accessToken).get<Profile>("/profile");
}

export async function updateProfile(
  accessToken: string,
  data: UpdateProfilePayload
) {
  return publicApiWithAuth(accessToken).put<Profile>("/profile", data);
}
