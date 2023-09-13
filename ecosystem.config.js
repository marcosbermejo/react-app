module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name: "fcn",
      script: "serve",
      env: {
        PM2_SERVE_PATH: './build',
        PM2_SERVE_PORT: 3000,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user: 'ubuntu',
      host: '3.249.19.249',
      ref: 'origin/main',
      repo: 'git@github.com:marcosbermejo/react-app.git',
      path: '/var/www/html/fcn',
      key: '/home/marcos/ana.pem',
      ssh_options: ['ForwardAgent=yes'],
      'pre-deploy-local': `scp -i /home/marcos/ana.pem .env.production ubuntu@3.249.19.249:/var/www/html/fcn/source`,
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    },
    staging: {},
    dev : {}
  }
};