# mjml-nunjucks-boilerplate
Churning out those EDMs without a sweat. ;)

MJML boilerplate on top of nunjucks, to support building mjml components using nunjucks.

## Motivation
MJML has boilerplate that support custom component development. [Reference](https://github.com/mjmlio/mjml-component-boilerplate)

It's using GULP to build the mailer with the custom component.

Reason of creating this boilerplate:
- GULP no longer being maintained
- I feel that, there is a bit of learning curve to understand how to build the custom component.
- I am super familiar with nunjucks, technically, we can use macro to create mail component. macro will spit out MJML content

## Pre-requisite
* [Node](https://nodejs.org/en/) 14.19.1 / [npm](https://www.npmjs.com/) 6.14.16
    * Recommend installing with [nvm](https://github.com/creationix/nvm)
* [Webpack] 5.70.0 (https://webpack.js.org/)

## Stacks
* MJML
* Nunjucks
* Webpack 5
* BrowserSync

## Code structure
* `src` folder
    - **to create mail:**
      1. go to `src/mails`, create new file
      2. in newly created njk file. add the following content:
      ```
      {% extends "base.njk" %}

      {% block mail_content %}
        [MJML content]
        <mj-section>
          <mj-column>
            <mj-text>
            Hello world
            </mj-text>
          </mj-column>
        </mj-section>
      {% endblock %}


      ```


  - **Creating new component:**
      1. go to `src/components`, create new component file
      2. and fire away, write those MJML markup


```
.
+-- webpack-plugins
|   +-- nunjucks-build.ts
|   +-- utils.ts
+-- src
|   +-- components
|       +-- any other components
|   +-- mails
|       +-- any other mail
|   +-- base.njk
|   +-- index.ts
+-- tsconfig.json
+-- webpack.config.ts

```

## Quickstart

### Dev
`npm run dev` and visit `http://localhost:3000/[mailer-name].html`

### Build
`npm run build`, those piping hot EDMs in `dist`folder are ready to be used.
