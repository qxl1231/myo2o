module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'play',
      script: './server/server.js',
      exec_mode: 'cluster',
      instances: 1,
      env: {
      },
      env_staging: {
        PORT: 1027,
        NODE_ENV: 'staging'
      }
      // env_production: {
      //   PORT: 2334,
      //   NODE_ENV: 'production'
      // }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    // production: {
    //   user: 'root',
    //   host: ['10.122.70.108'],
    //   ref: 'origin/release',
    //   repo: 'git@10.173.142.47:fengff/proserver.git',
    //   path: '/mnt/pm2-projects/proserver-DA',
    //   'post-deploy': 'export PATH=$PATH:./node_modules/.bin/;cnpm install && grunt swagger --env=production && pm2 startOrRestart ecosystem.config.js --env production'
    // },
    staging: {
      user: 'root',
      host: '114.215.202.178',
      ref: 'origin/master',
      repo: 'git@gitlab.com:qxl1231/myo2o.git',
      path: '/mnt/myplay',
      'post-deploy': 'export PATH=$PATH:./node_modules/.bin/;npm install  && pm2 startOrRestart ecosystem.config.js --env staging'
    }
  }
};
