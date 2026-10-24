require("dotenv").config();

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 20261;
const HOST = "0.0.0.0";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const CONTACT_EMAIL = "poncejohn143@gmail.com";

const distPath = path.join(__dirname, "client", "dist");

const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2"
};

function readRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;

            if (body.length > 100000) {
                reject(new Error("Request body is too large."));
                req.destroy();
            }
        });

        req.on("end", () => resolve(body));
        req.on("error", reject);
    });
}

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const server = http.createServer((req, res) => {

    let requestPath = decodeURIComponent(req.url.split("?")[0]);

    // Contact form email API
    if (requestPath === "/api/contact" && req.method === "POST") {
        readRequestBody(req)
            .then(async (body) => {
                if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
                    res.writeHead(503, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Email service is not configured." }));
                    return;
                }

                let form;

                try {
                    form = JSON.parse(body);
                } catch {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid request." }));
                    return;
                }

                const name = typeof form.name === "string" ? form.name.trim() : "";
                const email = typeof form.email === "string" ? form.email.trim() : "";
                const message = typeof form.message === "string" ? form.message.trim() : "";
                const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

                if (!name || name.length > 100 || !emailIsValid || message.length < 10 || message.length > 5000) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Please provide a valid name, email, and message." }));
                    return;
                }

                const resendResponse = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${RESEND_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        from: RESEND_FROM_EMAIL,
                        to: [CONTACT_EMAIL],
                        reply_to: email,
                        subject: `Portfolio message from ${name}`,
                        html: `<h2>New portfolio message</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`
                    })
                });

                if (!resendResponse.ok) {
                    console.error("Resend request failed:", await resendResponse.text());
                    res.writeHead(502, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Unable to send your message right now." }));
                    return;
                }

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true }));
            })
            .catch((error) => {
                console.error("Contact form request failed:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Unable to process your message." }));
            });

        return;
    }

    // GitHub repositories API
    if (requestPath === "/api/github/repos") {

        fetch(
            "https://api.github.com/users/Brr-bry/repos?sort=created&direction=desc&per_page=20",
            {
                headers: {
                    "Accept": "application/vnd.github+json",
                    "Authorization": `Bearer ${GITHUB_TOKEN}`,
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            }
        )
            .then(async (response) => {

                const data = await response.json();

                console.log("GitHub status:", response.status);

                if (!response.ok) {
                    console.log("GitHub error:", data);
                }

                res.writeHead(response.status, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify(data));
            })
            .catch((error) => {

                console.error("GitHub request failed:", error);

                res.writeHead(500, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    error: "Failed to connect to GitHub"
                }));
            });

        return;
    }

    // Serve React application
    if (requestPath === "/") {
        requestPath = "/index.html";
    }

    const filePath = path.join(distPath, requestPath);

    if (!filePath.startsWith(distPath)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.stat(filePath, (error, stats) => {

        if (!error && stats.isFile()) {

            const extension = path.extname(filePath);
            const contentType =
                mimeTypes[extension] || "application/octet-stream";

            res.writeHead(200, {
                "Content-Type": contentType
            });

            fs.createReadStream(filePath).pipe(res);

            return;
        }

        const indexPath = path.join(distPath, "index.html");

        fs.readFile(indexPath, (error, data) => {

            if (error) {
                res.writeHead(500);
                res.end("Server error");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Portfolio running on port ${PORT}`);
    console.log(
        `GitHub token: ${GITHUB_TOKEN ? "FOUND" : "MISSING"}`
    );
});
