import { ReactNode } from 'react';

interface BlogContainerProps {
  children: ReactNode;
}

export default function BlogContainer({ children }: BlogContainerProps) {
  return (
    <main className="mx-8 flex flex-1 flex-col pb-20 md:mx-[15%]">
      {children}
    </main>
  );
}
