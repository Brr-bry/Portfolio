const skills = [
    { name: "PHP", icon: "devicon-php-plain" },
    { name: "MySQL", icon: "devicon-mysql-original" },
    { name: "JavaScript", icon: "devicon-javascript-plain" },
    { name: "HTML", icon: "devicon-html5-plain" },
    { name: "CSS", icon: "devicon-css3-plain" },
    { name: "Tailwind", icon: "devicon-tailwindcss-original" },
    { name: "React", icon: "devicon-react-original" },
    { name: "Node.js", icon: "devicon-nodejs-plain" },
    { name: "Express", icon: "devicon-express-original" },
    { name: "Java", icon: "devicon-java-plain" },
];

export function Skills() {
    return (
        <section
            id="skills"
            className="min-h-screen text-text flex flex-col justify-center"
        >
            <div className="w-[90%] max-w-6xl mx-auto">

                <h2 className="font-space font-bold text-[clamp(2rem,4vw,3rem)] mb-12">
                    |Skills
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-6">
                    {skills.map((skill) => (
                        <div
                            key={skill.name}
                            className="
                                py-2
                    
                                aspect-square
                                bg-bg-light
                                border
                                border-x-highlight
                                border-b-highlight
                                rounded-2xl
                                flex
                                flex-col
                                items-center
                                justify-center
                                gap-3
                                transition-all
                                duration-300
                                hover:-translate-y-2
                                hover:bg-bg
                            "
                        >
                            <i className={`${skill.icon} text-5xl sm:text-6xl`}></i>

                            <span className="text-sm sm:text-base text-muted">
                                {skill.name}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}