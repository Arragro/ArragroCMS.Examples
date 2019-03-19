SET VERSION=v0.0.16-alpha
REM docker build -f .\CMS.DockerFile -t docker.arragro.com/cms.arragro.com:%VERSION% . --no-cache
REM docker build -f .\WWW.DockerFile -t docker.arragro.com/www.arragro.com:%VERSION% . --no-cache

docker login docker.arragro.com
docker push docker.arragro.com/cms.arragro.com:%VERSION%
docker push docker.arragro.com/www.arragro.com:%VERSION%

REM docker-compose up -d