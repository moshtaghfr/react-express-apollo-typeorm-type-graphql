# WnS project

## Development

Run in development environment with live reloading:

```
WEB_CLIENT_PORT=3000 API_PORT=4000 docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## Testing

```
./test.sh
```

Test API only:

```
./test-api.sh
```

Test web client only:

```
./test-web-client.sh
```

## Deployment

Run in production environment:

```
GATEWAY_PORT=8000 docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```
