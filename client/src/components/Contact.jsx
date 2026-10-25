import { useEffect, useRef, useState } from "react";

const TURNSTILE_SITE_KEY = window.__APP_CONFIG__?.turnstileSiteKey
    || import.meta.env.VITE_TURNSTILE_SITE_KEY
    || "";

const initialForm = {
    name: "",
    email: "",
    message: ""
};

export function Contact({ id }) {
    const [form, setForm] = useState(initialForm);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isSending, setIsSending] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState("");
    const turnstileRef = useRef(null);
    const turnstileWidgetId = useRef(null);

    useEffect(() => {
        let cancelled = false;
        let attempts = 0;

        const renderTurnstile = () => {
            if (cancelled || !TURNSTILE_SITE_KEY || !window.turnstile || !turnstileRef.current) return;

            turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
                sitekey: TURNSTILE_SITE_KEY,
                theme: "auto",
                callback: (token) => setTurnstileToken(token),
                "expired-callback": () => setTurnstileToken(""),
                "error-callback": () => setTurnstileToken("")
            });
        };

        const waitForTurnstile = () => {
            if (window.turnstile) renderTurnstile();
            else if (attempts < 50) {
                attempts += 1;
                window.setTimeout(waitForTurnstile, 100);
            }
        };

        waitForTurnstile();
        return () => { cancelled = true; };
    }, []);

    const handleChange = (event) => {
        setForm((currentForm) => ({
            ...currentForm,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!TURNSTILE_SITE_KEY || !turnstileToken) {
            setStatus({ type: "error", message: "Please complete the security check before sending." });
            return;
        }

        setIsSending(true);
        setStatus({ type: "", message: "" });

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, turnstileToken })
            });

            const responseText = await response.text();
            let result;

            try {
                result = JSON.parse(responseText);
            } catch {
                throw new Error(
                    "The email server is unavailable. Start the Node server and try again."
                );
            }

            if (!response.ok) {
                throw new Error(result.error || "Unable to send your message.");
            }

            setForm(initialForm);
            setTurnstileToken("");
            if (window.turnstile && turnstileWidgetId.current !== null) {
                window.turnstile.reset(turnstileWidgetId.current);
            }
            setStatus({
                type: "success",
                message: "Thanks! Your message has been sent."
            });
        } catch (error) {
            setStatus({
                type: "error",
                message: error.message || "Something went wrong. Please try again."
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <section id={id} className="w-[90%] max-w-6xl mx-auto px-2 sm:px-4 py-24 sm:py-32">
            <div className="mb-10">
                <p className="text-secondary mb-3">Get in touch</p>
                <h2 className="text-3xl sm:text-4xl font-space font-bold">Contact Me</h2>
                <p className="text-text-muted mt-4 max-w-2xl">
                    Have a project in mind or want to say hello? Send me a message and I&apos;ll get back to you.
                </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] items-start">
                <div className="space-y-6">
                    <div>
                        <h3 className="font-space text-xl font-bold mb-3">Find me online</h3>
                        <p className="text-text-muted">
                            You can also connect with me through my professional profiles.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <a
                            href="https://github.com/Brr-bry"
                            target="_blank"
                            rel="noreferrer"
                            className="border border-border px-5 py-3 rounded transition-colors hover:border-secondary hover:text-secondary"
                        >
                            GitHub ↗
                        </a>
                        <a
                            href="https://www.linkedin.com/in/john-bryan-ponce-b5975a43b/"
                            target="_blank"
                            rel="noreferrer"
                            className="border border-border px-5 py-3 rounded transition-colors hover:border-secondary hover:text-secondary"
                        >
                            LinkedIn ↗
                        </a>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <label htmlFor="website" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                        Leave this field empty
                        <input
                            id="website"
                            type="text"
                            name="website"
                            tabIndex="-1"
                            autoComplete="off"
                            value={form.website || ""}
                            onChange={handleChange}
                        />
                    </label>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                            <span className="block mb-2">Name</span>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                maxLength={100}
                                className="w-full rounded border border-border bg-bg-light px-4 py-3 outline-none transition-colors focus:border-secondary"
                            />
                        </label>
                        <label className="block">
                            <span className="block mb-2">Email</span>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                maxLength={254}
                                className="w-full rounded border border-border bg-bg-light px-4 py-3 outline-none transition-colors focus:border-secondary"
                            />
                        </label>
                    </div>

                    <label className="block">
                        <span className="block mb-2">Message</span>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            minLength={10}
                            maxLength={5000}
                            rows={6}
                            className="w-full resize-y rounded border border-border bg-bg-light px-4 py-3 outline-none transition-colors focus:border-secondary"
                        />
                    </label>

                    <div ref={turnstileRef} aria-label="Security verification" />

                    <button
                        type="submit"
                        disabled={isSending}
                        className="rounded bg-primary px-6 py-3 text-bg-dark font-bold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSending ? "Sending..." : "Send Message"}
                    </button>

                    {status.message && (
                        <p className={status.type === "success" ? "text-success" : "text-danger"} role="status">
                            {status.message}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}
