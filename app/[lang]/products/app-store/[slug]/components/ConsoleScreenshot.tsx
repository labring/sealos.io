import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import { eaglercraftConfig } from '@/config/eaglercraft';
import g from './eaglercraft.module.css';

export default function ConsoleScreenshot() {
  return (
    <figure className={g.console}>
      <div className={g.consoleToolbar}>
        <a
          href={eaglercraftConfig.consoleImage}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open full-size admin console screenshot"
        >
          <Maximize2 className={g.zoomIcon} size={18} aria-hidden="true" />
        </a>
      </div>
      <div className={g.consoleViewport} tabIndex={0} aria-describedby="console-caption">
        <Image
          src={eaglercraftConfig.consoleImage}
          width={3840}
          height={2160}
          sizes="(max-width: 800px) 100vw, 1200px"
          alt="Sealos deployment admin console showing Paper is ready, the WebSocket address, Join game, and a connected player"
        />
      </div>
      <figcaption id="console-caption">
        Template-maintainer screenshot of a Sealos deployment, supplied with the
        template documentation. On small screens, scroll the image horizontally
        or open it at full size to inspect the controls.
      </figcaption>
    </figure>
  );
}
