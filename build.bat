SET VERSION=v5.0.3-dev
REM docker build -f .\CMS.DockerFile -t docker.arragro.com/cms.arragro.com:%VERSION% .
docker build -f .\WWW.DockerFile -t docker.arragro.com/www.arragro.com:%VERSION% .
REM docker build -f .\jobs\arragro_com_hostedservices\DockerFile -t docker.arragro.com/arragro_com_hostedservices:%VERSION% .

REM docker tag docker.arragro.com/cms.arragro.com:%VERSION% arragro.azurecr.io/cms.arragro.com:%VERSION%
REM docker tag docker.arragro.com/www.arragro.com:%VERSION% arragro.azurecr.io/www.arragro.com:%VERSION%
REM docker tag docker.arragro.com/arragro.com.functions:%VERSION% arragro.azurecr.io/arragro.com.functions:%VERSION%

docker login docker.arragro.com
REM docker push docker.arragro.com/cms.arragro.com:%VERSION%
docker push docker.arragro.com/www.arragro.com:%VERSION%
REM docker push docker.arragro.com/arragro_com_hostedservices:%VERSION%

REM docker-compose up -d


REM docker login arragro.azurecr.io
REM docker push arragro.azurecr.io/cms.arragro.com:%VERSION%
REM docker push arragro.azurecr.io/www.arragro.com:%VERSION%
REM docker push arragro.azurecr.io/arragro.com.functions:%VERSION%