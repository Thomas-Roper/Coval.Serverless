name=$1
route=`fission route list | grep $name | cut -d ' ' -f 1`
echo Deleting $name and Route $route
fission fn delete --name $name
fission route delete --name $route
#fission fn create --name $name --url /$name --src $name.js --env covaljs