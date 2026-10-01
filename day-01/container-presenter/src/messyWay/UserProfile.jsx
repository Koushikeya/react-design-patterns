import { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`
      );
      setUser(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        bio: response.data.bio,
      });
    } catch (err) {
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}/posts`
      );
      setPosts(response.data);
    } catch (err) {
      console.error("Failed to fetch posts");
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`,
        formData
      );
      setUser(response.data);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Loading profile…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-8 text-center max-w-sm mx-4 shadow-xl">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-red-400 font-semibold text-lg mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={fetchUserData}
            className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Profile Card ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">

          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />

          {/* Avatar + Info */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-5">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt={`${user.name}'s avatar`}
                className="w-24 h-24 rounded-full border-4 border-gray-900 object-cover shadow-lg"
              />
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-sm px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer"
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-2">
                <h1 className="text-white text-2xl font-bold tracking-tight">
                  {user.name}
                </h1>
                <p className="text-violet-400 text-sm">{user.email}</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {user.bio}
                </p>

                {/* Stats */}
                <div className="flex gap-6 pt-3">
                  <div className="text-center">
                    <p className="text-white font-bold">{user.followers?.toLocaleString() ?? "—"}</p>
                    <p className="text-gray-500 text-xs">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold">{user.following?.toLocaleString() ?? "—"}</p>
                    <p className="text-gray-500 text-xs">Following</p>
                  </div>
                  {user.location && (
                    <div className="text-center">
                      <p className="text-white font-bold text-sm">{user.location}</p>
                      <p className="text-gray-500 text-xs">Location</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Edit Form */
              <div className="space-y-3">
                <h2 className="text-white font-semibold text-lg mb-4">Edit Profile</h2>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Name"
                  className="w-full bg-gray-800 border border-gray-700 focus:border-violet-500 focus:outline-none text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm transition-colors"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email"
                  className="w-full bg-gray-800 border border-gray-700 focus:border-violet-500 focus:outline-none text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm transition-colors"
                />
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Bio"
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-violet-500 focus:outline-none text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm transition-colors resize-none"
                />
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Posts Section ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-white font-semibold text-lg">
              Recent Posts
            </h2>
            <span className="bg-violet-500/20 text-violet-300 text-xs font-semibold px-3 py-1 rounded-full">
              {posts.length} posts
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
              <p className="text-gray-500 text-sm">No posts yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-900 border border-gray-800 hover:border-violet-500/40 rounded-2xl p-5 transition-all duration-200 group"
              >
                <h3 className="text-white font-semibold text-base mb-2 group-hover:text-violet-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  {post.content.substring(0, 150)}…
                </p>
                <span className="text-gray-600 text-xs">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;