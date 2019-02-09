const path = require('path')

const assertString = (param, message) => {
  if (param && typeof param !== 'string') { throw Error(`AssertionError: ${message}`) }
}

const assertBool = (param, message) => {
  if (param && typeof param !== 'boolean') { throw Error(`AssertionError: ${message}`) }
}

/**
 * This parses truffle config from cli arguments and truffle-config.js
 * @param config Truffle config object
 * @return {{targetPath: string, outputPath: string, includeOnly: *}}
 */
const parse = (config) => {
  // -t, --target    Path to read built artifacts of contracts. default path is 'build/contracts
  assertString(config.target, '--target should have string argument')
  assertString(config.t, '-t should have string argument')

  // -o, --output    Path to write modularized js file. default path is src/index.js
  assertString(config.output, '--output should have string argument')
  assertString(config.o, '-o should have string argument')

  // --network      Name of the network to save
  assertString(config.network, '--network should have string argument')
  assertString(config.n, '-n should have string argument')

  // -a, --all       It will modularize all contracts
  assertBool(config.all, '--all should have no argument')

  // Get the path of target artifacts
  let targetPath, outputPath, includeOnly, networks

  // Parse targetPath
  if (config.target || config.t) {
    // cli options are first
    targetPath = config.target ? config.target : config.t
  } else if (config.modularizer && config.modularizer.target) {
    // if there's no cli option, check truffle-config.js
    targetPath = path.join(config.working_directory, config.modularizer.target)
  } else if (config.contracts_build_directory) {
    // if there's default contracts_build_directory configuration
    targetPath = path.join(config.contracts_build_directory)
  } else {
    // default setting
    targetPath = path.join(config.working_directory, 'build', 'contracts')
  }

  // Parse outputPath
  if (config.output || config.o) {
    // cli options are first
    outputPath = config.output ? config.output : config.o
  } else if (config.modularizer && config.modularizer.output) {
    // if there's no cli option, check truffle-config.js
    outputPath = path.join(config.working_directory, config.modularizer.output)
  } else {
    // default setting
    outputPath = path.join(config.working_directory, 'src', 'index.js')
  }

  // Parse networks
  if (config.network || config.n) {
    // cli options are first
    let networkName = config.network ? config.network : config.n
    let network = config.networks[networkName]
    if (!network) throw Error(`network ${config.network} is not defined in the truffle config file`)
    networks = [network.network_id.toString()]
  } else if (config.modularizer && config.modularizer.networks) {
    // if there's no cli option, check truffle-config.js
    networks = config.modularizer.networks
    // TODO type check (array)
    networks = networks.map(networkId => networkId.toString())
  } else {
    // default setting, includes all networks
    networks = undefined
  }

  // Parse includeOnly
  if (config.all) {
    // cli options are first, includes all contracts in the target dircetory
    includeOnly = undefined
  } else if (config._.length > 1) {
    // if there's no --all flag and it receives arguments from cli
    includeOnly = config._.slice(1)
  } else if (config.modularizer && config.modularizer.includeOnly) {
    // if there's no --all flag, and no args from cli, check truffle-config.js
    includeOnly = config.modularizer.includeOnly
  } else {
    // default setting, includes all
    includeOnly = undefined
  }

  return { targetPath, outputPath, includeOnly, networks }
}

module.exports = {
  parse
}
