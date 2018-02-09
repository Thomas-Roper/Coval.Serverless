FISSION_URL=http://$(kubectl --namespace fission get svc controller -o=jsonpath='{..ip}')
FISSION_ROUTER=$(kubectl --namespace fission get svc router -o=jsonpath='{..ip}')