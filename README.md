# SVG -> Embedded Font Converter / React Component Builder

Utility which convert an SVG image into a React Component as a colorizable and stylable, Base64-encoded, embedded font.

Upload a SVG file; Download a zipped React Component for direct usage in a React project.

## Motivation

I wanted a simple tool to convert SVG images directly into a React Component, as a font icon, with no external dependencies, assets baked in, styled and colorizable with simple CSS.

## Screenshots

[ TODO: Add screenshots ]

## Docker Dev Command

```
PWD=`pwd` && docker run -p 8888:80 -v $PWD:/app -v /tmp:/tmp fontman
```

## Tech Used

- Docker
- Node.js
- Express
- React
- Supervisor
- PM2
- Nginx

## License

MIT License [ TODO: Link to license ]