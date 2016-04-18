# poker-metrics-api

npm install

npm install -g babel-node

npm run start

sudo nano /etc/hosts

Adicionar o hostname: 127.0.0.1       poker-metrics.localhost

Gerar um personal token:

https://github.com/settings/tokens

Copiar o mesmo e inserir no valor da propriedade ```token:```dentro do config/github.js

Por enquanto ignora a moficação do arquivo quando inserido o token:

git update-index --assume-unchanged config/github.js
