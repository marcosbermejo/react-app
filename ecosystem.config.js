module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name      : 'my_react_app',
      script    : 'npm',
      args      : 'run start:production',
      env_production : {
        NODE_ENV: 'production'
      }
    },
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
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    staging: {},
    dev : {}
  }
};