# Past the deploy script NOT AS ROOT !!!
cd
rm -rf cotton-source
rm -rf builds
git clone https://github.com/guidouil/Cotton.git cotton-source
cd cotton-source
meteor build ../builds/. --server-only
cd ../builds/
tar xzf cotton-source.tar.gz
cd
forever stop cotton
rm -rf cotton
cd builds
mv bundle ../cotton
cd ../cotton/programs/server/
npm install
cd
export MONGO_URL='mongodb://127.0.0.1:27017/cotton'
export PORT=8080
export ROOT_URL='http://cotton.cmapage.com/'
forever start --append --uid "cotton" cotton/main.js
