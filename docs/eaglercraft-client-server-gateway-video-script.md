# D04: Eaglercraft Client, Server, and WebSocket Gateway Explained

**Target length:** 60–90 seconds

**[0:00–0:12]**

An Eaglercraft deployment has four connected parts: the Browser Client opens the Client Website, the Eaglercraft Gateway carries the WebSocket session, the Game Server owns the world, and the Persistent World keeps progress on durable storage.

**[0:12–0:28]**

Remember the three addresses. Open the **Browser Play Link** in a browser. Paste the `wss://` **WebSocket Server Address** into an existing compatible client's Multiplayer field. Use HTTPS `/admin` for the **Server Management Panel**.

**[0:28–0:46]**

The Sealos template packages the Client Website, Gateway, selected Paper Game Server, Server Management Panel, and Persistent World volume in one deployment. Wait for Paper readiness, use **Join game**, and invite friends with the Browser Play Link.

**[0:46–1:04]**

Choose the path that matches your control needs. Sealos supplies the application surface. Ubuntu VPS gives direct service and Caddy control. Docker Compose gives a reproducible image and bind-mounted data. A Shared World fits a temporary session.

**[1:04–1:18]**

For your own domain, point DNS to the public host and let Caddy route HTTPS and WSS to the Gateway. Keep the Game Server and management panel on private listeners while you verify the path.

**[1:18–1:28]**

Read the full architecture guide, then [deploy the Eaglercraft template](https://sealos.io/products/app-store/eaglercraft-server/) on Sealos.
