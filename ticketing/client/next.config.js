module.exports = {
    webpack: (config) => {
        //tell webpack middleware not to 
        //automatically check file updates
        //instead, pull all files into our directory
        //every 300 milliseconds
      config.watchOptions.poll = 300;
      return config;
    },
  };