# Sobre

  Este projeto é uma biblioteca React preparada para publicação no npm. 
  Essa biblioteca contem componentes de Carrossel.
  Abaixo está o passo a passo para publicar ou atualizar a lib.

# Pré-requisitos

    1. Conta no NPM
        - Crie uma conta em: https://www.npmjs.com/signup

    2. Node.js instalado
        - Recomenda-se uma versão LTS. Verifique com: node -v
        - Login no NPM pelo terminal: npm login
          npm: pipeline-solucoes
          senha:pipesollinecoes
          key: pipeline@12345#

# Como Publicar a biblioteca:

   2. No package.json, altere o campo version de acordo com a semântica de versionamento.
    1.0.1 – correção de bug
    1.1.0 – nova funcionalidade compatível
    2.0.0 – mudanças incompatíveis

    - para publicar versão beta: "1.0.0-beta.x"

  3. Comando para versao beta: npm run release-beta
  