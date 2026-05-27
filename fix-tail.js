const fs = require('fs');

const files = fs.readdirSync('views').filter(f => f.endsWith('.html') && f !== 'login.html');

for (let file of files) {
    let content = fs.readFileSync('views/' + file, 'utf8');

    // Remove the bogus </a> replacing the end of edit modal
    content = content.replace(/<\/form>\s*<\/a>\s*<\/div>\s*<\/div>/, '</form>\n    </div>\n</div>');

    // And make sure edit modal is not partially swallowed
    // Actually, in the broken regex, the <a> that triggered it was the VERY FIRST <a class="bnav-item"> which was replaced? Let's check if the bnav-item tag is still there.
    
    fs.writeFileSync('views/' + file, content, 'utf8');
}
console.log('Fixed bogus closing tags.');
