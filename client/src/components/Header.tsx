import { useState } from "react";
import { isAuthenticated, removeToken, getUser } from "../utils/auth.js";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

interface HeaderProps {
  remainingCooldownTime: number;
}

const Header: React.FC<HeaderProps> = ({ remainingCooldownTime }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const user = getUser();

  const handleLogout = () => {
    removeToken();
    window.location.reload();
  };

  return (
    <header>
      <div className="header-content">
        <h1>Pixel Party</h1>
        <div>
          {isAuthenticated() ? (
            <div className="user-info">
              <span className="username">Welcome, {user?.username}</span>
              {remainingCooldownTime > 0 && (
                <span> Cooldown: {remainingCooldownTime}s</span>
              )}
              <button onClick={handleLogout}>Log Out</button>
            </div>
          ) : (
            <>
              <button onClick={() => setShowLoginModal(true)}>Log In</button>
              <button onClick={() => setShowSignupModal(true)}>Sign Up</button>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />
    </header>
  );
};

export default Header;
