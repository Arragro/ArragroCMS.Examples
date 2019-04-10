SET VERSION=v0.0.25-alpha
docker build -f .\CMS.DockerFile -t docker.arragro.com/cms.arragro.com:%VERSION% . --no-cache
REM docker build -f .\WWW.DockerFile -t docker.arragro.com/www.arragro.com:%VERSION% . --no-cache
REM docker build -f .\Functions.DockerFile -t docker.arragro.com/arragro.com.functions:%VERSION% . --no-cache

docker tag docker.arragro.com/cms.arragro.com:%VERSION% arragro.azurecr.io/cms.arragro.com:%VERSION%
docker tag docker.arragro.com/www.arragro.com:%VERSION% arragro.azurecr.io/www.arragro.com:%VERSION%
docker tag docker.arragro.com/arragro.com.functions:%VERSION% arragro.azurecr.io/arragro.com.functions:%VERSION%

docker login docker.arragro.com
docker push docker.arragro.com/cms.arragro.com:%VERSION%
docker push docker.arragro.com/www.arragro.com:%VERSION%
docker push docker.arragro.com/arragro.com.functions:%VERSION%

docker-compose up -d

docker login arragro.azurecr.io
docker push arragro.azurecr.io/cms.arragro.com:%VERSION%
docker push arragro.azurecr.io/www.arragro.com:%VERSION%
docker push arragro.azurecr.io/arragro.com.functions:%VERSION%