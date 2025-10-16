'use client';

interface TestimonialProps {
  avatar: string;
  name: string;
  quote: string;
}

function Testimonial({ avatar, name, quote }: TestimonialProps) {
  return (
    <div
      className="testimonial-content"
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src={avatar}
          alt={name}
          style={{ width: '36px', height: '36px', borderRadius: '36px', objectFit: 'cover', aspectRatio: '1 / 1' }}
        />
        <h4
          style={{
            color: 'var(--tailwind-colors-zinc-200, #E4E4E7)',
            fontFamily: 'var(--typography-font-family-font-sans, Geist)',
            fontSize: 'var(--typography-base-sizes-large-font-size, 18px)',
            fontStyle: 'normal',
            fontWeight: 'var(--font-weight-medium, 500)',
            lineHeight: 'var(--typography-base-sizes-large-line-height, 28px)',
            alignSelf: 'stretch',
            margin: 0
          }}
        >
          {name}
        </h4>
      </div>
      <p
        style={{
          alignSelf: 'stretch',
          color: 'var(--tailwind-colors-zinc-400, #A1A1AA)',
          fontFamily: 'var(--typography-font-family-font-sans, Geist)',
          fontSize: 'var(--typography-base-sizes-small-font-size, 14px)',
          fontStyle: 'normal',
          fontWeight: 'var(--font-weight-normal, 400)',
          lineHeight: 'var(--typography-base-sizes-small-line-height, 20px)',
          margin: 0
        }}
      >
        {`"${quote}"`}
      </p>
    </div>
  );
}

interface FeatureProps {
  title: string;
  description: string;
}

function Feature({ title, description }: FeatureProps) {
  return (
    <div className="mb-12">
      <div className="feature-container">
        <h3 className="feature-title">
          {title}
        </h3>
        <p className="feature-description">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function WhySourceAvailableMatters() {
  const features = [
    {
      title: "Transparency",
      description: "Audit our code, understand our architecture, and verify our security practices."
    },
    {
      title: "Community",
      description: "Contribute features, report bugs, and shape the future of cloud development."
    },
    {
      title: "Trust",
      description: "No vendor lock-in, no hidden agendas. Just reliable software you can depend on."
    }
  ];

  const testimonials = [
    {
      avatar: "https://randomuser.me/api/portraits/thumb/men/75.jpg",
      name: "Tom Dörr",
      quote: "Sealos is a game-changer. It eliminates the steep learning curve of complicated cloud services, allowing me to focus on what truly matters: deploying projects safely and quickly."
    },
    {
      avatar: "https://randomuser.me/api/portraits/thumb/men/33.jpg",
      name: "Fakhr",
      quote: "Sealos is a user-friendly cloud OS that simplifies cloud-native infrastructure management. Ideal for developers and teams, it streamlines app deployment, self-hosted services, and SaaS platform building—no deep DevOps or Kubernetes knowledge needed."
    },
    {
      avatar: "https://randomuser.me/api/portraits/thumb/men/42.jpg",
      name: "David Kuro",
      quote: "For new coders like me, Sealos is a great alternative to the complicated cloud. It saves a ton of learning time and gets things deployed safely and quickly. I'm happy to pay for it."
    },
    {
      avatar: "https://randomuser.me/api/portraits/thumb/men/24.jpg",
      name: "Alamin",
      quote: "RIP complexity. Sealos just replaced it all."
    }
  ];

  return (
    <div className="bg-black pt-0 pb-20 mt-[104px]">
      <div className="w-full px-0">
        {/* Two-column wrapper with fixed overall height */}
        <div className="wsam-wrapper">
          {/* Left Column - Features block (title + 3 rows) as one component */}
          <div className="wsam-left">
            {/* Local title for the left column */}
            <h2
              className="wsam-title text-left mb-16"
              style={{
                color: '#FFF',
                fontFamily: 'var(--typography-font-family-font-sans, Geist)',
                fontSize: 'var(--typography-base-sizes-3x-large-font-size, 30px)',
                fontStyle: 'normal',
                fontWeight: 'var(--font-weight-medium, 500)',
                lineHeight: '100%'
              }}
            >
              Why Source Available Matters
            </h2>

            <div className="space-y-0">
              <Feature title="Transparency" description="Audit our code, understand our architecture, and verify our security practices." />
              <Feature title="Community" description="Contribute features, report bugs, and shape the future of cloud development." />
              <Feature title="Trust" description="No vendor lock-in, no hidden agendas. Just reliable software you can depend on." />
            </div>
          </div>

          {/* Right Column - Testimonials */}
          <div className="wsam-right" style={{ position: 'relative', flexShrink: 0, borderTopLeftRadius: '24px', overflow: 'hidden' }}>
            {/* One continuous rounded border (all sides) to keep stroke uniform */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '24px 0 0 0',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderImageSource:
                  'linear-gradient(153.43deg, rgba(255, 255, 255, 0.3) 0%, rgba(0, 0, 0, 0.3) 83.33%)',
                borderImageSlice: 1,
                zIndex: 3,
                pointerEvents: 'none'
              }}
            />
            {/* Masks to hide right/bottom edges (simulate transparent sides) */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '1px', height: '100%', background: 'black', zIndex: 4, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '1px', background: 'black', zIndex: 4, pointerEvents: 'none' }} />

            {/* Inner dividers (absolute) */}
            {/* 1) Horizontal left half */}
            <div
              style={{
                position: 'absolute',
                top: '45.588%',
                left: 0,
                width: '50%',
                height: '0px',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                zIndex: 2
              }}
            />
            {/* 2) Horizontal right half */}
            <div
              style={{
                position: 'absolute',
                top: '63.398%',
                left: '50%',
                width: '50%',
                height: '0px',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                zIndex: 2
              }}
            />
            {/* 3) Vertical middle line with gradient */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                width: '0px',
                height: '100%',
                borderLeft: '1px solid',
                borderImageSource:
                  'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%)',
                borderImageSlice: 1,
                zIndex: 2
              }}
            />

             {/* Testimonial 1 - Top Left */}
             <div className="wsam-testimonial-1" style={{ position: 'absolute', top: '62.7px', zIndex: 1 }}>
              <Testimonial
                avatar={"/images/faces/lt.png"}
                 name={"Tom Dörr"}
                 quote={"Sealos is a game-changer. It eliminates the steep learning curve of complicated cloud services, allowing me to focus on what truly matters: deploying projects safely and quickly."}
               />
             </div>

            {/* Testimonial 2 - Top Right */}
            <div className="wsam-testimonial-2" style={{ position: 'absolute', zIndex: 1 }}>
               <Testimonial
                avatar={"/images/faces/rt.png"}
                 name={"Fakhr"}
                 quote={"Sealos is a user-friendly cloud OS that simplifies cloud-native infrastructure management. Ideal for developers and teams, it streamlines app deployment, self-hosted services, and SaaS platform building—no deep DevOps or Kubernetes knowledge needed."}
               />
             </div>

            {/* Testimonial 3 - Bottom Left */}
            <div className="wsam-testimonial-3" style={{ position: 'absolute', zIndex: 1 }}>
               <Testimonial
                avatar={"/images/faces/lb.png"}
                 name={"David Kuro"}
                 quote={"For new coders like me, Sealos is a great alternative to the complicated cloud. It saves a ton of learning time and gets things deployed safely and quickly. I'm happy to pay for it."}
               />
             </div>

            {/* Testimonial 4 - Bottom Right */}
            <div className="wsam-testimonial-4" style={{ position: 'absolute', zIndex: 1 }}>
               <Testimonial
                avatar={"/images/faces/rb.png"}
                 name={"Alamin"}
                 quote={"RIP complexity. Sealos just replaced it all."}
               />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
