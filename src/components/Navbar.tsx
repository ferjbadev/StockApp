
const Navbar = () => {
    return (
        <div className="navbar bg-blue-600">
            <div className="navbar-start">
                <div className="dropdown">
                    {/* Menu desplegable */}
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg
                            className="h-10 w-10"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </div>
                    <ul
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a>Home</a></li>
                        <li><a>Contact</a></li>
                        <li><a>About us</a></li>
                    </ul>
                </div>
            </div>
            {/* Logotipo */}
            <div className="navbar-center">
                <a className="btn btn-ghost text-white text-5xl">Digitall Zone</a>
            </div>
            <div className="navbar-end">
            </div>
        </div>
    )
}

export default Navbar