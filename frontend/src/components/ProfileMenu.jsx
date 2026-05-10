import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    position: "relative",
    fontFamily: "'DM Sans', sans-serif",
  },
  avatar: (open) => ({
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#EEEDFE",
    border: `1.5px solid ${open ? "#534AB7" : "#AFA9EC"}`,
    boxShadow: open ? "0 0 0 3px #EEEDFE" : "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "border-color 0.15s, transform 0.15s, box-shadow 0.15s",
    userSelect: "none",
    transform: open ? "scale(1.06)" : "scale(1)",
  }),
  initials: {
    fontSize: 12,
    fontWeight: 500,
    color: "#3C3489",
    letterSpacing: "0.3px",
  },
  dropdown: (open) => ({
    position: "absolute",
    right: 0,
    top: "calc(100% + 8px)",
    width: 200,
    background: "#fff",
    border: "0.5px solid rgba(0,0,0,0.15)",
    borderRadius: 12,
    overflow: "hidden",
    opacity: open ? 1 : 0,
    transform: open ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.97)",
    pointerEvents: open ? "auto" : "none",
    transition: "opacity 0.18s ease, transform 0.18s ease",
    zIndex: 100,
  }),
  header: {
    padding: "14px 16px 10px",
    borderBottom: "0.5px solid rgba(0,0,0,0.08)",
  },
  headerName: {
    fontSize: 13,
    fontWeight: 500,
    color: "#111",
  },
  headerEmail: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  section: {
    padding: "6px 0",
  },
  divider: {
    height: "0.5px",
    background: "rgba(0,0,0,0.08)",
    margin: "2px 0",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 16px",
    fontSize: 13,
    color: "#111",
    cursor: "pointer",
    transition: "background 0.1s",
  },
  itemAuth: {
    color: "#185FA5",
  },
  itemDanger: {
    color: "#A32D2D",
  },
};

const IconProfile = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="5" r="3" />
    <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
  </svg>
);

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M11 2H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
    <path d="M8 5v4M8 11h.01" strokeLinecap="round" />
  </svg>
);

const IconLogin = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10 8H3m0 0 2-2M3 8l2 2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 4V3a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1" strokeLinecap="round" />
  </svg>
);

const IconRegister = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6" />
    <path d="M8 5v6M5 8h6" strokeLinecap="round" />
  </svg>
);

const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3" strokeLinecap="round" />
    <path d="M10 11l3-3-3-3M13 8H6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function MenuItem({ icon, label, onClick, variant }) {
  const [hovered, setHovered] = useState(false);

  const variantStyle =
    variant === "auth"
      ? styles.itemAuth
      : variant === "danger"
      ? styles.itemDanger
      : {};

  return (
    <div
      style={{
        ...styles.item,
        ...variantStyle,
        background: hovered ? "rgba(0,0,0,0.04)" : "transparent",
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon}
      {label}
    </div>
  );
}

function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Read user and token from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!token && !!user;

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const goTo = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false);
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={styles.container} ref={containerRef}>
      <div style={styles.avatar(isOpen)} onClick={() => setIsOpen((prev) => !prev)}>
        <span style={styles.initials}>
          {isLoggedIn ? getInitials(user.name) : "?"}
        </span>
      </div>

      <div style={styles.dropdown(isOpen)}>

        {isLoggedIn ? (
          // ── Logged in ──────────────────────────────
          <>
            <div style={styles.header}>
              <div style={styles.headerName}>{user.name}</div>
              <div style={styles.headerEmail}>{user.email}</div>
            </div>

            <div style={styles.section}>
              <MenuItem icon={<IconProfile />} label="My Profile" onClick={() => goTo("/profile")} />
              <MenuItem icon={<IconEdit />} label="Edit Profile" onClick={() => goTo("/edit-profile")} />
            </div>

            <div style={styles.divider} />

            <div style={styles.section}>
              <MenuItem
                icon={<IconLogout />}
                label="Logout"
                variant="danger"
                onClick={handleLogout}
              />
            </div>
          </>
        ) : (
          // ── Not logged in ──────────────────────────
          <>
            <div style={styles.header}>
              <div style={styles.headerName}>Welcome!</div>
              <div style={styles.headerEmail}>Sign in to your account</div>
            </div>

            <div style={styles.section}>
              <MenuItem
                icon={<IconLogin />}
                label="Login"
                onClick={() => goTo("/auth")}
                variant="auth"
              />
              <MenuItem
                icon={<IconRegister />}
                label="Register"
                onClick={() => goTo("/auth")}
                variant="auth"
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default ProfileMenu;