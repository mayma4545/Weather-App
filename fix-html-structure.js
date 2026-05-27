const fs = require('fs');

const files = fs.readdirSync('views').filter(f => f.endsWith('.html') && f !== 'login.html');

for (let file of files) {
    let content = fs.readFileSync('views/' + file, 'utf8');

    // Only wrap if not already wrapped
    if (!content.includes('<!DOCTYPE html>')) {
        // Find if it has <meta name="viewport" ...> at the top.
        const metaTag = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
        content = content.replace(metaTag, '');
        
        let customStyles = '';
        if (file === 'crop-management.html') {
             customStyles = `\n    <link rel="stylesheet" href="/css/crop-management.css">`;
        }

        const newHeader = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farmer Dashboard - ${file.replace('.html', '').replace('-', ' ')}</title>
    <link rel="stylesheet" href="/css/farmer-dashboard.css">${customStyles}
</head>
<body>
`;

        const newFooter = `
</body>
</html>`;

        // If the content ends with <!-- JavaScript Engine --> or similar, wrap it
        fs.writeFileSync('views/' + file, newHeader + content.trim() + newFooter, 'utf8');
    }
}

console.log('HTML structures added successfully.');
