#!/bin/sh

# Delete old changelogs
rm -rf ./lib/fork-me/CHANGELOG.md
rm -rf ./examples/nextjs/CHANGELOG.md
rm -rf ./examples/remix/CHANGELOG.md
rm -rf ./examples/vite/CHANGELOG.md

# Update README
sed -i -e "s/mayank1513\/turborepo-template/$1\/$2/g" README.md
sed -i -e "s/react18-tools\/turborepo-template/$1\/$2/g" README.md
sed -i -e "s/@mayank1513\/fork-me/$2/g" README.md
sed -i -e "s/my-turborepo/$2/g" README.md
sed -i -e "s/my-turborepo/$2/g" contributing.md
sed -i -e "s/## Introduction/## Install\n\n\`\`\`bash\n$ pnpm add $2\n\`\`\`\n\nor\n\n\`\`\`bash\n$ npm install $2\n\`\`\`\n\nor\n\n\`\`\`bash\n$ yarn add $2\n\`\`\`\n/" README.md
sed -i -e "s/This template is based on the official.*//" README.md
sed -i -e "s/.*Craete new GitHub repository.*//" README.md
sed -i -e "s/.*Click \`Use this template\`.*//" README.md
sed -i -e "s/.*Set your library name as repository name.*//" README.md
sed -i -e "s/.*Click \`Create repository\`.*//" README.md
sed -i -e "s/# Turborepo template/# $2/" README.md
sed -i -e "s/https:\/\/react18-tools.github.io\/turborepo-template/https:\/\/$1.github.io\/$2/g" README.md

# Update links in shared-ui
cd packages/shared-ui/src
sed -i -e "s/react18-tools\/turborepo-template/$1\/$2/g" root-layout.tsx
sed -i -e "s/react18-tools\/turborepo-template/$1\/$2/g" cards/star-me-card.tsx
sed -i -e "s/react18-tools\/turborepo-template/$1\/$2/g" cards/description.tsx
sed -i -e "s/react18-tools/$1/g" cards/index.tsx
sed -i -e "s/turborepo-template/$2/g" cards/index.tsx
sed -i -e "s/turborepo-template/$2/g" common/logo.tsx

# Clean up featured NPM packages
sed -i -e "s/<Featured \/>/<h2>Create examples for your library here.<\/h2>/" examples/index.tsx
sed -i -e "s/import Featured.*//" examples/index.tsx
rm -rf examples/featured.json
rm -rf examples/featured.tsx
cd ../../../

# Update package.json for all workspaces
sed -i -e "s/turborepo-template/$2/" package.json
cd lib/fork-me
sed -i -e "s/.*version.*/\t\"version\": \"0.0.0\",/" package.json
sed -i -e "s/.*name.*/\t\"name\": \"$2\",/" package.json
sed -i -e "s/react18-tools\/turborepo-template/$1\/$2/" package.json
sed -i -e "s/\/tree\/main\/packages\/fork-me//" package.json
sed -i -e "s/\"doc\": \"typedoc\"/\"doc\": \"cp -f ..\/..\/README.md README.md \&\& typedoc\"/" package.json

# Update touchup.js to copy readme from root of the repo
sed -i -e "s/__dirname, \"README.md\"/__dirname, \"..\", \"..\", \"README.md\"/" touchup.js

cd ../../examples/nextjs
sed -i -e "s/.*version.*/\t\"version\": \"0.0.0\",/" package.json
sed -i -e "s/\"@mayank1513\/fork-me\"/\"@mayank1513\/fork-me\": \"latest\",\n\t\t\"$2\"/" package.json

cd ../vite
sed -i -e "s/.*version.*/\t\"version\": \"0.0.0\",/" package.json
sed -i -e "s/\"@mayank1513\/fork-me\"/\"@mayank1513\/fork-me\": \"latest\",\n\t\t\"$2\"/" package.json

cd ../remix
sed -i -e "s/.*version.*/\t\"version\": \"0.0.0\",/" package.json
sed -i -e "s/\"@mayank1513\/fork-me\"/\"@mayank1513\/fork-me\": \"latest\",\n\t\t\"$2\"/" package.json

cd ../../packages/shared-ui
sed -i -e "s/.*version.*/\t\"version\": \"0.0.0\",/" package.json
sed -i -e "s/\"@mayank1513\/fork-me\"/\"@mayank1513\/fork-me\": \"latest\",\n\t\t\"$2\"/" package.json
sed -i -e "s/\/tree\/main\/lib\/fork-me//" package.json

# update scope.js
cd ../..
sed -i -e "s/mayank1513/$1/" scope.js
sed -i -e "s/fork-me/$2/" scope.js

# rename fork-me to repo-name
mv lib/fork-me lib/$2

# Add preinstall scripts
sed -i -e "s/echo setup/node preinstall.js/" package.json

# change working directory in publish workflow -- GitHub doesn't allow this
# sed -i -e "s/fork-me/$2/g" .github/workflows/publish.yml

# delete this file and the setup.yml workflow - no longer needed
rm .github/workflows/setup.yml
rm setup.sh
