import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

// Pages
import HomePage from "./pages/HomePage.jsx";
// import VideoPlayerPage from "./pages/VideoPlayerPage.jsx";
// import ChannelPage from "./pages/ChannelPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
// import UploadVideoPage from "./pages/UploadVideoPage.jsx";
// import SubscriptionsPage from "./pages/SubscriptionsPage.jsx";
// import HistoryPage from "./pages/HistoryPage.jsx";
// import PlaylistsPage from "./pages/PlaylistsPage.jsx";
// import WatchLaterPage from "./pages/WatchLaterPage.jsx";
// import LikedVideosPage from "./pages/LikedVideosPage.jsx";
// import YourVideosPage from "./pages/YourVideosPage.jsx";
// import DownloadsPage from "./pages/DownloadsPage.jsx";
// import ShortsPage from "./pages/ShortsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Helper: wraps element with ProtectedRoute
const protect = (element) => <ProtectedRoute>{element}</ProtectedRoute>;

export const router = createBrowserRouter([
  // Auth pages – no Layout
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // Main app – with Layout
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      // {
      //   path: "/video/:id",
      //   element: <VideoPlayerPage />,
      // },
      // {
      //   path: "/channel/:id",
      //   element: <ChannelPage />,
      // },
      // {
      //   path: "/channel/me",
      //   element: <ChannelPage />,
      // },
      // {
      //   path: "/channel/new",
      //   element: <ChannelPage />,
      // },
      // {
      //   path: "/shorts",
      //   element: <ShortsPage />,
      // },
      // // Protected routes
      // {
      //   path: "/upload",
      //   element: protect(<UploadVideoPage />),
      // },
      // {
      //   path: "/upload/:id",
      //   element: protect(<UploadVideoPage />),
      // },
      // {
      //   path: "/subscriptions",
      //   element: protect(<SubscriptionsPage />),
      // },
      // {
      //   path: "/history",
      //   element: protect(<HistoryPage />),
      // },
      // {
      //   path: "/playlists",
      //   element: protect(<PlaylistsPage />),
      // },
      // {
      //   path: "/playlists/:id",
      //   element: protect(<PlaylistsPage />),
      // },
      // {
      //   path: "/watch-later",
      //   element: protect(<WatchLaterPage />),
      // },
      // {
      //   path: "/liked",
      //   element: protect(<LikedVideosPage />),
      // },
      // {
      //   path: "/your-videos",
      //   element: protect(<YourVideosPage />),
      // },
      // {
      //   path: "/downloads",
      //   element: protect(<DownloadsPage />),
      // },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);