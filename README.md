# Strapi application

Strapi CMS / Komm Kickern Website

## Docker

```sh
docker build \
  --build-arg NODE_ENV=production \
  -t kki-strapi:latest \
  -f Dockerfile.prod .
```

`--build-arg STRAPI_URL=https://api.example.com \` to set the Strapi Server URL

---

Mit registry, achtung dev url

```sh
docker build \
  --build-arg NODE_ENV=production \
  --build-arg STRAPI_URL=https://cms.dev.komm-dickern.de \
  -t docker-registry.office.silpion.de/silpion/kki-website-strapi:latest \
  -f Dockerfile.prod .
```

`docker push docker-registry.office.silpion.de/silpion/kki-website-strapi:latest`
