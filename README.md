# @pipelinesolucoes/carousel

Biblioteca de **componentes de carrossel para React**, desenvolvida para **padronização visual**, **reutilização** e **escalabilidade** em aplicações modernas e design systems.

Este pacote faz parte do ecossistema de componentes da **Pipeline Soluções**.

---

## 📦 Componentes disponíveis

A biblioteca inclui os seguintes componentes:

- **HorizontalMarquee**: 
  Componente de marquee horizontal para exibição contínua (loop infinito) de uma sequência 
  de elementos React, como cards, imagens, chips, logos ou qualquer conteúdo renderizável.  

- **CarouselCircular**  
  Componente de carrossel animado com disposição circular simulada, responsável por exibir
  uma sequência de imagens com destaque progressivo no item central e transição automática
  em intervalos regulares. O componente utiliza Framer Motion para animações de posição,
  escala e opacidade, criando um efeito visual de profundidade.

- **ImageCarousel**  
  Componente de carrossel de imagens com transição por fade (opacidade) e controle por “dots”.
  Suporta autoplay opcional com intervalo configurável e aceita a lista de imagens tanto como
  URLs (`string`) quanto como objetos contendo `src` e `alt`.
  
---

## ✨ Características

- ✅ Pronto para produção
- 🎨 Integração com Material UI
- ♿ Foco em acessibilidade
- 🧩 Ideal para design systems
- 🔄 Reutilizável em múltiplos projetos
- 📦 Publicado no npm com versionamento semântico
- 🔐 Preparado para licenciamento por projeto

---

## 📥 Instalação

```
bash
npm install @pipelinesolucoes/carousel 
ou
yarn 
add @pipelinesolucoes/carousel
```
⚠️ Este pacote pode exigir autenticação via npm para acesso, conforme o tipo de licença adquirida.

## 🚀 Uso básico

```
import { ImageCarousel } from "@pipelinesolucoes/carousel";

export function Example() {
  return (
    <ImageCarousel 
      width="100%"
      height="100%"
      images={[ '/image1.png', '/image2.png', '/image3.png' ]}
      dotColor="#eeeeee"
      activeDotColor="blue"
      autoPlay={true}
      autoPlayInterval={4000}        
    />   
  );
}
```

## 🧩 Uso em Design Systems

Este pacote foi projetado para:

 - padronização de ações e navegação
 - reutilização entre projetos
 - evolução incremental de UI
 - integração com temas e tokens de design

Pode ser utilizado de forma isolada ou como parte de um design system maior.

---

## 🔐 Licença de uso comercial

Este pacote faz parte de uma solução comercial da Pipeline Soluções.

O acesso e uso do pacote são controlados por contas npm autorizadas, vinculadas à organização da Pipeline Soluções.

**O que isso significa?**

  - O pacote pode ser instalado apenas por usuários npm previamente autorizados.
  - Cada conta npm autorizada representa uma licença de uso ativa.
  - O uso é permitido exclusivamente para os projetos acordados comercialmente.

  ℹ️ O controle técnico é feito por conta npm.
   A definição de escopo de uso (quantidade de projetos) é contratual.


## 📄 Escopo de uso autorizado

Cada conta npm licenciada está autorizada a utilizar o pacote conforme os termos comerciais acordados.

Por padrão, considera-se:

  ✔ Uso autorizado para **um projeto principal**
  ✔ Ambientes de desenvolvimento, staging e homologação incluídos
  ❌ Redistribuição, sublicenciamento ou compartilhamento de credenciais não permitidos

A Pipeline Soluções reserva-se o direito de **revogar o acesso** em caso de uso indevido.

---

## 📌 Observação importante sobre controle de uso

O npm **não fornece controle técnico** de uso por projeto ou domínio.

Dessa forma:

  - O controle de acesso é feito por usuário npm
  - O uso em projetos adicionais deve respeitar os termos contratuais
  - O não cumprimento pode resultar na suspensão do acesso ao pacote

## 🔁 Versionamento

Este projeto segue Semantic Versioning (SemVer):

1.0.1 – Correção de bugs
1.1.0 – Nova funcionalidade compatível
2.0.0 – Mudança incompatível
1.0.0-beta.x – Versões beta

Para listar as versões publicadas:

```
npm view @pipelinesolucoes/carousel versions --json
```

## 🚀 Processo de publicação

Este pacote é publicado exclusivamente via **CI/CD** utilizando **GitHub Actions.**

Características do processo:

 - Publicação apenas por **tags Git** (vX.Y.Z)
 - Autenticação via **Trusted Publishing (OIDC)**
 - Nenhum token npm armazenado
 - Tokens clássicos desabilitados
 - **Autenticação em dois fatores (2FA) obrigatória**
 - Publicações seguras, rastreáveis e reprodutíveis

 ---

## ⚙️ Configuração de acesso (via npm)

O acesso a este pacote é controlado por **conta npm autorizada**, vinculada à organização **Pipeline Soluções.**

**Requisitos obrigatórios**

Para utilizar este pacote, o cliente deve:

  - possuir uma conta npm própria
  - estar autorizado pela Pipeline Soluções (organização / team)
  - ter autenticação em dois fatores (2FA) habilitada
  - criar um token npm granular (read-only) para uso em ambientes de build/deploy

## 🔐 Token npm (para build e deploy)

O cliente deve criar um Granular Access Token no npm com as seguintes configurações:

  - Tipo: **Read-only**
  - Escopo: @pipelinesolucoes
  - Autenticação em dois fatores (2FA) ativa
  - Expiração definida (ex.: 90 dias)

Esse token deve ser configurado como variável de ambiente no projeto:

```
NPM_TOKEN=SEU_TOKEN_AQUI
```

## 📦 Arquivo .npmrc no projeto

Na raiz do projeto (junto ao package.json), deve existir o arquivo .npmrc com o seguinte conteúdo:

```
@pipelinesolucoes:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
always-auth=true
```


## 📬 Aquisição de licença e contato

Para adquirir uma licença comercial ou obter mais informações:

📧 contato@pipelinesolucoes.com.br
🌐 https://www.pipelinesolucoes.com.br

--- 

Esse arquivo permite que o processo de build instale o pacote privado de forma segura.

## ℹ️ Observação importante

  - O controle técnico de acesso é feito exclusivamente por conta npm autorizada
  - Não há, no momento, validação técnica por projeto ou domínio
  - A utilização do pacote deve respeitar os termos comerciais acordados
  - A Pipeline Soluções pode revogar o acesso removendo a conta do team autorizado

  Futuras evoluções podem incluir mecanismos adicionais de licenciamento, sem impacto na API pública do pacote.

## 📄 Licença

Copyright © Pipeline Soluções

Este software é **proprietário** e licenciado para uso comercial restrito, conforme os termos acordados entre as partes.

O uso está condicionado à manutenção de uma **conta npm autorizada** na organização Pipeline Soluções.

Consulte o arquivo LICENSE para mais informações.

