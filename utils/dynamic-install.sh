name=$1
echo Installing $name
fission fn create --name $name --url /$name --src $name.js --env covaljs
bash dynamic-update.sh $name