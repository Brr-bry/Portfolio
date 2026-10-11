import { useState } from "react";

export function Navbar({ isDark, setIsDark }) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleDarkMode = () => {
        setIsDark((prev) => !prev);
    };

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <nav className="z-49 fixed top-0 left-0 w-full bg-bg text-text">

            <div className="w-[90%] max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-5">

                <div className="flex items-center justify-between">

                    <a
                        href="#"
                        className="text-3xl sm:text-4xl md:text-5xl font-space font-bold"
                    >
                        Bry;
                    </a>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-8">

                        <ul className="flex items-center gap-6 lg:gap-8">

                            <li>
                                <a
                                    href="#about"
                                    className="transition-colors hover:text-secondary"
                                >
                                    About
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#skills"
                                    className="transition-colors hover:text-secondary"
                                >
                                    Skills
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#works"
                                    className="transition-colors hover:text-secondary"
                                >
                                    Works
                                </a>
                            </li>

                        </ul>

                        <button
                            onClick={toggleDarkMode}
                            className="h-[30px] w-[30px] rounded text-xl cursor-pointer transition-colors hover:text-secondary"
                            aria-label="Toggle dark mode"
                        >
                            {isDark ? "☀" : "☾"}
                        </button>

                    </div>

                    {/* Mobile */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-2xl cursor-pointer"
                        aria-label="Toggle navigation menu"
                    >
                        {isMenuOpen ? "✕" : "☰"}
                    </button>

                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-5 pb-3">

                        <ul className="flex flex-col gap-5">

                            <li>
                                <a
                                    href="#about"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block transition-colors hover:text-secondary"
                                >
                                    About
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#skills"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block transition-colors hover:text-secondary"
                                >
                                    Skills
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#works"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block transition-colors hover:text-secondary"
                                >
                                    Works
                                </a>
                            </li>

                            <li>
                                <button
                                    onClick={toggleDarkMode}
                                    className="text-xl cursor-pointer transition-colors hover:text-secondary"
                                    aria-label="Toggle dark mode"
                                >
                                    {isDark ? "☀" : "☾"}
                                </button>
                            </li>

                        </ul>

                    </div>
                )}

            </div>
        </nav>
    );
}