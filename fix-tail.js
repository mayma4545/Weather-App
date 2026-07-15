const fs = require('fs');

const files = fs.readdirSync('views').filter(f => f.endsWith('.html') && f !== 'login.html');

for (let file of files) {
    let content = fs.readFileSync('views/' + file, 'utf8');

    content = content.replace(/<\/form>\s*<\/a>\s*<\/div>\s*<\/div>/, '</form>\n    </div>\n</div>');

    
    fs.writeFileSync('views/' + file, content, 'utf8');
}
console.log('Fixed bogus closing tags.');
