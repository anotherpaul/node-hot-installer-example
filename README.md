# Integration plugin service example

1. Start:

```
docker-compose up -d --build
```

2. Open UI in browser: http://localhost

3. Create package for the first plugin

```
cd ./plugin-apiexchange
npm i --production && pack
```

4. Upload the plugin in UI by choosing the file and entering 'plugin-apiexchange' in the 'Plugin name' field

5. Select 'plugin-apiexchange' in the dropdown menu on the lower right and click 'Run'

6. Create package for the second plugin

```
cd ./plugin-frankfurter
npm i --production && pack
```

7. Upload the plugin in UI by choosing the file and entering 'plugin-apiexchange' in the 'Plugin name' field

8. Select 'plugin-frankfurter' in the dropdown menu on the lower right and click 'Run'
