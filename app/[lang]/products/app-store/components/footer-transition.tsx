import Image from 'next/image';
import BottomLightImage from '@/assets/bottom-light.svg';

export default function FooterTransition() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mt-20 h-[520px] overflow-hidden md:h-[640px]"
    >
      <Image
        src={BottomLightImage}
        alt=""
        fill
        sizes="100vw"
        className="object-cover select-none"
      />
    </div>
  );
}
