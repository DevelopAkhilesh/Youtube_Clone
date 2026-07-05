
import "dotenv/config";
import { connectDB } from "../config/db.js";
import User from "../models/User.model.js";
import Channel from "../models/Channel.model.js";
import Video from "../models/Video.model.js";
import Comment from "../models/Comment.model.js";
import mongoose from "mongoose";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// The old Google "gtv-videos-bucket" sample clips have become unreliable
// (intermittent AccessDenied / 403s as Google deprecates the legacy bucket —
// see https://gist.github.com/jsturgis/3b19447b304616f18657 for reports).
// Each of these is on a DIFFERENT host (W3Schools, MDN's GitHub Pages, MDN's
// interactive-examples server) so one host going down doesn't break the
// whole demo. All three individually verified live (real video binary
// returned, no redirect/auth wall) at the time this was written.
const TEST_VIDEOS = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.webm",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
];
