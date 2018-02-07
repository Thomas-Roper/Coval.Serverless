cat 'test.env' | while read LINE
do
    kubectl set env deployment --containers=covaljs $LINE --all --namespace=fission-function
done