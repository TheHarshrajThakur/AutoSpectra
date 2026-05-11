const fs = require('fs');
const path = require('path');
function checkImports(dir) {
  const files = fs.readdirSync(dir);
  for(const f of files) {
    const fullPath = path.join(dir, f);
    if(fs.statSync(fullPath).isDirectory()) checkImports(fullPath);
    else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const regex = /import\s+.*from\s+['"](.*)['"]/g;
      let match;
      while((match = regex.exec(content)) !== null) {
        const importPath = match[1];
        if(importPath.startsWith('.')) {
          const resolved = path.resolve(path.dirname(fullPath), importPath);
          const dirname = path.dirname(resolved);
          const basename = path.basename(resolved);
          if(fs.existsSync(dirname)) {
            const actualFiles = fs.readdirSync(dirname);
            const exactMatch = actualFiles.find(af => af === basename || af === basename + '.js' || af === basename + '.jsx');
            if(!exactMatch) {
              const lowerMatch = actualFiles.find(af => af.toLowerCase() === basename.toLowerCase() || af.toLowerCase() === basename.toLowerCase() + '.js' || af.toLowerCase() === basename.toLowerCase() + '.jsx');
              if(lowerMatch) {
                console.log('CASE MISMATCH in ' + fullPath + ': imported ' + importPath + ' but actual file is ' + lowerMatch);
              } else {
                console.log('NOT FOUND in ' + fullPath + ': ' + importPath);
              }
            }
          }
        }
      }
    }
  }
}
checkImports('src');
