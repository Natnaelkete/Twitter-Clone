import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import NotFoundPage from "./pages/home/NotFoundPage";
import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotificationPage";
import { Toaster } from "react-hot-toast";
import AppLayout from "./pages/AppLayout";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="profile/:username" element={<ProfilePage />} />
        </Route>
        <Route path="signup" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
