SET VERSION=v0.0.5-alpha
docker build -f .\CMS.DockerFile -t docker.arragro.com/cms.arragro.com:%VERSION% . --no-cache
docker build -f .\WWW.DockerFile -t docker.arragro.com/www.arragro.com:%VERSION% . --no-cache

REM docker login docker.arragro.com
REM docker push docker.arragro.com/cms.arragro.com:%VERSION%
REM docker push docker.arragro.com/www.arragro.com:%VERSION%

docker-compose up -d