import { useEffect, useState } from 'react';

import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';

import { Works } from './components/Works';
import { Contact } from './components/Contact';

import "./index.css";

function App() {

    const [isLoaded, setIsLoaded] = useState(false);

    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    // Save dark mode whenever it changes
    useEffect(() => {
        localStorage.setItem("darkMode", isDark);

        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    return (
        <>
            {!isLoaded && (
                <LoadingScreen
                    onComplete={() => setIsLoaded(true)}
                />
            )}

            <div
                className={`
                    min-h-screen
                    transition-opacity
                    duration-1000
                    ${isLoaded ? "opacity-100" : "opacity-0"}
                    bg-bg-dark
                    text-text
                `}
            >
                <Navbar

                    isDark={isDark}
                    setIsDark={setIsDark}
                />

                <Hero   isLoaded={isLoaded} />
                <About id='about'/>

                <Skills id='skills'/>

                <Works id='works'/>

                <Contact id='contact'/>
            </div>
        </>
    );
}

export default App;
