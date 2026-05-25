import type { languagesType } from '@/lib/i18n';
import { getAppStoreDefinition } from '../app-store-seo';

interface AppStoreDefinitionProps {
  lang: languagesType;
}

export default function AppStoreDefinition({ lang }: AppStoreDefinitionProps) {
  const definition = getAppStoreDefinition(lang);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:p-10">
        <p className="text-sm font-medium tracking-[0.18em] text-[#69a3ff] uppercase">
          Sealos App Store
        </p>
        <h2 className="mt-4 text-2xl leading-tight font-semibold text-white sm:text-3xl">
          {definition.title}
        </h2>
        <p className="mt-5 max-w-4xl text-base leading-7 text-zinc-400">
          {definition.body}
        </p>
      </div>
    </section>
  );
}
