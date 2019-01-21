cd FrontEnd && start npm run serve
cd ../Router && start nginx -c nginx.conf
cd ../Playlist && start npm start
cd ../Songs && start npm start 
cd ..
start http://localhost:3080/
