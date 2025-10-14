export function Glare(
  props: React.DetailedHTMLProps<
    React.SVGAttributes<SVGSVGElement>,
    SVGSVGElement
  >,
) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
      <g
        style={{
          mixBlendMode: 'color-dodge',
        }}
        transform="scale(1.0065 .99346) rotate(45 13.13 141.265)"
      >
        <path fill="#000" d="M0 0h10.554v101.321H0z" />
        <ellipse cx={5.277} cy={50.66} fill="url(#a)" rx={5.277} ry={50.66} />
      </g>
      <g
        style={{
          mixBlendMode: 'color-dodge',
        }}
        transform="scale(1.0065 .99346) rotate(-45 63.791 -18.96)"
      >
        <path fill="#000" d="M0 0h10.554v101.321H0z" />
        <ellipse cx={5.277} cy={50.66} fill="url(#b)" rx={5.277} ry={50.66} />
      </g>
      <defs>
        <radialGradient
          id="a"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(0 50.6604 -5.27712 0 5.277 50.66)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.036} stopColor="#FFF1E4" />
          <stop offset={1} stopColor="#3A71FF" stopOpacity={0} />
        </radialGradient>
        <radialGradient
          id="b"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(0 50.6604 -5.27712 0 5.277 50.66)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.036} stopColor="#FFF1E4" />
          <stop offset={1} stopColor="#3A71FF" stopOpacity={0} />
        </radialGradient>
      </defs>
    </svg>
  );
}
