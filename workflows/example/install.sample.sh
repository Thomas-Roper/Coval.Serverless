fission env create --name binary --image fission/binary-env
fission fn create --name whalesay --env binary --deploy ./whalesay.sh
fission fn create --name fortune --env binary --deploy ./fortune.sh

fission fn create --name fortunewhale --env workflow --src ./fortunewhale.wf.yaml

./test.sample.sh
./delete.sample.sh