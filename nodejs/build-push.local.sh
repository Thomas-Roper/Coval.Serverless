docker build . --tag localhost:5000/coval:v1 $1
gcloud docker -- push localhost:5000/coval:v1
fission env delete --name covaljs
fission env create --name covaljs --image localhost:5000/coval:v1
