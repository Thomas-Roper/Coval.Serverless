docker build . --tag us.gcr.io/marine-compass-175800/coval:v1 --no-cache
gcloud docker -- push us.gcr.io/marine-compass-175800/coval:v1
fission env delete --name covaljs
fission env create --name covaljs --image us.gcr.io/marine-compass-175800/coval:v1