import { useEffect, useRef, useState } from "react";

import computerIMG from "../assets/computer.png";

export function About() {

    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {

        const observer = new IntersectionObserver(
            ([entry]) => {

                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }

            },
            {
                threshold: 0.2,
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();

    }, []);

    return (
        <section
            
                id="about"
            ref={sectionRef}
            className={`
                transition-all
                duration-700
                ${
                    isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-20"
                }
            `}
        >

            <div
                className="
                    w-[90%]
                    max-w-6xl
                    mx-auto
                    py-24
                    sm:py-32
                    lg:py-40
                    flex
                    flex-col
                    lg:flex-row
                    items-center
                    gap-12
                    lg:gap-20
                    text-text
                "
            >

                {/* Text */}
                <div
                    className="
                        w-full
                        lg:w-1/2
                        p-6
                        sm:p-8
                        lg:p-10
                        bg-bg-light
                        border
                        border-b-highlight
                        border-x-highlight
                        rounded-3xl
                        sm:rounded-4xl
                        flex
                        flex-col
                        text-left
                    "
                >

                    <span
                        className="
                            mb-5
                            font-space
                            font-bold
                            text-[clamp(1.75rem,4vw,2.5rem)]
                        "
                    >
                        |About Me
                    </span>

                    <span
                        className="
                            text-[clamp(1rem,1.5vw,1.125rem)]
                            leading-relaxed
                            text-muted
                        "
                    >
                        I’m John Bryan Ponce, a BSIT student at the University
                        of San Carlos who enjoys building web applications and
                        turning ideas into practical solutions. I’m constantly
                        learning through projects and hands-on experience as I
                        work toward becoming a Full-Stack Web Developer.
                    </span>

                </div>

                {/* Image */}
                <div className="w-full lg:w-1/2 flex justify-center">

                    <img
                        className="
                            w-[70%]
                            sm:w-[60%]
                            lg:w-full
                            max-w-lg
                            drop-shadow-xl/50
                        "
                        src={computerIMG}
                        alt="Computer"
                    />

                </div>

            </div>

        </section>
    );
}