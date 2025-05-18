import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, signOut }) => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h1>フォームビルダー</h1>
        </Link>
      </div>
      <div className="header-right">
        {user && (
          <>
            <div className="user-info">
              {user.attributes.email}
            </div>
            <button onClick={signOut} className="button">
              サインアウト
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
