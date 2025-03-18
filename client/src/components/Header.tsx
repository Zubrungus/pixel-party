import { isAuthenticated } from '../utils/auth.js';

const Header = () => {
    return (
        <header>
            <div className="">
                <h1>Pixel Party</h1>
                <div>
                    {isAuthenticated() ? (
                        <button>Log Out</button>
                    ) : (
                        <>
                            <button>Log In</button>
                            <button>Sign Up</button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;