export default function LogoutButton({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem("siteAccess");
    onLogout();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
    >
      Logout
    </button>
  );
}
