const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'assets');
fs.mkdirSync(outDir, { recursive: true });

function writePng(name, svg, width) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
  fs.writeFileSync(path.join(outDir, name), png);
}

const flag = `
  <rect x="192" y="256" width="640" height="512" fill="#fff"/>
  <rect x="192" y="256" width="640" height="170" fill="#d64545"/>
  <rect x="192" y="598" width="640" height="170" fill="#0b3d91"/>
`;

writePng(
  'icon.png',
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <rect width="1024" height="1024" fill="#1a6fd4"/>
    ${flag}
  </svg>`,
  1024,
);

writePng(
  'splash.png',
  `<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732" viewBox="0 0 2732 2732">
    <rect width="2732" height="2732" fill="#020617"/>
    <g transform="translate(854 854)">
      <rect width="1024" height="1024" rx="192" fill="#1a6fd4"/>
      ${flag}
    </g>
  </svg>`,
  2732,
);
