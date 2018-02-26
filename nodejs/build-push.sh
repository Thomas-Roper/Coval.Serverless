docker build . --tag us.gcr.io/marine-compass-175800/coval:v7 $1
gcloud docker -- push us.gcr.io/marine-compass-175800/coval:v7
fission env delete --name covaljs
fission env create --name covaljs --image us.gcr.io/marine-compass-175800/coval:v7
bash env-vars.sh
