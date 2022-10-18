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
