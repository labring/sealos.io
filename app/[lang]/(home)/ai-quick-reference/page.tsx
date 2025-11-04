import { GradientText } from '../(new-home)/components/GradientText';
import { FAQPageClient } from './components/FAQPageClient';

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function AiFaqPage({ params }: PageProps) {
  const { lang } = await params;
  const langPrefix = `/${lang}`;

  return (
    <>
      <section className="container -mt-24 pt-44 pb-14">
        <h1
          aria-label="Frequently Asked Questions"
          className="mb-4 text-center text-4xl font-medium"
        >
          <span>Frequently Asked </span>
          <GradientText>Questions</GradientText>
        </h1>
        <p className="text-center text-zinc-400">
          Find answers to common questions about Sealos
        </p>

        <FAQPageClient lang={lang} langPrefix={langPrefix} />
      </section>
    </>
  );
}
