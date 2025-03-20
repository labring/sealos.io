import Footer from '@/components/footer';
import Header from '@/components/header';
import { ReactNode } from 'react';
import styles from './index.module.css';

export default function BlogLayout({
  params,
  children,
}: {
  params: { lang: string };
  children: ReactNode;
}) {
  return (
    <div className={`h-full ${styles.blog_layout}`}>
      <Header lang={params.lang} />
      <div className="custom-container md:px-[15%]min-h-screen dark:prose-invert prose px-8 pt-36">
        {children}
      </div>
      <Footer />
    </div>
  );
}
