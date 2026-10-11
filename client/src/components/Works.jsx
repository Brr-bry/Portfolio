import { useEffect, useState } from "react";
import { getRepositories, getReadme } from "../services/githubAPI.js";

const README_LENGTH = 250;

export function Works() {
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchRepositories() {
            try {
                const repos = await getRepositories();

                const reposWithReadmes = await Promise.all(
                    repos.map(async (repo) => {
                        const readme = await getReadme(
                            repo.owner.login,
                            repo.name
                        );

                        return {
                            ...repo,
                            readme,
                        };
                    })
                );

                setRepositories(reposWithReadmes);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchRepositories();
    }, []);

    return (
        <section
            id="works"
            className=" scrollbar-custom min-h-screen text-text flex flex-col justify-center"
        >
            <div className="w-[90%] max-w-6xl mx-auto">

                <h2 className="font-space font-bold text-[clamp(2rem,4vw,3rem)] mb-10">
                    |Works
                </h2>

                <div
                    className="
                        bg-bg-light
                        border
                        border-x-highlight
                        border-b-highlight
                        rounded-4xl
                        p-6
                        h-[500px]
                        overflow-y-auto
                    "
                >

                    {loading && (
                        <p className="text-muted">
                            Loading repositories...
                        </p>
                    )}

                    {error && (
                        <p className="text-red-400">
                            Failed to load repositories.
                        </p>
                    )}

                    {!loading && !error && (
                        <div className="flex flex-col gap-5">

                            {repositories.map((repo) => {
                                const isLong =
                                    repo.readme.length > README_LENGTH;

                                const preview = repo.readme
                                    .slice(0, README_LENGTH)
                                    .replace(/\s+/g, " ")
                                    .trim();

                                return (
                                    <div
                                        key={repo.id}
                                        className="
                                            p-6
                                            rounded-2xl
                                            border
                                            border-x-highlight
                                            border-b-highlight
                                            bg-bg-dark
                                            flex
                                            flex-col
                                            gap-4
                                        "
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                            <h3 className="font-space font-bold text-xl sm:text-2xl break-all">
                                                {repo.name}
                                            </h3>

                                            <span className="text-muted text-sm whitespace-nowrap">
                                                {new Date(
                                                    repo.created_at
                                                ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    }
                                                )}
                                            </span>

                                        </div>

                                        <p className="text-muted leading-relaxed">
                                            {preview || "No README available."}
                                            {isLong && "..."}
                                        </p>

                                        <a
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                                                self-start
                                                px-5
                                                py-2
                                                rounded-xl
                                                bg-highlight
                                                text-text
                                                transition-all
                                                duration-300
                                                hover:opacity-80
                                            "
                                        >
                                            View Repository
                                        </a>
                                    </div>
                                );
                            })}

                        </div>
                    )}

                </div>

            </div>
        </section>
    );
}