name=$1
fission fn update --name $name --code $name.js 
bash dynamic-test.sh $name