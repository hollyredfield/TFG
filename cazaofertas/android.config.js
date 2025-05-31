/**
 * Android specific configuration for Capacitor
 * This file contains settings that will be applied to the Android project
 */

module.exports = {
  // Android app configuration
  android: {
    // Package name for Android app (should match appId in capacitor.config.json)
    packageName: "io.cazaofertas.app",
    
    // App name as displayed on the device
    appName: "CazaOfertas",
    
    // Version code (increment for each release)
    versionCode: 1,
    
    // Version name displayed to users
    versionName: "1.0.0",
    
    // Minimum SDK version
    minSdkVersion: 22,
    
    // Target SDK version
    targetSdkVersion: 33,
    
    // Build configuration
    buildOptions: {
      // Gradle build options
      keystorePath: null,
      keystorePassword: null,
      keyAlias: null,
      keyPassword: null,
      
      // Build types
      debug: {
        signingConfig: null
      },
      release: {
        signingConfig: null
      }
    },
    
    // Dependencies to include
    dependencies: {},
    
    // Additional gradle configurations
    gradleConfig: {}
  }
};
