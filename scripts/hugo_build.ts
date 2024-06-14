/*
The hugo.toml looks like this:

baseURL = "http://localhost:1313/v0.11.2"
contentDir = "content/v0.11.2"
publishDir = "public/v0.11.2"

we need to iterate over all the versions and build the site for each version using `hugo`

*/

// First detect all the versions (dirs in the content directory)
const { readdirSync, readFileSync } = require('fs');
const { execSync } = require('child_process');

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const versions = getDirectories('content');


//const baseURLRoot = 'http://localhost:1313';
const baseURLRoot = 'https://docs.grapycal.com';

const oldConfig = readFileSync('hugo.toml', 'utf8');

versions.forEach((version) => {
    console.log(`Building version ${version}`);
    // Change the baseURL, contentDir and publishDir in the hugo.toml
    const hugoToml = `baseURL = "${baseURLRoot}/${version}"\ncontentDir = "content/${version}"\npublishDir = "public/${version}"\n`+oldConfig;
    require('fs').writeFileSync('hugo.toml', hugoToml);
  execSync(`hugo`,{stdio: 'inherit'});
});

// build the latest version to latest
// sort the versions 'v{a}.{b}.{c}' and get the latest
const data = versions.map((v) => {
    const [a, b, c] = v.split('.').map((x) => parseInt(x));
    return { a, b, c, v };
    }).sort((a, b) => {
        if (a.a !== b.a) return a.a - b.a;
        if (a.b !== b.b) return a.b - b.b;
        return a.c - b.c;
    }
);
const latestVersion = data[data.length - 1].v;
console.log(`Building version latest (${latestVersion})`);
const hugoToml = `baseURL = "${baseURLRoot}/latest"\ncontentDir = "content/${latestVersion}"\npublishDir = "public/latest"\n`+oldConfig;
require('fs').writeFileSync('hugo.toml', hugoToml);
execSync(`hugo`);
 
// Restore the original hugo.toml
require('fs').writeFileSync('hugo.toml', oldConfig);

