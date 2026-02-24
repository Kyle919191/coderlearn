import {Link, useLocation} from "react-router-dom";

const navLinks = [
    {to: "/", label: "Home"},
    { to: "/dashboard", label: "Dashboard" },
    { to: "/login", label: "Sign in" },
];

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
            <span className="text-xl font-bold">CoderLearn</span>
            <div className="flex gap-6">
                {navLinks.map((link) => ( //iterate through each navLink
                    <Link //creates a clickable link
                    key={link.to} // lets react keep track of the link
                    to={link.to} // the link's destination: /, /dashboard, /login
                    className={`text-sm transition-colors ${
              location.pathname === link.to
                ? "text-indigo-400 font-semibold"
                : "text-gray-300 hover:text-white" // if we're currently inside the link, it's indigo, otherwise it's gray
            }`}
            >
                {link.label} // the link visually is home, dashboard, or sign in
            </Link>
        ))}
    </div>
</nav>
);
}