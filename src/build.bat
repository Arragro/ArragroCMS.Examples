SET VERSION=v0.0.15-alpha
docker build -f .\CMS.DockerFile -t docker.arragro.com/cms.arragro.com:%VERSION% . --no-cache
docker build -f .\WWW.DockerFile -t docker.arragro.com/www.arragro.com:%VERSION% . --no-cache

docker login docker.arragro.com
docker push docker.arragro.com/cms.arragro.com:%VERSION%
docker push docker.arragro.com/www.arragro.com:%VERSION%

docker-compose up -d