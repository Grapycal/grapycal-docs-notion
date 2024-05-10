/*
The hugo.toml looks like this:

baseURL = "http://localhost:1313/v0.11.2"
contentDir = "content/v0.11.2"
publishDir = "public/v0.11.2"

we need to iterate over all the versions and build the site for each version using `hugo`

*/

// First detect all the versions (dirs in the content directory)
const { readdirSync } = require('fs');
const { execSync } = require('child_process');

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const versions = getDirectories('content');


//const baseURLRoot = 'http://localhost:1313';
const baseURLRoot = 'https://docs.grapycal.com';

versions.forEach((version) => {
    console.log(`Building version ${version}`);
    // Change the baseURL, contentDir and publishDir in the hugo.toml
    const hugoToml = `baseURL = "${baseURLRoot}/${version}"\ncontentDir = "content/${version}"\npublishDir = "public/${version}"`;
    require('fs').writeFileSync('hugo.toml', hugoToml);
  execSync(`hugo`);
});