---
status: accepted
---

# Keep scenario deployment assets in the runtime repo

Runnable scenario assets — the files a reader actually deploys, such as
Compose files, overlay files, environment examples, and reference configs —
live in the runtime implementation repository next to the code they run
(`deploy/docker-compose/` in yangchuansheng/eaglerXserver), versioned with
the release that must satisfy them. The tutorial embeds the key files in
full and links the directory for the rest, so a reader can copy from the
article or clone the maintained source, while the site stays a publishing
surface that holds content, verification records, and raw evidence.
