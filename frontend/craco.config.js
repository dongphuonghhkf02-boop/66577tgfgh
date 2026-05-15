// craco.config.js
const path = require("path");
require("dotenv").config();

// Check if we're in development/preview mode (not production build)
// Craco sets NODE_ENV=development for start, NODE_ENV=production for build
const isDevServer = process.env.NODE_ENV !== "production";

// Environment variable overrides
const config = {
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
};

// Conditionally load health check modules only if enabled
let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

let webpackConfig = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {

      // Allow CSS to reference assets in /public via absolute URLs like url(/file.png).
      // By default css-loader tries to resolve such URLs as webpack modules and fails.
      // We instruct css-loader to skip URL resolution for paths starting with "/".
      try {
        const oneOfRule = webpackConfig.module.rules.find((r) => Array.isArray(r.oneOf));
        if (oneOfRule && oneOfRule.oneOf) {
          oneOfRule.oneOf.forEach((rule) => {
            if (!rule.use || !Array.isArray(rule.use)) return;
            rule.use.forEach((u) => {
              if (
                u &&
                typeof u === "object" &&
                u.loader &&
                u.loader.includes("css-loader") &&
                !u.loader.includes("postcss-loader") &&
                u.options
              ) {
                const existingUrl = u.options.url;
                u.options.url = {
                  filter: (url /*, resourcePath */) => {
                    if (typeof url !== "string") return true;
                    // skip absolute paths and protocol urls — they are resolved by the dev server / browser from /public
                    if (url.startsWith("/")) return false;
                    if (/^[a-z]+:\/\//i.test(url)) return false;
                    if (url.startsWith("//")) return false;
                    if (url.startsWith("data:")) return false;
                    if (typeof existingUrl === "object" && typeof existingUrl.filter === "function") {
                      return existingUrl.filter(url);
                    }
                    return true;
                  },
                };
              }
            });
          });
        }
      } catch (e) {
        console.warn("[craco] Could not patch css-loader url option:", e && e.message);
      }

      // Add ignored patterns to reduce watched directories
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/build/**',
            '**/dist/**',
            '**/coverage/**',
            '**/public/**',
        ],
      };

      // Add health check plugin to webpack if enabled
      if (config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }
      return webpackConfig;
    },
  },
};

webpackConfig.devServer = (devServerConfig) => {
  // Add health check endpoints if enabled
  if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
    const originalSetupMiddlewares = devServerConfig.setupMiddlewares;

    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      // Call original setup if exists
      if (originalSetupMiddlewares) {
        middlewares = originalSetupMiddlewares(middlewares, devServer);
      }

      // Setup health endpoints
      setupHealthEndpoints(devServer, healthPluginInstance);

      return middlewares;
    };
  }

  return devServerConfig;
};

// Wrap with visual edits (automatically adds babel plugin, dev server, and overlay in dev mode)
if (isDevServer) {
  try {
    const { withVisualEdits } = require("@emergentbase/visual-edits/craco");
    webpackConfig = withVisualEdits(webpackConfig);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && err.message.includes('@emergentbase/visual-edits/craco')) {
      console.warn(
        "[visual-edits] @emergentbase/visual-edits not installed — visual editing disabled."
      );
    } else {
      throw err;
    }
  }
}

module.exports = webpackConfig;
