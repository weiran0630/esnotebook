import React from "react";

const Header: React.FC = () => {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <div className="navbar-item">
          <strong style={{ fontSize: "2rem" }}>
            esNotebook{" "}
            <span style={{ fontSize: "0.7rem" }}>
              @0.1.0 Open Source Web-driven JSX & Markdown Editor
            </span>
          </strong>
        </div>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start"></div>
      </div>

      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            <a className="button is-light" href="https://github.com/weiran0630">
              <span className="icon">
                <i className="fab fa-github"></i>
              </span>
              <strong>Github</strong>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
