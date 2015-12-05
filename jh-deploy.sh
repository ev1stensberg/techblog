#!/usr/bin/env sh

# Deploy if gulp deploy does not work due to 2-factor auth

MSG=$(git log -n1 --pretty=oneline --abbrev-commit)
echo "> Going to deploy '$MSG'"
rm -rf build
gulp build:prod
cd build/
cp -r * ../.publish/
cd ../.publish/
git add .
git commit -m "$MSG"
echo "> Pushing ... $(git log -n1 --pretty=oneline --abbrev-commit)"
git push origin gh-pages
cd ..
echo "> DONE"
