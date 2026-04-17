/**
 * Centralized types for the domain models.
 * Import these across the app instead of redefining interfaces in each file.
 *
 * Usage:
 *   import { Sketch, User, Comment } from "../@types/models";
 */

/** A user-written comment on a sketch */
export interface Comment {
  _id: string;
  comment: string;
  owner: User;
  sketch: string;
  createdAt?: string;
  updatedAt?: string;
}

/** A sketch uploaded by a user */
export interface Sketch {
  _id: string;
  name: string;
  comment: string;
  url: string;
  battle: string;
  owner: User;
  likes: string[];
  comments: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

/** A registered user */
export interface User {
  _id: string;
  email?: string;
  username: string;
  avatar: string;
  info: string;
  sketchs: Sketch[];
  likes: Sketch[];
  comments: Comment[];
  createdAt?: string;
  updatedAt?: string;
}
