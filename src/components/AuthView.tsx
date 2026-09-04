import React, { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase";

import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  GraduationCap,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { api, ApiError } from "../utils/api";

import type { User, UserRole } from "../types";

interface AuthViewProps {
  demoMode: boolean;
  allUsers: User[];
  onAuthSuccess: (token: string, user: User) => void;
}

interface AuthResponse {
  token: string;
  user: User;
}

const ROLES: UserRole[] = [
  "Frontend Developer",
  "Backend Developer",
  "AI/ML Engineer",
  "UI/UX Designer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
];

const describeAuthError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message || "Authentication failed.";
  }

  if (error instanceof Error) {
    return error.message || "Something went wrong.";
  }

  return "Something went wrong. Please try again.";
};

const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#4285F4"
      d="M21.35 12.23c0-.78-.07-1.53-.2-2.25H12v4.26h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.4Z"
    />
    <path
      fill="#34A853"
      d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.04H3.29v2.53A9.75 9.75 0 0 0 12 21.75Z"
    />
    <path
      fill="#FBBC05"
      d="M6.53 13.83A5.86 5.86 0 0 1 6.22 12c0-.64.11-1.26.31-1.83V7.64H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.36l3.24-2.53Z"
    />
    <path
      fill="#EA4335"
      d="M12 6.13c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.19 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.71 5.39l3.24 2.53C7.3 7.85 9.46 6.13 12 6.13Z"
    />
  </svg>
);

const AuthView: React.FC<AuthViewProps> = ({
  demoMode,
  allUsers,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState<UserRole>("Frontend Developer");

  const [college, setCollege] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  /**
   * Common success handler
   */
  const completeAuth = (token: string, user: User) => {
    setSuccessMessage(`Welcome ${user.name}!`);

    setTimeout(() => {
      onAuthSuccess(token, user);
    }, 700);
  };

  /**
   * EMAIL/PASSWORD LOGIN
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await api<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: {
          email: email.trim(),
          password,
        },
      });

      completeAuth(response.token, response.user);
    } catch (err) {
      setError(describeAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * SIGNUP
   */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (!college.trim()) {
      setError("Please enter your college.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await api<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: {
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          college: college.trim(),
          avatar: "",
        },
      });

      completeAuth(response.token, response.user);
    } catch (err) {
      setError(describeAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * REAL FIREBASE GOOGLE SIGN-IN
   */
  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;

    setError("");
    setSuccessMessage("");

    try {
      setIsSubmitting(true);

      /**
       * Firebase Google provider
       */
      const provider = new GoogleAuthProvider();

      /**
       * This forces Google account selection.
       */
      provider.setCustomParameters({
        prompt: "select_account",
      });

      /**
       * Opens REAL Google login popup
       */
      const result = await signInWithPopup(auth, provider);

      const firebaseUser = result.user;

      /**
       * Firebase ID token
       *
       * IMPORTANT:
       * This token should be verified by your backend.
       */
      const idToken = await firebaseUser.getIdToken();

      /**
       * Send Firebase token to our backend.
       *
       * Backend should verify this token using Firebase Admin SDK.
       */
      const response = await api<AuthResponse>("/api/auth/google", {
        method: "POST",
        body: {
          idToken,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        },
      });

      completeAuth(response.token, response.user);
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);

      if (err?.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled.");
        return;
      }

      if (err?.code === "auth/popup-blocked") {
        setError(
          "Google popup was blocked. Please allow popups for this website."
        );
        return;
      }

      if (err?.code === "auth/cancelled-popup-request") {
        return;
      }

      if (err?.code === "auth/unauthorized-domain") {
        setError(
          "This domain is not authorized in Firebase. Add it in Firebase Authentication → Settings → Authorized domains."
        );
        return;
      }

      if (err?.code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection.");
        return;
      }

      setError(describeAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Demo mode fallback
   *
   * Only used if demoMode is enabled.
   */
  const handleDemoLogin = () => {
    setError("");

    if (!demoMode) return;

    const demoUser =
      allUsers[0] ||
      ({
        id: "demo-user",
        name: "Demo User",
        email: "demo@squadup.dev",
        avatar: "",
        role: "Frontend Developer",
        college: "Demo College",
        location: "India",
        bio: "Demo SquadUP user",
        skills: ["React", "JavaScript", "TypeScript"],
        testResults: {},
        joinedAt: new Date().toISOString(),
        preferredDomains: [],
        lookingForTeam: true,
        xpPoints: 0,
        level: 1,
      } as User);

    completeAuth("local-dev-token", demoUser);
  };

  const switchMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));

    setError("");
    setSuccessMessage("");

    setName("");
    setEmail("");
    setPassword("");
    setCollege("");
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20 mb-5">
            <span className="text-2xl font-black">S</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to SquadUP
          </h1>

          <p className="text-gray-400 mt-2">
            {mode === "login"
              ? "Find teammates. Build projects. Grow together."
              : "Create your account and find your perfect team."}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Tabs */}
          <div className="grid grid-cols-2 bg-black/20 rounded-xl p-1 mb-7">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccessMessage("");
              }}
              className={`py-2.5 rounded-lg text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-white/10 text-white shadow"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
                setSuccessMessage("");
              }}
              className={`py-2.5 rounded-lg text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-white/10 text-white shadow"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleGoogleSignIn}
            className="w-full h-12 rounded-xl bg-white text-black flex items-center justify-center gap-3 font-semibold hover:bg-gray-100 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <GoogleIcon />
            )}

            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-white/10 flex-1" />

            <span className="text-xs text-gray-500 uppercase tracking-wider">
              or
            </span>

            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Form */}
          <form
            onSubmit={mode === "login" ? handleLogin : handleSignup}
            className="space-y-4"
          >
            {/* Name */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-12 rounded-xl bg-black/20 border border-white/10 pl-12 pr-4 outline-none focus:border-cyan-400/50 transition placeholder:text-gray-600"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full h-12 rounded-xl bg-black/20 border border-white/10 pl-12 pr-4 outline-none focus:border-cyan-400/50 transition placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  className="w-full h-12 rounded-xl bg-black/20 border border-white/10 pl-12 pr-12 outline-none focus:border-cyan-400/50 transition placeholder:text-gray-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {mode === "signup" && (
                <p className="text-xs text-gray-500 mt-2">
                  Password must contain at least 6 characters.
                </p>
              )}
            </div>

            {/* Signup fields */}
            {mode === "signup" && (
              <>
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Primary Role
                  </label>

                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />

                    <select
                      value={role}
                      onChange={(e) =>
                        setRole(e.target.value as UserRole)
                      }
                      className="w-full h-12 rounded-xl bg-black/20 border border-white/10 pl-12 pr-4 outline-none focus:border-cyan-400/50 transition text-white appearance-none"
                    >
                      {ROLES.map((item) => (
                        <option
                          key={item}
                          value={item}
                          className="bg-[#111827] text-white"
                        >
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* College */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    College / University
                  </label>

                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="Your college"
                      className="w-full h-12 rounded-xl bg-black/20 border border-white/10 pl-12 pr-4 outline-none focus:border-cyan-400/50 transition placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {mode === "login" ? "Login" : "Create Account"}

                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Switch */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              {mode === "login" ? "Sign up" : "Login"}
            </button>
          </p>

          {/* Demo */}
          {demoMode && (
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full mt-4 text-xs text-gray-500 hover:text-gray-300 transition"
            >
              Continue in Demo Mode
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-600">
          <MapPin className="w-3.5 h-3.5" />
          <span>Built for students & developers</span>
        </div>
      </div>
    </div>
  );
};

export { AuthView };