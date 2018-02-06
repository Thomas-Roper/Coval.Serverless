docker build . --tag us.gcr.io/marine-compass-175800/coval:v1 $1
gcloud docker -- push us.gcr.io/marine-compass-175800/coval:v1
fission env delete --name covaljs
fission env create --name covaljs --image us.gcr.io/marine-compass-175800/coval:v1
cat 'test.env' | while read LINE
do
    kubectl set env deployment --containers=covaljs $LINE --all --namespace=fission-function
done