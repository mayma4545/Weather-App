const fs = require('fs');
const html = fs.readFileSync('views/crop-management.html', 'utf8');
const modalIdx = html.indexOf('id="add-plot-modal"');
const before = html.substring(0, modalIdx);
let openDivs = 0;
let tags = [];

const regex = /<\/?div[^>]*>/gi;
let match;
while ((match = regex.exec(before)) !== null) {
    if (match[0].startsWith('<div')) {
        openDivs++;
        tags.push(match[0]);
    } else if (match[0].startsWith('</div')) {
        openDivs--;
        tags.pop();
    }
}
console.log('Unclosed divs before modal:', openDivs);
console.log('Currently inside:', tags.map(t => {
    const classMatch = t.match(/class="([^"]+)"/);
    const idMatch = t.match(/id="([^"]+)"/);
    return (classMatch ? '.' + classMatch[1] : '') + (idMatch ? '#' + idMatch[1] : '');
}));