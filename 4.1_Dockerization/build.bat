cd frontend && docker build . -t frontend
cd ..
cd playlist && docker build . -t playlist
cd ..
cd songs && docker build . -t songs
cd ..
cd router && docker build . -t mynginx
cd ..