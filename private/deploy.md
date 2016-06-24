# Past the deploy script NOT AS ROOT !!!
cd
rm -rf coton-source
rm -rf builds
git clone https://github.com/guidouil/Coton.git coton-source
cd coton-source
meteor build ../builds/. --server-only
cd ../builds/
tar xzf coton-source.tar.gz
cd
forever stop coton
rm -rf coton
cd builds
mv bundle ../coton
cd ../coton/programs/server/
npm install
cd
export MONGO_URL='mongodb://127.0.0.1:27017/coton'
export PORT=8080
export ROOT_URL='http://coton.cmapage.com/'
forever start --append --uid "coton" coton/main.js
