import marchData from "./instagram-march-2026.json";
import aprilData from "./instagram-april-2026.json";
import mayData from "./instagram-may-2026.json";
import juneData from "./instagram-june-2026.json";

export interface InstagramPost {
  id: string;
  date?: string;
  type: string;
  template: string;
  caption?: string;
  data: Record<string, string>;
}

export const allPosts: InstagramPost[] = [
  ...(marchData as unknown as InstagramPost[]),
  ...(aprilData as unknown as InstagramPost[]),
  ...(mayData as unknown as InstagramPost[]),
  ...(juneData as unknown as InstagramPost[]),
];
