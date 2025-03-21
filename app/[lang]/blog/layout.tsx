import Footer from '@/components/footer';
import Header from '@/components/header';
import { ReactNode } from 'react';
import styles from './blog.module.css';
import { languagesType } from '@/lib/i18n';

export default function BlogLayout({
  params,
  children,
}: {
  params: { lang: languagesType };
  children: ReactNode;
}) {
  return (
    <div className={`h-full ${styles.blog_layout}`}>
      <Header lang={params.lang} />
      <div className="custom-container min-h-screen">{children}</div>
      <Footer />
    </div>
  );
}
